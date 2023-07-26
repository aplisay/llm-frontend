import * as React from 'react';
import Box from '@mui/joy/Box';
import image from '../../assets/rob-commcon.jpg';
import TwoSidedLayout from '../layouts/TwoSidedLayout';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import { ArrowForward } from '@mui/icons-material';
import GitHubIcon from '@mui/icons-material/GitHub';
import Grid from '@mui/joy/Grid';
import Link from '@mui/joy/Link';



export default function HeroPage() {
  return (
    <TwoSidedLayout image={image} alt="picture of Rob presenting llm-agent at Commcon 2023" >
      <Typography color="primary" fontSize="lg" fontWeight="lg">
        AI on the telephone
      </Typography>
      <Typography
        level="h1"
        fontWeight="xl"
        fontSize="clamp(1.875rem, 1.3636rem + 2.1818vw, 3rem)"
      >
        Experiment with simple LLM driven voice agents
      </Typography>
      <Typography fontSize="lg" textColor="text.secondary" lineHeight="lg">
        This is a free hosted hosted version of the open source tool developed by Rob and presented at various conferences this year.
      </Typography>
          <Link fontWeight="lg" href="/#/signup"><Button size="lg" endDecorator={<ArrowForward fontSize="xl" />}>
            Get Started
          </Button>
          </Link>
      <Typography>
        Been here before? <Link fontWeight="lg" href="/#/login">Sign in</Link>
      </Typography>
      <Typography startDecorator={<GitHubIcon />}>
        Back-end&nbsp;<Link fontWeight="lg" href="https://github.com/aplisay/llm-agent">source code</Link>
      </Typography>
    </TwoSidedLayout >
  );
}
