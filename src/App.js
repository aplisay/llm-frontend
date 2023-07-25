import { useState } from 'react';
import { useAuth } from "./api/auth";
import { HashRouter as Router } from 'react-router-dom';
import { Routes, Route, Navigate } from 'react-router-dom';
import {
  experimental_extendTheme as materialExtendTheme,
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from '@mui/material/styles';
import { CssVarsProvider as JoyCssVarsProvider } from '@mui/joy/styles';
import GlobalStyles from '@mui/joy/GlobalStyles';
import CssBaseline from '@mui/joy/CssBaseline';
import customTheme from './theme';
import Container from '@mui/material/Container';
import Login from './components/Login';
import LlmPanel from './components/LlmPanel.js';
import Header from './components/Header';
import HeroPage from './components/HeroPage';
import ErrorAlert from './components/ErrorAlert';

const materialTheme = materialExtendTheme();

const Home = ({ ...rest }) => (
  <Container sx={{ pt: 'var(--Header-height)', mt: 2 }}>
    <LlmPanel {...rest} />
  </Container>
);


export default function App() {

  const status = useAuth();
  console.log({ status }, 'app');
  const [error, setError] = useState('');
  const [inform, setInform] = useState('');
  const [email, setEmail] = useState('notSent');
  const messages = { error, setError, inform, setInform };

  return (
    // Shonky double CSS wrapping because MUI Joy is nice, but not feature complete:
    //  https://mui.com/joy-ui/guides/using-joy-ui-and-material-ui-together/
    <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
      <JoyCssVarsProvider
        defaultMode="dark"
        disableTransitionOnChange
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

        {(status === "loading") && <></>}
        {(status !== "loggedIn") &&
          <Router>
            <Header />
            <Routes>
              <Route path="/landing" element={<HeroPage {...messages} />} />
              <Route path="/login" element={<Login {...messages}  {...{ email, setEmail, status }} />} />
              <Route path="/signup" element={<Login variant="signup" {...messages} {...{ email, setEmail, status }} />} />
              <Route path="/password-reset" element={<Login variant="lostPassword" {...messages} {...{ email, setEmail, status }} />} />
              <Route path='/' element={<Navigate to="/landing" />}/>
            </Routes>
          </Router>
        }
        {status === 'loggedIn' &&
          <Router>
            <Header />
            <Routes>
              <Route path="/" element={<Home {...messages} />} />
            </Routes>
          </Router>
        }
        <ErrorAlert {...messages} />
      </JoyCssVarsProvider>
    </MaterialCssVarsProvider>
  );


}