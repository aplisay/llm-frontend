
import useAxios, { configure } from 'axios-hooks';
import firebase from "./firebase";
import Axios from 'axios';
import LRU from 'lru-cache';

if (!process.env.REACT_APP_BACKEND_SERVER) {
  throw new Error(
    "No backend server, set REACT_APP_BACKEND_SERVER in server environment ;"
  );
}

let firebaseAuth = null;
const token = firebase.auth?.currentUser?.getIdToken().then(token => (firebaseAuth = token));


const api = Axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_SERVER}/api`,
  method: "get"
});
api.interceptors.request.use(function (config) {
  if (config.auth && firebaseAuth) {
    config.headers.authorization = `Bearer ${token}`;
  }
  return config;
});
const cache = new LRU({ max: 10 });

configure({ api, cache })

export default useAxios;
export { useAxios, api };

class HttpError extends Error {
  constructor(response) {
    const message = response.status + " " + response.statusText;
    super(message);
    this.status = response.status;
  }
}
