import * as React from 'react';
import Box from '@mui/joy/Box';
import Slider from '@mui/joy/Slider';
import Typography from '@mui/joy/Typography';

function valueText(value) {
  return `${value}`;
}

export default function TemperatureSlider({ value, setValue }) {
  return (
    <Box sx={{ width: 300 }}>
      <Typography id="input-slider" gutterBottom>
        Temperature
      </Typography>
      <Slider
        value={value}
        onChange={(event) => setValue(event.target.value)}
        aria-labelledby="input-slider"
        aria-label="Always visible"
        getAriaValueText={valueText}
        defaultValue={0.05}
        step={0.05}
        marks
        min={0.0}
        max={1}
        valueLabelDisplay="on"
      />
    </Box>
  );
}
