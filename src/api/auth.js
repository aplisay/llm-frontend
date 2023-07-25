import React from "react";
import firebase, {auth} from "../lib/firebase";

const AuthContext = React.createContext();

function AuthProvider(props) {
  const [status, setStatus] = React.useState("loading");
  React.useEffect(() => {
    // onAuthStateChanged is called when Firebase's logged in state changes
    // if we have a user then we know we're logged in, otherwise we're not
    const unsubscribe = firebase.onIdTokenChanged(auth, (user) => {
      console.log({ user }, 'stateChange');
      let s = user ? "unverified" : "loggedOut";
      setStatus(user?.emailVerified ? "loggedIn" : s);
    });
    // onAuthStateChanged returns an unsub function for cleaning up the effect
    return unsubscribe;
  }, []);

  return <AuthContext.Provider {...props} value={status} />;
}

function useAuth() {
  const status = React.useContext(AuthContext);
  if (status === undefined)
    throw new Error("useAuth must be called within an AuthProvider");
  return status;
}

export { AuthProvider, useAuth };
