import { useEffect, useState } from 'react';
import { styled } from '@mui/joy/styles';
import { Button, CircularProgress, Grid, Link, Sheet, Textarea, Typography } from '@mui/joy';
import { createAgent, listAgents, updateAgent, deleteAgent } from '../lib/agent';
import SelectAgent from './SelectAgent';

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
  
  useEffect(() => {
    listAgents().then(a => (setAgents(Object.fromEntries(a))));
  }, []);

  useEffect(() => {
    console.log({ agentName, prompt, expr: !prompt?.changed, an: `${agentName}`, def: agents[agentName]?.defaultPrompt }, 'useEffect');
    if(!prompt?.changed) {
      setPrompt({...prompt, value: agents[agentName]?.defaultPrompt})
    }
  }, [agentName]);
  
  const buttonClick = async () => {
    if (state === 'initial' && !agent?.id) {
      setState('trying');
      let res = await createAgent({ agentName, prompt });
      setAgent(res);
      setState('active');
    }
    else if (state === 'active' && agent?.id) {
      let res = await updateAgent({ agentName, prompt });
      setAgent(res);
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
 

  const promptChange = (value) => {
    setPrompt({ value, changed: true });
  }

  return (

    <Grid container spacing={2} sx={{ flexGrow: 1 }}>

      <Grid xs={12}>
        <Item>
          <Typography sx={{ mt: 6, mb: 3 }} color="text.secondary">
            LLM Voice playground
          </Typography>
        </Item>

      </Grid>
      <Grid xs={12}>
        <Item>
          <Textarea placeholder="prpmpt" value={prompt.value} name="prompt" onChange="promptChange" />
        </Item>
      </Grid>

      <Grid xs={12} sm={4}>
        <Item>
          <SelectAgent disabled={state !== 'initial'} options={agents} {...{ agentName, setAgentName }} />
       
        </Item>
      </Grid>
      <Grid xs={12} sm={8}>
        <Item>
          <Typography color="text.secondary">
            {agent?.number ? `+${agent.number} connected` : 'Agent not created yet'}
          </Typography>
        </Item>
        <Item>
          <Sheet variant="outlined" color="neutral" sx={{ p: 4 }}>
            Hello world!
          </Sheet>
        </Item>

      </Grid>
      <Grid xs={6}>
        <Item>
          <Button disabled={state === 'trying'}  onClick={buttonClick} >
            {state === 'trying' && <CircularProgress thickness={2} />}
            {state === 'active' && 'Update Agent'}
            {state === 'initial' && 'Create Agent'}
          </Button>
        </Item>
      </Grid>

      {state === 'active' &&
        <Grid xs={6}>
          <Item>
            <Button color="danger" onClick={disconnectClick}>Disconnect Agent</Button>
          </Item>
        </Grid>
      }
    </Grid>
  );
};