/* eslint-disable no-console */
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Grid, Snackbar } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { authorizedFetch } from '../../../../../src/helpers/request-interceptor';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 5,
};

interface ShareModalProps {
  open: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DirectShareModal({
  open,
  setOpenModal,
}: ShareModalProps) {
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [shareEmail, setShareEmail] = React.useState('');

  const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  // handlers of the modal
  const handleClose = () => {
    setOpenModal(false);
  };

  // handler of snackbar
  const handleSnackbarClose = (
    e?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  //handler of direct share
  const handleDirectShare = () => {
    console.log('shareEmail', shareEmail);

    authorizedFetch('http://localhost:4000/api/vault/shared-secret', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: shareEmail }),
    }).then((res) => {
      if (res.status !== 201) {
        console.log('res', res);
      } else {
        setSnackbarOpen(true);
        console.log('res', res);
        setShareEmail('');
        return res.json();
      }
    });
  };

  return (
    <div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2500}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: '100%' }}
        >
          Password Shared Securely!
        </Alert>
      </Snackbar>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Enter the email of the person you want to share this password with
          </Typography>

          <Typography
            id="modal-modal-description"
            sx={{ mt: 2, mb: 4, justifyContent: 'center', display: 'flex' }}
          >
            <input
              type="text"
              name="email"
              placeholder="Email"
              style={{ width: '80%', padding: '15px' }}
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
            />
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box display="flex" justifyContent="flex-start">
                <Button
                  variant="contained"
                  sx={{ backgroundColor: 'green' }}
                  onClick={handleDirectShare}
                >
                  Share
                </Button>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  onClick={handleClose}
                  sx={{ backgroundColor: 'black' }}
                >
                  Close
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
}
