import { useState } from 'react';
import { styled } from '@mui/joy/styles';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Tooltip from '@mui/joy/Tooltip';


export default function SelectAgent({ options, agentName, setAgentName, ...rest }) {

  const layout =
    (<Select defaultValue={agentName} onChange={(e, value) => setAgentName(value)} sx={{ mb: 2 }} {...{ ...rest }}>
      {Object.entries(options).map(option => (
        <Option key={option[0]} value={option[0]}>{`${option[1].description}`}</Option>
      ))}
    </Select>);

  return !agentName ? (
    <Tooltip title="Start by selecting a model" arrow open placement="right">
      {layout}
    </Tooltip>)
    : layout;
}