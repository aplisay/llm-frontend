import { useEffect } from 'react';
import Textarea from '@mui/joy/Textarea';
import Tooltip from '../common/Tooltip';


export default function PromptInput({ prompt, setPrompt, agentName, agents, tooltip }) {

  useEffect(() => {
    if (!prompt?.changed) {
      setPrompt({ ...prompt, value: agents[agentName]?.defaultPrompt });
    }
  }, [agentName, agents]);

  const promptChange = async (evt) => {
    setPrompt({ value: evt.target.value, changed: true, changedSinceCreate: true });
  };


  return (
    <Tooltip {...{ tooltip }} open={!!tooltip}>
      <Textarea placeholder="Enter prompt here" value={prompt.value} name="prompt" onChange={promptChange} />
      </Tooltip>
  );
};