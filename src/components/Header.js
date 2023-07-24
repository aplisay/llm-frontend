import * as React from 'react';
import Box from '@mui/joy/Box';
import GlobalStyles from '@mui/joy/GlobalStyles';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import ColourSchemeToggle from './ColourSchemeToggle';
import LogoutIcon from '@mui/icons-material/Logout';
import { useUser } from '../api/user';


export default function Header() {
  let { email, logout } = useUser() || {};
  return (
    <Sheet
      sx={{
        display: { xs: 'flex' },
        alignItems: 'center',
        position: 'fixed',
        top: 0,
        width: '100vw',
        height: 'var(--Header-height)',
        zIndex: 9995,
        py: 1,
        px: 2,
        gap: 1,
        backgroundColor: 'transparent',
        //boxShadow: 'sm',
      }}
    >
      <GlobalStyles
        styles={(theme) => ({
          ':root': {
            '--Header-height': '52px',
          },
        })}
      />
      <Typography
        sx={{ mt: 2, mr: 'auto' }}
        fontWeight="lg"
        startDecorator={<Box sx={{ mt: 2, mr:5 }}><img src="/logo.png" alt="logo"/></Box>}
      >
        LLM Playground
      </Typography>
      {email && <Typography 
        sx={{mr:5}}
        startDecorator={<LogoutIcon onClick={logout} />}
        fontWeight="sm"
        >
        {email}
      </Typography>}
      <ColourSchemeToggle/>
    </Sheet>
  );
}
