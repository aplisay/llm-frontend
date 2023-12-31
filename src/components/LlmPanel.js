import { useEffect, useState } from 'react';
import { styled } from '@mui/joy/styles';
import { Button, CircularProgress, Grid, Link, Sheet, Textarea, Typography } from '@mui/joy';
import { createAgent, listAgents, updateAgent, deleteAgent } from '../lib/agent';
import SelectAgent from './SelectAgent';
import Transcript from './Transcript';
import TemperatureSlider from './TemperatureSlider';

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

  useEffect(() => {
    listAgents().then(a => (setAgents(Object.fromEntries(a))));
  }, []);

  useEffect(() => {
    if (!prompt?.changed) {
      setPrompt({ ...prompt, value: agents[agentName]?.defaultPrompt });
    }
  }, [agentName]);

  const onMessage = (message) => {
    console.log({ message }, 'got message');
    if (message.prompt || message.completion || message.call || message.data || message.hangup )
      setTranscript((t) => ([...t, message]));
  };

  const buttonClick = async () => {
    if (state === 'initial' && !agent?.id) {
      setState('trying');
      let res = await createAgent({ agentName, prompt: prompt.value, options: { temperature }, onMessage });
      setAgent(res);
      setState('active');
      setTranscript([]);
    }
    else if (state === 'active' && agent?.id) {
      let res = await updateAgent({ id: agent.id, prompt: prompt.value, options: { temperature } });
    }
  };

  const disconnectClick = async () => {
    if (state === 'active' && agent?.id) {
      setState('trying');
      let res = await deleteAgent({ id: agent.id });
      setAgent(null);
      setState('initial');
    }
  };


  const promptChange = async (evt) => {

    setPrompt({ value: evt.target.value, changed: true });
  };

  return (
    <>

    <Grid container spacing={2} sx={{ flexGrow: 1, width: '100%' }}>

      <Grid xs={12}>
        <Item>
          <Typography sx={{ mt: 6, mb: 3 }}>
            LLM Voice playground&nbsp;
            {agent?.number ? (<Typography color="danger">
              {`agent live on +${agent.number}`}
            </Typography>) :
              (<Typography color="text.secondary">
                (agent not created yet)
              </Typography>)}
          </Typography>

        </Item>

      </Grid>
      <Grid xs={12} sm={6}>
        <Item>
          <SelectAgent disabled={state !== 'initial'} options={agents} {...{ agentName, setAgentName }} placeholder="Select model" />
        </Item>
          <Item>
            <TemperatureSlider value={temperature} setValue={setTemperature} />
          </Item>
    
      </Grid>
      <Grid xs={6} sm={3}>
        <Item>
          <Button sx={{ mt: 6, mb: 3 }} disabled={state === 'trying'} onClick={buttonClick} >
            {state === 'trying' && <CircularProgress thickness={2} />}
            {state === 'active' && 'Update Agent'}
            {state === 'initial' && 'Create Agent'}
          </Button>
        </Item>
      </Grid>
      <Grid xs={6} sm={3}>
        <Item>
          {state === 'active' && <Button disabled={state !== 'active'} sx={{ mt: 6, mb: 3 }} color="danger" onClick={disconnectClick}>Disconnect Agent</Button>}
        </Item>
      </Grid>



      <Grid xs={12} sm={6}>
        <Item>
          <Textarea placeholder="Enter prompt here" value={prompt.value} name="prompt" onChange={promptChange} />
        </Item>
      </Grid>
      <Grid xs={12} sm={6}>

        <Item>
          <Transcript transcript={transcript} />
        </Item>
      </Grid>




      </Grid>
        
      </>
  );
};