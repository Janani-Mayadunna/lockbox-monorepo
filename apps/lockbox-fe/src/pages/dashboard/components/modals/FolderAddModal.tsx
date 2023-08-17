/* eslint-disable react-hooks/exhaustive-deps */
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
  borderRadius: '10px',
  p: 5,
};

interface ShareModalProps {
  open: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function FolderAddModal({
  open,
  setOpenModal,
}: ShareModalProps) {
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [folderName, setFolderName] = React.useState('');

  const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  // handlers of the modal
  const handleClose = () => {
    setOpenModal(false);
    setFolderName('');
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

  const handleFolderCreate = async () => {
    authorizedFetch('http://localhost:4000/api/user-folder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        folderName: folderName,
      }),
    })
      .then((res) => {
        console.log('res', res);
        if (res.status === 201) {
          setSnackbarOpen(true);
          handleClose();
        } else {
          console.log('error');
        }
      })
      .catch((err: any) => {
        console.log('err', err);
      });
  };

  return (
    <div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: '100%' }}
        >
          Folder Created
        </Alert>
      </Snackbar>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ display: 'flex', justifyContent: 'center', fontSize: '1.4rem' }}
          >
            Name your folder
          </Typography>

          <Typography
            id="modal-modal-description"
            sx={{ mt: 2, mb: 4, justifyContent: 'center', display: 'flex' }}
          >
            <input
              type="text"
              name="folderName"
              placeholder="Enter folder name"
              style={{ width: '95%', padding: '15px' }}
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
            />
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box display="flex" justifyContent="flex-start">
                <Button
                  variant="contained"
                  sx={{ backgroundColor: 'green', pr: 4, pl: 4 }}
                  onClick={handleFolderCreate}
                >
                  Save
                </Button>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  onClick={handleClose}
                  sx={{ backgroundColor: 'black', pr: 4, pl: 4 }}
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
