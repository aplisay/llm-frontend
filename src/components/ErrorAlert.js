import React from 'react';
import WarningIcon from '@mui/icons-material/Warning';
import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/joy/Alert';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import Snackbar from '@mui/material/Snackbar';


export default function ErrorAlert({ error, setError }) {
  return (
    <Snackbar open={error} autoHideDuration={8000} onClose={() => setError(false)}>
      <Alert
        startDecorator={<WarningIcon sx={{ mx: 0.5 }} />}
        variant="solid"
        color="danger"
        endDecorator={
          <>
            <IconButton variant="solid" size="sm" color="danger" onClick={() => setError(false)}>
              <CloseIcon />
            </IconButton>
          </>
        }
      >
        <Typography sx={{ color: 'white' }} fontWeight="md">
          {error}
        </Typography>
      </Alert>
    </Snackbar>)

}