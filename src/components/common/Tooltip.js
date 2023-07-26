import React from 'react';
import JoyTooltip from '@mui/joy/Tooltip';
import Typography from '@mui/joy/Typography';
import Box from '@mui/joy/Box';
import { Sheet } from '@mui/joy';


const TipLayout = ({ step, title, text }) => {
  return (<Sheet
    sx={{
      display: 'flex',
      flexDirection: 'column',
      maxWidth: 320,
      justifyContent: 'center',
      p: 1,
    }}
  >
    <Typography
      fontSize="sm"
      level="h6"
      color="primary"
    >
      {step && `Step ${step}:`}
    </Typography>
    <Box sx={{ display: 'flex', gap: 1, width: '100%', mt: 1 }}>
      <Box>
        <Typography level="h4">
          {title}
        </Typography>
        <Typography level="body2" fontSize="sm" sx={{ mb: 1 }}>
          {text}
        </Typography>
      </Box>
    </Box>
  </Sheet>);
}


export default function Tooltip({ tooltip, title, ...rest }) {

  return (
    <JoyTooltip title={(tooltip?.title) ? (<TipLayout {...tooltip} />) : title} arrow variant="outlined" color="primary" placement="right-start" {...rest} />
  );

}