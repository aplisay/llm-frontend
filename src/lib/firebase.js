import { initializeApp } from 'firebase/app';
import * as firebase from "firebase/auth";
import { gapi, loadAuth2 } from "gapi-script";

const scopes = [
];

let googleAuth = loadAuth2(
  gapi,
  process.env.REACT_APP_GOOGLE_CLIENT_ID,
  scopes.join(" ")
);

var githubProvider = new firebase.GithubAuthProvider();

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_TOKEN,
  authDomain: "llm-voice.firebaseapp.com",
  projectId: "llm-voice",
};

const app = initializeApp(firebaseConfig);
const auth = firebase.getAuth(app);
console.log({ app, auth }, 'firebase');
const googleProvider = new firebase.GoogleAuthProvider();
// add Google Sheets permissions
scopes.forEach((scope) => googleProvider.addScope(scope));

export { auth, googleProvider, googleAuth, githubProvider };

export default firebase;
