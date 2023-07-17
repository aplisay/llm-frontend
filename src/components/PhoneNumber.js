import React from 'react';
import Tooltip from '@mui/joy/Tooltip';
import Typography from '@mui/joy/Typography';
import { Call } from '@mui/icons-material';


export default function PhoneNumber({ tooltip, number }) {
  return (
    <Typography>
      {number &&
        <>Agent live on&nbsp;
          <Tooltip title={tooltip} arrow placement="right" open={!!tooltip} >
            <Typography color="success" startDecorator={(<Call />)}>+{number}</Typography>
          </Tooltip>
        </>}
      {!number && (<>Agent not active</>)}
    </Typography>

  );



};