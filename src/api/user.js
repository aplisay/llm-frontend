import firebase, { googleAuth } from "../lib/firebase";
import { api } from "../lib/client";
import { useNavigate } from "react-router-dom";

function signUp(email, password) {
  return firebase.auth().createUserWithEmailAndPassword(email, password);
}

function logIn(email, password) {
  return firebase.auth().signInWithEmailAndPassword(email, password);
}

async function signInWithGoogle() {
  const googleUser = await (await googleAuth).signIn();
  const cred = firebase.auth.GoogleAuthProvider.credential(
    null,
    googleUser.getAuthResponse().access_token
  );
  const offlineToken = await googleUser.grantOfflineAccess();
  return firebase
    .auth()
    .signInWithCredential(cred)
    .then((result) => {
      window.localStorage.setItem("googleToken", result.credential.accessToken);
      /*
      useAxios("/api/usertoken", {
        method: "POST",
        body: offlineToken,
      });
      */
      return true;
    });
}

function logOut() {
  return firebase.auth().signOut();
}

function sendVerificationEmail() {
  return firebase.auth().currentUser.sendEmailVerification();
}

function useVerifyEmail() {
  return sendVerificationEmail();
}

function getUser() {
  return api.get("/user");
}

function useUser() {
  const { data = {}, ...rest } = {} //
  // we don't store these things in the DB, so have to grab from FB
  const { email, emailVerified, photoUrl } = firebase.auth().currentUser;
  return { user: { ...data, email, emailVerified, photoUrl }, ...rest };
}


function useCreateUser() {
  const navigate = useNavigate();
  return {
    createEmail: async (email, password) => {
      await signUp(email, password);
      navigate("/");
    },
    signinGoogle: async () => {
      await signInWithGoogle();
      navigate("/");
    }
  } 
}

function useLogin() {
  const navigate = useNavigate();
  return {
    loginEmail: async (email, password) => {
      await signUp(email, password);
      navigate("/");
    },
    signinGoogle: async () => {
      await signInWithGoogle();
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
