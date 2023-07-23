
import { api } from '../lib/client';

const backend = new URL(process.env.REACT_APP_BACKEND_SERVER);

export async function createAgent({ agentName, prompt, options, onClose, onMessage }) {
  let { data } = await api.post('/agents', { agentName, prompt, options });
  if (data?.socket) {
    let wsPath = `${backend.protocol === 'https:' ? 'wss:' : 'ws:'}//${backend.host}${data?.socket}`;
    let ws = new WebSocket(wsPath);
    ws.addEventListener('message', (message) => {
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
      onClose && onClose(err.message);
    });
    data.ws = ws;

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
  try {
    let { data } = await api.delete(`/agents/${id}`);
    return data;
  }
  catch (e) {
    // we may be trying to delete an agent because of a failed network, don't care too much
    console.log({ e }, 'destroying agent');
  }
}

export async function listVoices() {
  let { data } = await api.get('/voices');
  return data;
}