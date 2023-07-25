import { useEffect, useState } from 'react';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel, { formLabelClasses } from '@mui/joy/FormLabel';
import Link from '@mui/joy/Link';
import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';
import Divider from '@mui/joy/Divider';
import RightImagePage from './RightImagePage';

import signupImage from '../assets/signup.jpg';
import loginImage from '../assets/loginpage.jpg';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';

import { useLogin, useUser, useCreateUser } from '../api/user';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../api/auth';

const providers = {
  emailPassword: true,
  external: {
    Google: { icon: <GoogleIcon />, handler: 'loginGoogle' },
    GitHub: { icon: <GitHubIcon />, handler: 'loginGithub' }
  }
};


export default function Login({ variant, error, setError, status, ...rest }) {
  let user = useUser();
  let login = useLogin();
  let create = useCreateUser();
  let [email, setEmail] = useState('notSent');


  let [image, signin, signup, verify, passwordReset, formSubmit] = [loginImage, true, false, false, false, login.loginEmail];

    async function pollEmail() {
      if (!user?.auth?.currentUser?.emailVerified) {
        setTimeout(pollEmail, 5000);
        await (user && user?.reload && user.reload());
        console.log({ user, status }, 'reload');
      }
    }

    if (status === 'unverified') {
      ([image, signin, verify, formSubmit] = [signupImage, false, true, create.sendEmail]);
      if (email === 'notSent') {
        setEmail('sent');
        try {
          create.sendEmail();
        }
        catch (e) {
          console.log({ e }, 'sending email');
        }
      }
      else if (email === 'sent')
      {
        setEmail('polling');
        pollEmail();
      }
    }
    else if (variant === 'lostPassword') {
      ([image, signin, passwordReset, formSubmit] = [signupImage, false, true, login.passwordReset]);
    }
    else if (variant === 'signup') {
      ([image, signin, signup, formSubmit] = [signupImage, false, true, create.createEmail]);
    }


  const submitHandler = async (event, target) => {
    console.log({ event, target }, 'submit');
    event.preventDefault();
    const data = {
      email: target?.email?.value,
      password: target?.password?.value,
    };

    try {
      console.log({ data }, 'logging in');
      await formSubmit(data);
      console.log({ data }, 'logged in');
    }
    catch (err) {
      let message = err.message.replace(/.*Firebase: /, '');
      setError(`${variant || 'Login'} failed: ${message}`);
    }

  };

  const oauthHandler = async (handlerName) => {
    try {
      (login[handlerName] && await login[handlerName]());
    }
    catch (err) {
      let message = err.message.replace(/.*Firebase: /, '');
      setError(`${variant || 'Login'} failed: ${message}`);
    }
  };
  console.log({ image, variant, signup, verify, status}, 'login');

  return (<RightImagePage {...{ image }} component="main"
    sx={{
      my: 'auto',
      py: 2,
      pb: 5,
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      width: 400,
      maxWidth: '100%',
      mx: 'auto',
      borderRadius: 'sm',
      '& form': {
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      },
      [`& .${formLabelClasses.asterisk}`]: {
        visibility: 'hidden',
      },
    }}>
    <div>
      <Typography component="h1" fontSize="xl2" fontWeight="lg">
        {signin && `Sign in to your account`}
        {signup && `Create account`}
        {verify && `Verify your account`}
        {passwordReset && `Password reset`}
      </Typography>
      <Typography level="body2" sx={{ my: 1, mb: 3 }}>
        {signin && `welcome back`}
        {signup && `with email address and password`}
        {verify && `Check your email and click on the link to verify`}
        {passwordReset && `Send email with password recovery link`}
      </Typography>
    </div>

    <form
      onSubmit={(event) => submitHandler(event, event.currentTarget.elements)}
    >
      {!verify && <FormControl required>
        <FormLabel>Email</FormLabel>
        <Input type="email" name="email" />
      </FormControl>}
      {!verify && !passwordReset && <FormControl required>
        <FormLabel>Password</FormLabel>
        <Input type="password" name="password" />
      </FormControl>}
      {!verify && !passwordReset && <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {!signup && <Link fontSize="sm" href="/#/signup" fontWeight="lg">
          Create Account
        </Link>}
        {!signup && <Link fontSize="sm" href="/#/password-reset" fontWeight="lg">
          Forgot your password?
        </Link>}
        {signup && <Link fontSize="sm" href="/#/login" fontWeight="lg">
          Log in to existing account
        </Link>}
      </Box>
      }
      <Button type="submit" fullWidth>
        {signin && `Login`}
        {signup && `Create account`}
        {verify && `Resend email`}
        {passwordReset && `Send password reset`}
      </Button>
    </form>
    {!verify && !passwordReset &&
      <>
        <Divider>or</Divider>
        {Object.entries(providers.external).map(([name, provider]) =>
        (<Button
          key={name}
          variant="outlined"
          color="neutral"
          fullWidth
          startDecorator={provider.icon}
          onClick={() => oauthHandler(provider.handler)} >
          Login in with {name}
        </Button>))}
      </>}

  </RightImagePage>);

}