import axios from 'axios';
if (!process.env.REACT_APP_BACKEND_SERVER) {
  throw new Error(
    "No backend server, set REACT_APP_BACKEND_SERVER in server environment ;"
  );
}

const api = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_SERVER}/api`,
  method: "post",
});


export async function createAgent({ agentName, prompt, options }) {
  return await api.post('/agents', { agentName, prompt, options });
}

export async function listAgents() {
  return await api.get('/agents');

}

export async function updateAgent({ id, prompt }) {
  return await api.put(`/agents/${ id }`, { prompt });
}

export async function deleteAgent({ id }) {
  return await api.delete(`/agents/${id}`);
}
