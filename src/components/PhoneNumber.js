import React from 'react';
import Tooltip from '@mui/joy/Tooltip';
import Typography from '@mui/joy/Typography';


export default function PhoneNumber({ tooltip, number }) {
  return number ? (
    <Tooltip title={tooltip} arrow placement="right" open={!!tooltip} >
      <Typography color="danger" >
        {`agent live on +${number}`}
      </Typography>
    </Tooltip>
  )
    :
    (<Typography color="text.secondary">
      (agent not created yet)
    </Typography>);


};