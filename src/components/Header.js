import * as React from 'react';
import { useLocation } from 'react-router-dom';
import Box from '@mui/joy/Box';
import GlobalStyles from '@mui/joy/GlobalStyles';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import ColourSchemeToggle from './ColourSchemeToggle';
import LogoutIcon from '@mui/icons-material/Logout';
import AspectRatio from '@mui/joy/AspectRatio';
import { useUser } from '../api/user';


export default function Header(props) {
  let { email, logout } = useUser() || {};
  let path = useLocation()
  console.log({ path }, 'header');
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
        backgroundColor: path?.pathname !== '/' && 'transparent',
        boxShadow: path?.pathname === '/' && 'sm',
      }}
    >
      <GlobalStyles
        styles={(theme) => ({
          ':root': {
            '--Header-height': '52px',
            '--Logo-height': '35px',
          },
        })}
      />
      <Typography
        sx={{ mr: 'auto' }}
        fontWeight="lg"
        startDecorator={<Box sx={{ mt: 1, mr: 5 }}><img src="/logo.png" height={35} alt="Aplisay logo" /></Box>}
      >
        {path?.pathname !== '/landing' && `LLM Voice Playground`}
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
