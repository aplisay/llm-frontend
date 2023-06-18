import { useEffect, useState } from 'react';
import { styled } from '@mui/joy/styles';
import { Button, Grid, Link, Sheet, Textarea, Typography } from '@mui/joy';
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
  
  
  listAgents().then(a => (setAgents(a)));


  const buttonClick = () => {
    if (state === 'initial' && agent.state !== 'connected') {
      
    }

  } 






  return (

    <Grid container spacing={2} sx={{ flexGrow: 1 }}>

      <Grid xs={12}>
        <Item>
          <Typography sx={{ mt: 6, mb: 3 }} color="text.secondary">
                Pro tip: See more <Link href="https://mui.com/getting-started/templates/">templates</Link> in
            the MUI documentation.
          </Typography>
        </Item>

      </Grid>
      <Grid xs={12}>
        <Item>
          <Textarea placeholder="prpmpt" />
        </Item>
      </Grid>
      <Grid xs={12} sm={4}>
        <Item>
          <SelectAgent options={agents} {...{agentName, setAgentName}}/>
          <Button onClick={buttonClick} enabled={state === 'initial'}>{agent.started ? 'Update Agent' : 'Create Agent'}</Button>
          <Typography sx={{ mt: 6, mb: 3 }} color="text.secondary">
            {agent.number && `${agent}.number connected`}
          </Typography>
        </Item>
      </Grid>
      <Grid xs={12} sm={8}>
        <Item>
          <Sheet variant="outlined" color="neutral" sx={{ p: 4 }}>
            Hello world!
          </Sheet>
        </Item>
      </Grid>
      </Grid>


      );
};