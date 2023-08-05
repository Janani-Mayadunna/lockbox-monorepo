/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Button, Grid, Snackbar } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

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
  ModalData: {
    vaultUsername: string;
    vaultPassword: string;
  };
}

export default function AddToVaultModal({
  open,
  setOpenModal,
  ModalData,
}: ShareModalProps) {
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [trasferData, setTransferData] = React.useState({
    username: ModalData.vaultUsername,
    password: ModalData.vaultPassword,
    link: '',
  });

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

    // handler of add to vault
    const handleAddToVault = () => {
        const newVault = trasferData;
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
            Enter the website link you want to assign this password and username
            to
          </Typography>

          {/* <Typography>Username: {ModalData.vaultUsername}  <br/> Password: {ModalData.vaultPassword}</Typography> */}

          <Typography
            id="modal-modal-description"
            sx={{ mt: 2, mb: 4, justifyContent: 'center', display: 'flex' }}
          >
            <input
              type="text"
              name="link"
              placeholder="www.github.com"
              style={{ width: '80%', padding: '15px' }}
              value={trasferData.link}
              onChange={(e) =>
                setTransferData({ ...trasferData, link: e.target.value })
              }
            />
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box display="flex" justifyContent="flex-start">
                <Button
                  variant="contained"
                  sx={{ backgroundColor: 'green' }}
                    onClick={handleAddToVault}
                >
                  Save to Vault
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
