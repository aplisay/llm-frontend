import { useState } from 'react';
import { styled } from '@mui/joy/styles';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';


export default function SelectAgent({options, agentName, setAgentName}) {

  console.log({ options });

  return (
    <Select defaultValue={agentName} onChange={(value) => setAgentName(value)}>
      {options.map(option => (
        <Option value={option[0]}>{`${option[1].name} - ${option[1].description}`}</Option>
      ))}
    </Select>
  );
}