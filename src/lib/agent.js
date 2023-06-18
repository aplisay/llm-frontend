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
  let { data } = await api.post('/agents', { agentName, prompt, options });
  return data;
}

export async function listAgents() {
  let { data } = await api.get('/agents');
  return data;

}

export async function updateAgent({ id, prompt }) {
  let { data } = await api.put(`/agents/${id}`, { prompt });
  return data;
}

export async function deleteAgent({ id }) {
  let { data } = await api.delete(`/agents/${id}`);
  return data
}
