import firebase, { auth, googleProvider, githubProvider } from "../lib/firebase";
import { api } from "../lib/client";
import { useNavigate } from "react-router-dom";

console.log({ firebase, auth: firebase.auth }, 'Firebase user load')

function signUp(email, password) {
  return firebase.createUserWithEmailAndPassword(auth, email, password);
}

function logIn(email, password) {
  return firebase.signInWithEmailAndPassword(auth, email, password);
}

async function signInWithGoogle() {
  const googleUser = await firebase.signInWithPopup(auth, googleProvider)
}

async function signInWithProvider(provider) {
  try {
    const result = await firebase.signInWithPopup(auth, provider);
  }
  catch (error) {
    console.log({ error }, 'error');
    if (error.code === 'auth/account-exists-with-different-credential') {
      throw new Error('You have signed up with a different provider for that email.');
    }
    else {
      throw error;
    }
  }
}

function logOut() {
  return firebase.signOut(auth);
}

function sendVerificationEmail() {
  console.log({ firebase, auth, user: auth.currentUser }, 'sendVerificationEmail')
  return firebase.sendEmailVerification(auth.currentUser);
}


function sendResetEmail(email) {
  console.log({ firebase, auth, user: auth.currentUser }, 'sendVerificationEmail');
  return firebase.sendPasswordResetEmail(auth, email);
}

function useVerifyEmail() {
  return sendVerificationEmail();
}

function getUser() {
  return api.get("/user");
}

function useUser() {
  // we don't store these things in the DB, so have to grab from FB
  const { displayName, email, emailVerified, photoUrl } = (auth.currentUser || {});
  return auth.currentUser && { displayName, email, emailVerified, photoUrl, logout: logOut };
}


function useCreateUser() {
  const navigate = useNavigate();
  return {
    createEmail: async ({ email, password }) => {
      console.log({email, password}, 'createUser')
      await signUp(email, password);
      navigate("/");
    },
    sendEmail: async () => {
      await sendVerificationEmail();
      navigate("/");
    }

  } 
}

function useLogin() {
  const navigate = useNavigate();
  return {
    loginEmail: async ({ email, password }) => {
      console.log({ email, password }, 'login')
      await logIn(email, password);
      navigate("/");
    },
    passwordReset: async ({ email }) => {
      sendResetEmail(email);
      navigate("/");
    },
    loginGoogle: async () => {
      await signInWithGoogle();
      navigate("/");
    },
    loginGithub: async () => {
      await signInWithProvider(githubProvider);
      navigate("/");
    }
  };
}

function useUpdateUser() {
  return async (user, setError) => {
    try {
      await api.put('/user', { body: { ...user } });
    }
    catch (err) {
      setError(`Couldn't modify user: ${err.message}`);
    }
  };
}
  

function deleteUser() {
  return firebase.auth().currentUser.delete();
}

export {
  signUp,
  logIn,
  logOut,
  useCreateUser,
  useLogin,
  useVerifyEmail,
  useUpdateUser,
  getUser,
  signInWithGoogle,
  useUser,
  deleteUser,
};
