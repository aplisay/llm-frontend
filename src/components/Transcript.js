import { useRef, useEffect } from 'react';
import { Box, Sheet, } from '@mui/joy';
import { CallEnd } from '@mui/icons-material';
import { Call } from '@mui/icons-material';
import Typography from '@mui/joy/Typography';
import PhoneNumber from './PhoneNumber';



const types = {
  goodbye: {
    flexDirection: 'row',
    color: 'warning'
  },
  completion: {
    flexDirection: 'row',
    color: 'primary'
  },
  prompt: {
    flexDirection: 'row-reverse',
    color: 'neutral'
  },
  call: {
    startDecorator: (<Call />),
    flexDirection: 'row-reverse',
    color: 'success'
  },
  hangup: {
    startDecorator: (<CallEnd />),
    flexDirection: 'row-reverse',
    color: 'danger'
  },
  data: {
    flexDirection: 'row-reverse',
    color: 'info'
  },

};

const Bubble = ({ type, key, children }) => {
  console.log({ type, key, children }, 'Bubble');

  let { flexDirection, color, startDecorator } = types[type] || types['completion'];

  return <Box key={key}

    sx={{
      display: 'flex',
      flexDirection,
      bgcolor: 'background.paper',
      borderRadius: 3,
    }}
  >
    <Sheet
      variant="soft"
      color={color}
      sx={{
        p: 1,
        m: 1,
        mr: 3,
        borderRadius: 10,
      }}
    >
      <Typography {...{ startDecorator }} level="body2" align="left">{children}</Typography>  
    </Sheet>

  </Box>;

};



export default function Transcript({ transcript, number, tooltip }) {
  const listRef = useRef(null);

  useEffect(() => {
    console.log({ listRef }, 'scrollefgfect');
    listRef.current?.lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [transcript]);

  return (
    <Sheet variant="outlined" sx={{ p: 4, width: '100%', borderRadius: 5 }} ref={listRef}>
      <Typography level="h6" align="left"><PhoneNumber number={number} tooltip={tooltip} />
      </Typography>
      {transcript.map((utter, index) =>
        Object.entries(utter).map(([type, value]) =>
          <Bubble type={type} key={index}>
            {(type === 'completion' || type === 'goodbye' || type === 'prompt') && value}
            {type === 'call' && `Call from REDACTED`}
            {type === 'hangup' && 'Call HANGUP'}
            {type === 'data' && <code>{JSON.stringify(value, null, "  ")}</code>}
          </Bubble>
        )
      )}
      {!!transcript.length && transcript[transcript.length - 1].completion &&
        <Bubble type="prompt" key="last">
          ...
        </Bubble>
      }
    </Sheet>);
}