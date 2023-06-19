
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

const backend = new URL(process.env.REACT_APP_BACKEND_SERVER);


export async function createAgent({ agentName, prompt, options, onClose, onMessage }) {
  let { data } = await api.post('/agents', { agentName, prompt, options });
  if (data?.socket) {
    let wsPath = `${backend.protocol === 'https' ? 'wss' : 'ws'}://${backend.host}${data?.socket}`;
    console.log({ data, wsPath }, 'got socket');
    let ws = new WebSocket(wsPath);
    ws.addEventListener('message', (message) => {
      console.log({ message }, 'WS message');
      try {
        data = JSON.parse(message.data);
        onMessage && onMessage(data);
      }
      catch (e) {
        console.log({ message, e }, 'bad data');
      }
    });
    ws.addEventListener('error', (err) => {
      console.log({ err }, 'WS error');
    });
    ws.addEventListener('close', (err) => {
      console.log({ err }, 'WS close');
    });

  }



  return data;
}

export async function listAgents() {
  let { data } = await api.get('/agents');
  return data;

}

export async function updateAgent({ id, prompt, options }) {
  let { data } = await api.put(`/agents/${id}`, { prompt, options });
  return data;
}

export async function deleteAgent({ id }) {
  let { data } = await api.delete(`/agents/${id}`);
  return data
}
