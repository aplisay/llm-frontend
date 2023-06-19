import { useEffect, useState } from 'react';
import { styled } from '@mui/joy/styles';
import { Button, CircularProgress, Grid, Link, Sheet, Textarea, Typography } from '@mui/joy';
import { createAgent, listAgents, updateAgent, deleteAgent } from '../lib/agent';
import SelectAgent from './SelectAgent';
import Transcript from './Transcript';

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
  
  useEffect(() => {
    listAgents().then(a => (setAgents(Object.fromEntries(a))));
  }, []);

  useEffect(() => {
    console.log({ agentName, prompt, expr: !prompt?.changed, an: `${agentName}`, def: agents[agentName]?.defaultPrompt }, 'useEffect');
    if(!prompt?.changed) {
      setPrompt({...prompt, value: agents[agentName]?.defaultPrompt})
    }
  }, [agentName]);

  const onMessage = (message) => {
    console.log({ message }, 'got message');
    if (message.prompt || message.completion)
      setTranscript((t) => ([...t, message]));
  }
  
  const buttonClick = async () => {
    if (state === 'initial' && !agent?.id) {
      setState('trying');
      let res = await createAgent({ agentName, prompt: prompt.value, onMessage });
      setAgent(res);
      setState('active');
      setTranscript([]);
    }
    else if (state === 'active' && agent?.id) {
      let res = await updateAgent({ id: agent.id, prompt: prompt.value });
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
    console.log({evt, prompt}, 'promptChange')
    setPrompt({ value: evt.target.value, changed: true });
  }

  return (

    <Grid container spacing={2} sx={{ flexGrow: 1, width: '100%'}}>

      <Grid xs={12}>
        <Item>
          <Typography sx={{ mt: 6, mb: 3 }} color="text.secondary">
            LLM Voice playground
          </Typography>
        </Item>

      </Grid>
      <Grid xs={12} sm={6}>
        <Item>
          <SelectAgent disabled={state !== 'initial'} options={agents} {...{ agentName, setAgentName }} />
        </Item>
      </Grid>
      <Grid xs={12} sm={6}>
        <Item>
          <Typography color="text.primary">
            {agent?.number ? `+${agent.number} connected` : 'Agent not created yet'}
          </Typography>
        </Item>
        {state === 'active' &&
          <Item>
            <Button sx={{ mt: 6, mb: 3 }} color="danger" onClick={disconnectClick}>Disconnect Agent</Button>
          </Item>
        }
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
      <Grid xs={12} sm={6}>
        <Item>
          <Typography sx={{ mt: 6, mb: 3 }} color="text.secondary">
            Options here
          </Typography>
        </Item>
      </Grid>
      <Grid xs={6}>
        <Item>
          <Button sx={{ mt: 6, mb: 3 }}  disabled={state === 'trying'}  onClick={buttonClick} >
            {state === 'trying' && <CircularProgress thickness={2} />}
            {state === 'active' && 'Update Agent'}
            {state === 'initial' && 'Create Agent'}
          </Button>
          </Item>
        
      </Grid>

      
    </Grid>
  );
};