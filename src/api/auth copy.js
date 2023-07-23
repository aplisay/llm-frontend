import React from "react";
import firebase from "./firebase";

const AuthContext = React.createContext();

function AuthProvider(props) {
  const [status, setStatus] = React.useState("loading");
  React.useEffect(() => {
    // onAuthStateChanged is called when Firebase's logged in state changes
    // if we have a user then we know we're logged in, otherwise we're not
    console.log({firebase, auth: firebase.auth}, 'auth');
    const unsubscribe = firebase.auth.onAuthStateChanged((user) => {
      setStatus(user ? "loggedIn" : "loggedOut");
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
