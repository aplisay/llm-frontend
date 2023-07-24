import * as React from 'react';
import Box from '@mui/joy/Box';

export default function RightImagePage({ image, children, ...rest }) {

  return (<>
    <Box
      sx={(theme) => ({
        width:
          'clamp(100vw - var(--Cover-width), (var(--Collapsed-breakpoint) - 100vw) * 999, 100vw)',
        transition: 'width var(--Transition-duration)',
        transitionDelay: 'calc(var(--Transition-duration) + 0.1s)',
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        justifyContent: 'flex-end',
        backdropFilter: 'blur(4px)',
        backgroundColor: 'rgba(255 255 255 / 0.6)',
        [theme.getColorSchemeSelector('dark')]: {
          backgroundColor: 'rgba(19 19 24 / 0.4)',
        },
      })}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100dvh',
          width:
            'clamp(var(--Form-maxWidth), (var(--Collapsed-breakpoint) - 100vw) * 999, 100%)',
          maxWidth: '100%',
          px: 2,
        }}
      >
        <Box {...rest}>
       {children}
        </Box>
     
      </Box>
    </Box>
    <Box
      sx={(theme) => ({
        height: '100%',
        position: 'fixed',
        right: 0,
        top: 0,
        bottom: 0,
        left: 'clamp(0px, (100vw - var(--Collapsed-breakpoint)) * 999, 100vw - var(--Cover-width))',
        transition:
          'background-image var(--Transition-duration), left var(--Transition-duration) !important',
        transitionDelay: 'calc(var(--Transition-duration) + 0.1s)',
        backgroundColor: 'background.level1',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundImage: `url(${image})`,
        [theme.getColorSchemeSelector('dark')]: {
          backgroundImage: `url(${image})`,
        }
      })}
    />
  </>
  );
}