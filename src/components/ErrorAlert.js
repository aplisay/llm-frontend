import React from 'react';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';


const Alert = React.forwardRef(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


export default function ErrorAlert({ error, setError, inform, setInform }) {



  return (
    <>
      <Snackbar open={!!error} autoHideDuration={8000} onClose={() => setError(false)} onClick={() => setError(false)}>
        <Alert
          severity="error"
        >
          {error}
        </Alert>
      </Snackbar>
      <Snackbar open={!!inform} autoHideDuration={8000} onClose={() => setInform(false)} onClick={() => setInform(false)}>
        <Alert
          severity={(inform && Object.keys(inform)?.[0]) || 'error'}
        >
            {inform && Object.values(inform)?.[0]}
        </Alert>
      </Snackbar>
    </>
  
  )

}