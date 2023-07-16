import { useState } from 'react';
import { styled } from '@mui/joy/styles';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Tooltip from '@mui/joy/Tooltip';


export default function SelectAgent({ options, agentName, setAgentName, tooltip, ...rest }) {

  return (
    <Tooltip title={tooltip} arrow placement="right" open={!!tooltip}>
      <Select defaultValue={agentName} onChange={(e, value) => setAgentName(value)} sx={{ mb: 2 }} {...{ ...rest }}>
        {Object.entries(options).map(option => (
          <Option key={option[0]} value={option[0]}>{`${option[1].description}`}</Option>
        ))}
      </Select>
    </Tooltip>
  );

}