
import { Box,  Sheet, } from '@mui/joy';



export default function Transcript({ transcript }) {

  return (
    <Sheet variant="outlined" color="neutral" sx={{ p: 4, width: '100%' }}>
      {transcript.map((utter, index) => (<>
        {(utter.completion || utter.goodbye) &&
          <Box key={index}
            sx={{
              display: 'flex',
              flexDirection: 'row',
              bgcolor: 'background.paper',
              borderRadius: 3,
            }}
          >
            <Box
              sx={{
                p: 1,
                m: 1,
                mr: 3,
                bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#101010' : 'grey.100'),
                color: (theme) => (theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800'),
                border: '1px solid',
                borderColor: (theme) =>
                  theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
                borderRadius: 4,
                fontSize: '0.875rem',
                fontWeight: '700',
              }}
            >{utter.completion || utter.goodbye}</Box>

          </Box>
        }
        {utter.prompt &&
          <Box key={index}
            sx={{
              display: 'flex',
              flexDirection: 'row-reverse',
              bgcolor: 'background.paper',
              borderRadius: 3,
            }}
          >
            <Box
              sx={{
                p: 1,
                m: 1,
                ml: 3,
                bgcolor: 'grey.100',
                color: 'grey.300',
                border: '1px solid',
                borderColor: (theme) =>
                  theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
                borderRadius: 4,
                fontSize: '0.875rem',
                fontWeight: '700',
              }}
            >{utter.prompt}</Box>

          </Box>
        }
        {(utter.call || utter.hangup) &&
          <Box key={index}
            sx={{
              display: 'flex',
              flexDirection: 'row-reverse',
              alignItems: 'stretch',
              bgcolor: 'background.paper',
              borderRadius: 3,
            }}
          >
            <Box
              sx={{
                p: 1,
                m: 1,
                ml: 1,
                alignItems: 'stretch',
                bgcolor: 'danger.200', 
                color: 'background.paper',
                border: '1px solid',
                borderColor: 'danger.800',
                borderRadius: 4,
                fontSize: '0.875rem',
                fontWeight: '700',
              }}
            >{utter.call && `Call from REDACTED`}
              {utter.hangup && 'Call HANGUP'}</Box>

          </Box>
        }
        {utter.data &&
          <Box key={index}
            sx={{
              display: 'flex',
              flexDirection: 'row-reverse',
              alignItems: 'stretch',
              bgcolor: 'background.paper',
              borderRadius: 3,
            }}
          >
            <Box
              sx={{
                p: 1,
                m: 1,
                ml: 1,
                alignItems: 'stretch',
                bgcolor: 'success.200',
                color: 'background.paper',
                border: '1px solid',
                borderColor: 'success.800',
                borderRadius: 4,
                fontSize: '0.875rem',
                fontWeight: '700',
              }}
            ><code>{JSON.stringify(utter.data, null, "  ")}</code></Box>

          </Box>
        }
        </>))}
    </Sheet>);
}