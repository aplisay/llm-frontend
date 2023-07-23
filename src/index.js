import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssVarsProvider, useColorScheme } from '@mui/joy/styles';
import GlobalStyles from '@mui/joy/GlobalStyles';
import CssBaseline from '@mui/joy/CssBaseline';
import './index.css';
import customTheme from './theme';
import App from './App';
import { AuthProvider } from "./api/auth";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CssVarsProvider
      defaultMode="dark"
      disableTransitionOnChange
      theme={customTheme}
    >
      <CssBaseline />
      <GlobalStyles
        styles={{
          ':root': {
            '--Collapsed-breakpoint': '769px', // form will stretch when viewport is below `769px`
            '--Cover-width': '40vw', // must be `vw` only
            '--Form-maxWidth': '700px',
            '--Transition-duration': '0.4s', // set to `none` to disable transition
          },
        }}
      />
      <AuthProvider>
        <App />
      </AuthProvider>
    </CssVarsProvider>
    </React.StrictMode>,

);


