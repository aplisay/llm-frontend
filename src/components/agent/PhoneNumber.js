import React from 'react';
import Typography from '@mui/joy/Typography';
import { Call } from '@mui/icons-material';
import Tooltip from '../common/Tooltip';


export default function PhoneNumber({ tooltip, number }) {
  return (<>
    <Tooltip {...{ tooltip }} open={!!tooltip}>
      <Typography level="h6" align="left">
      {number &&
        <>Agent live on&nbsp;
            <Typography color="success" startDecorator={(<Call />)}>+{number}</Typography>
        </>}
      {!number && (<>Agent not active</>)}
    </Typography>
    </Tooltip>
  </>);



};