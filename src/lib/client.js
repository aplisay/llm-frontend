
import useAxios, { configure } from 'axios-hooks';
import {auth} from "./firebase";
import Axios from 'axios';
import LRU from 'lru-cache';

if (!process.env.REACT_APP_BACKEND_SERVER) {
  throw new Error(
    "No backend server, set REACT_APP_BACKEND_SERVER in server environment ;"
  );
}



const api = Axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_SERVER}/api`,
  method: "get"
});

api.interceptors.request.use(async function (config) {
  let token = await auth?.currentUser?.getIdToken();
  if (token) {
    config.headers.authorization = `Bearer ${token}`;
  }
  return config;
});
const cache = new LRU({ max: 10 });

configure({ api, cache })

export default useAxios;
export { useAxios, api };
