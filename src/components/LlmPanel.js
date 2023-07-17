import { useEffect, useState } from 'react';
import { styled } from '@mui/joy/styles';
import { Button, CircularProgress, Grid, Link, Sheet, Textarea, Typography } from '@mui/joy';
import { createAgent, listAgents, updateAgent, deleteAgent } from '../lib/agent';
import SelectAgent from './SelectAgent';
import Transcript from './Transcript';
import TemperatureSlider from './TemperatureSlider';
import ErrorAlert from './ErrorAlert';
import PromptInput from './PromptInput';
import AgentButton from './AgentButton';
import PhoneNumber from './PhoneNumber';

const Item = styled(Sheet)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark' ? theme.palette.background.level1 : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  borderRadius: 4,
  color: theme.vars.palette.text.secondary,
}));

export default function LlmPanel() {
  let [agent, setAgent] = useState({});
  let [agentName, setAgentName] = useState();
  let [state, setState] = useState('initial');
  let [agents, setAgents] = useState([]);
  let [prompt, setPrompt] = useState({});
  let [transcript, setTranscript] = useState([]);
  let [temperature, setTemperature] = useState(0.2);
  let [ws, setWs] = useState();
  let [error, setError] = useState();
  let [tooltip, setTooltip] = useState({});
  let [inform, setInform] = useState();

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
    if (!ws && state === 'active') {
      setError('Server disconnected, re-create agent to continue');
      disconnect();
    }
  }, [ws, state]);

  // manange progressive tooltip first time through UI
  useEffect(() => {
    if (!tooltip.done) {
      !agentName && setTooltip({
        selectAgent: 'Step1: select model'
      });
      agentName && !prompt.changed && setTooltip({
        promptInput: 'Step2: write/customise your prompt'
      });
      agentName && prompt.changed && state === 'initial' && setTooltip({
        agentButton: 'Step3: create agent'
      });
      state === 'active' && !transcript.length && setTooltip({
        phoneNumber: 'Step4: call the number',
      });
      state === 'active' && transcript.length && setTooltip({
        done: true,
      });

    }
  }, [agentName, prompt, state, transcript, tooltip]);



  const onMessage = (message) => {
    console.log({ message, state }, 'got message');
    if (message.prompt || message.completion || message.goodbye || message.call || message.data || message.hangup)
      setTranscript((t) => ([...t, message]));
  };

  const buttonClick = async () => {
    if (state === 'initial' && !agent?.id) {
      setState('trying');
      try {
        let res = await createAgent({ agentName, prompt: prompt.value, options: { temperature }, onMessage, onClose: () => setWs(null) });
        setPrompt({ ...prompt, changedSinceCreate: false });
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
      await updateAgent({ id: agent.id, prompt: prompt.value, options: { temperature } });
      setPrompt({ ...prompt, changedSinceCreate: false });
      setInform({ success: 'Agent updated, will take effect from start of next call' });
    }
  };

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


  return (
    <>

      <Grid container spacing={2} sx={{ flexGrow: 1, width: '100%' }}>
        <Grid xs={12}>
          <Item>
            <Typography sx={{ mt: 6, mb: 3 }}>
              LLM Voice playground&nbsp;
              <PhoneNumber number={agent?.number} tooltip={tooltip.phoneNumber} />
            </Typography>
          </Item>
        </Grid>
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
        <Grid xs={6} sm={3}>
          <Item>
            <AgentButton
              sx={{ mt: 6, mb: 3 }}
              disabled={state === 'trying' || !agentName
                || (state === 'active' && !prompt.changedSinceCreate)
              }
              onClick={buttonClick} state={state}
              tooltip={tooltip.agentButton} />
          </Item>
        </Grid>
        <Grid xs={6} sm={3}>
          <Item>
            {state === 'active' && <Button disabled={state !== 'active'} sx={{ mt: 6, mb: 3 }} color="danger" onClick={disconnect}>Disconnect Agent</Button>}
          </Item>
        </Grid>
        <Grid xs={12} sm={6}>
          <Item>
            <PromptInput prompt={prompt} setPrompt={setPrompt} agentName={agentName} agents={agents} tooltip={tooltip.promptInput} />
          </Item>
        </Grid>
        <Grid xs={12} sm={6}>

          <Item>
            <Transcript transcript={transcript} />
          </Item>
        </Grid>




      </Grid>
      <ErrorAlert {...{ error, setError, inform, setInform }} />

    </>
  );
};