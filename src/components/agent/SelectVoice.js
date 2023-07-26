import { listVoices } from '../../api/agent';
import { useState, useEffect } from 'react';
import Select from '@mui/joy/Select';
import Grid from '@mui/joy/Grid';
import Option from '@mui/joy/Option';
import { Language } from '@mui/icons-material';
import { RecordVoiceOver } from '@mui/icons-material';


export default function SelectVoice({ options, setOptions, tooltip, ...rest }) {
  let [voices, setVoices] = useState();
  let [language, setLanguage] = useState();
  let [voice, setVoice] = useState();

  console.log({ options, setOptions, tooltip, ...rest }, 'selectVoice');


  useEffect(() => {
    !voices && listVoices().then(v => {
      setVoices(v);
      setLanguage('en-GB');
      setVoice('en-GB-Wavenet-A');
    });
  }, []);

  useEffect(() => {
    setOptions({
      ...options,
      tts: {
        language,
        voice
      },
      stt: {
        language
      }
    });
  }, [language, voice]);

  return (
      <Grid container sx={{width: '100%'}}>
        <Grid xs={12} sm={4}>
        <Select
          defaultValue={language}
          placeholder="select language"
          label="language"
          startDecorator={<Language />}
          onChange={(e, value) => setLanguage(value)} sx={{ m: 2 }}>
            {Object.keys(voices || {})?.map(option => (
              <Option key={option} value={option}>{`${option}`}</Option>
            ))}
          </Select>
        </Grid>
        <Grid xs={12} sm={8}>
        <Select defaultValue={voice}
          placeholder="select voice"
          startDecorator={<RecordVoiceOver />}
          onChange={(e, value) => setVoice(value)} sx={{ m: 2 }}>
            {(voices || {})[language]?.map(option => (
              <Option key={option.name} value={option.name}>{`${option.name} (${option.gender})`}</Option>
            ))}
          </Select>
        </Grid>
      </Grid>
  );

}