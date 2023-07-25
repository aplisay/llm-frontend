import { useEffect, useState, useRef } from 'react';
import { styled } from '@mui/joy/styles';
import { Button, Grid, Sheet } from '@mui/joy';
import { createAgent, listAgents, updateAgent, deleteAgent } from '../api/agent';
import SelectAgent from './SelectAgent';
import SelectVoice from './SelectVoice';
import Transcript from './Transcript';
import TemperatureSlider from './TemperatureSlider';
import PromptInput from './PromptInput';
import AgentButton from './AgentButton';

const Item = styled(Sheet)(({ theme }) => ({
  backgroundColor: 'transparent',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  borderRadius: 4,
  color: theme.vars.palette.text.secondary,
}));

function useComponentWillUnmount(cleanupCallback = () => { }) {
  const callbackRef = useRef(cleanupCallback);
  callbackRef.current = cleanupCallback; // always up to date
  useEffect(() => {
    return () => callbackRef.current();
  }, []);
}

export default function LlmPanel({ error, setError, inform, setInform, status, ...props }) {
  let [agent, setAgent] = useState({});
  let [agentName, setAgentName] = useState();
  let [state, setState] = useState('initial');
  let [agents, setAgents] = useState([]);
  let [prompt, setPrompt] = useState({});
  let [transcript, setTranscript] = useState();
  let [temperature, setTemperature] = useState(0.2);
  let [ws, setWs] = useState();
  let [tooltip, setTooltip] = useState({});
  let [options, setOptions] = useState({});
  let [changed, setChanged] = useState(false);


  useEffect(() => {
    const tryFetch = () => {
      !agents.length && listAgents()
        .then(a => {
          setAgents(Object.fromEntries(a));
          setError(null);
        })
        .catch(err => {
          setError(`Couldn't communicate with server: ${err.message}`);
          setTimeout(tryFetch, 10000);
        });
    };
    tryFetch();
  }, []);

  useEffect(() => {
    if (status != 'loggedIn') {
      disconnect();
    }
    return () => {
      console.log({ state, ws }, 'unmounting, calling disconnect');
      disconnect();
    };
  }, [status]);


  useEffect(() => {
    if (!ws && state === 'active') {
      setError('Server disconnected, re-create agent to continue');
      disconnect();
    }
  }, [ws, state]);

  // manange progressive tooltip first time through UI
  useEffect(() => {
    if (!tooltip.done) {
      !agentName && setTooltip({
        selectAgent: { step: 1, title: 'select model', text: 'this is the AI provider model that your agent will run'}
      });
      agentName && !prompt.changed && setTooltip({
        promptInput: { step: 2, title: 'write/customise your prompt', text: 'personalise your agent here' }
      });
      agentName && prompt.changed && state === 'initial' && setTooltip({
        agentButton: {
          step: 3, title: 'create agent', text: 'set things up to call your agent'
        }
      });
      state === 'active' && !transcript.length && setTooltip({
        phoneNumber: { step: 4, title: 'call the number', text: 'grab a phone and call this number to test your agent\'s response' }
      });
      state === 'active' && transcript.length && setTooltip({
        done: true,
      });

    }
  }, [agentName, prompt, state, transcript]);



  const onMessage = (message) => {
    console.log({ message, state }, 'got message');
    if (message.prompt || message.completion || message.goodbye || message.call || message.data || message.hangup)
      setTranscript((t) => ([...t, message]));
  };

  const buttonClick = async () => {
    if (state === 'initial' && !agent?.id) {
      setState('trying');
      try {
        let res = await createAgent({ agentName, prompt: prompt.value, options: {...options,  temperature }, onMessage, onClose: () => setWs(null) });
        setPrompt({ ...prompt });
        setChanged(false);
        setWs(res.ws);
        setAgent(res);
        setState('active');
        setTranscript([]);
        setInform({ success: `Agent created and handling calls to +${res?.number}` });
      }
      catch (err) {
        setState('initial');
        setError(`Couldn't create agent: ${err.message}`);
      }
    }
    else if (state === 'active' && agent?.id) {
      await updateAgent({ id: agent.id, prompt: prompt.value, options: { ...options, temperature } });
      setChanged(false); 
      setInform({ success: 'Agent updated, will take effect from start of next call' });
    }
  };

  const changeOptions = async (newOptions) => {
    setOptions(newOptions);
    if (state === 'active' && agent?.id) {
      await updateAgent({ id: agent.id, options: { ...newOptions, temperature } });
    }

  }

  const disconnect = async () => {
    console.log({ state, agent }, 'got disconnect');
    if (state === 'active' && agent?.id) {
      setState('trying');
      await deleteAgent({ id: agent.id });
      setAgent(null);
      setWs(null);
      setState('initial');
    }
  };

  useComponentWillUnmount(() => disconnect());


  return (
    <>
      <Grid container spacing={2} sx={{ flexGrow: 1, width: '100%' }}>
        <Grid xs={12} sm={6}>
          <Item>
            <SelectAgent
              disabled={state !== 'initial'}
              options={agents}
              placeholder="Select model"
              tooltip={tooltip.selectAgent}
              {...{ agentName, setAgentName }}
            />
          </Item>
          <Item>
            <TemperatureSlider value={temperature} setValue={setTemperature} />
          </Item>
        </Grid>
        <Grid container xs={12} sm={6}>
          <Grid xs={12} md={6}>
            <Item>
              <AgentButton
                disabled={state === 'trying' || !agentName
                  || (state === 'active' && !changed)
                }
                onClick={buttonClick} state={state}
                tooltip={tooltip.agentButton}
                sx={{ width: '100%' }}
              />
            </Item>
          </Grid>
          <Grid xs={12} md={6}>
            <Item>
              {state === 'active' && <Button disabled={state !== 'active'} color="danger" onClick={disconnect} sx={{ width: '100%' }}>Disconnect Agent</Button>}
            </Item>
          </Grid>
          <Grid container xs={12}>
            <SelectVoice
              options={options}
              setOptions={changeOptions}
          />
          </Grid>
        </Grid>
        <Grid xs={12} sm={6}>
          <Item>
            <PromptInput
              prompt={prompt}
              setPrompt={(prompt) => {
                setPrompt(prompt);
                setChanged(true);
              }}
              agentName={agentName}
              agents={agents}
              tooltip={tooltip.promptInput} />
          </Item>
        </Grid>
        <Grid xs={12} sm={6}>

          <Item>
            <Transcript transcript={transcript} number={agent?.number} tooltip={tooltip.phoneNumber} />
          </Item>
        </Grid>

      </Grid>


    </>
  );
};