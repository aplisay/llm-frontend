import { useState } from 'react';
import { styled } from '@mui/joy/styles';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';


export default function SelectAgent({options, agentName, setAgentName, ...rest}) {

  console.log({ options });

  return (
    <Select defaultValue={agentName} onChange={(e, value) => setAgentName(value)} sx={{mb:2}} {...{...rest}}>
      {Object.entries(options).map(option => (
        <Option key={option[0]} value={option[0]}>{`${option[1].description}`}</Option>
      ))}
    </Select>
  );
}