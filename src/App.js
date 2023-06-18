import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import LlmPanel from './components/LlmPanel.js';


export default function App() {
  return (
    <Container maxWidth="sm">
      <LlmPanel />
    </Container>
  );
}