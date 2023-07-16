import { useEffect, useState } from 'react';
import Textarea from '@mui/joy/Textarea';
import Tooltip from '@mui/joy/Tooltip';


export default function PromptInput({ prompt, setPrompt, agentName, agents, tooltip }) {

  useEffect(() => {
    if (!prompt?.changed) {
      setPrompt({ ...prompt, value: agents[agentName]?.defaultPrompt });
    }
  }, [agentName, agents]);

  const promptChange = async (evt) => {
    setPrompt({ value: evt.target.value, changed: true });
  };


  return (
    <Tooltip title={tooltip} arrow placement="right" open={!!tooltip}>
      <Textarea placeholder="Enter prompt here" value={prompt.value} name="prompt" onChange={promptChange} />
      </Tooltip>
  );
};