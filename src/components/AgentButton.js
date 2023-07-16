import React from 'react';
import Button from '@mui/joy/Button';
import Tooltip from '@mui/joy/Tooltip';
import CircularProgress from '@mui/joy/CircularProgress';


export default function AgentButton({ tooltip, state, ...rest }) {
  return (
    <Tooltip title={tooltip} arrow placement="right" open={!!tooltip}>
      <Button {...rest} >
        {state === 'trying' && <CircularProgress thickness={2} />}
        {state === 'active' && 'Update Agent'}
        {state === 'initial' && 'Create Agent'}
      </Button>
    </Tooltip>
  );
};