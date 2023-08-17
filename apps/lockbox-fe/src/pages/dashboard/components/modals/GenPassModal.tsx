import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Container, Grid, Snackbar } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { useState } from 'react';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import LoopIcon from '@mui/icons-material/Loop';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  borderRadius: '10px',
  boxShadow: 24,
  p: 4,
};

interface ShareModalProps {
  open: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function GenPassModal({ open, setOpenModal }: ShareModalProps) {
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [password, setPassword] = useState('');
  const [counter, setCounter] = useState(8);
  const [isUppercase, setIsUppercase] = useState(false);
  const [isLowercase, setIsLowercase] = useState(false);
  const [isNumber, setIsNumber] = useState(false);
  const [isSymbol, setIsSymbol] = useState(false);

  const numbers = '0123456789';
  const upperCaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz';
  const special = '!^+%&/()=?_#$-{[]}|;:>`<.*@';

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

  /*  Genetate random password functions  */
  const increaseCounter = (e: any) => {
    e.preventDefault();
    if (counter < 15) {
      setCounter((prevCounter) => prevCounter + 1);
    }
  };

  const decreaseCounter = (e: any) => {
    e.preventDefault();
    if (counter > 8) {
      setCounter((prevCounter) => prevCounter - 1);
    }
  };

  const generatePassword = (e: any) => {
    e.preventDefault();
    let _password = '';

    for (let i = 0; i < counter; i++) {
      _password += getRandom();
    }

    setPassword(_password);
  };

  const getRandom = () => {
    const chars = [];

    if (isUppercase) {
      chars.push(
        upperCaseLetters[Math.floor(Math.random() * upperCaseLetters.length)],
      );
    }

    if (isLowercase) {
      chars.push(
        lowerCaseLetters[Math.floor(Math.random() * lowerCaseLetters.length)],
      );
    }

    if (isNumber) {
      chars.push(numbers[Math.floor(Math.random() * numbers.length)]);
    }

    if (isSymbol) {
      chars.push(special[Math.floor(Math.random() * special.length)]);
    }

    if (chars.length === 0) return '';

    return chars[Math.floor(Math.random() * chars.length)];
  };

  const createCopy = () => {
    const textAreaEl = document.createElement('textarea');
    textAreaEl.innerText = password;
    document.body.appendChild(textAreaEl);
    textAreaEl.select();
    navigator.clipboard.writeText(textAreaEl.value);

    textAreaEl.remove();
  };

  const copyPasswordHandler = (e: any) => {
    e.preventDefault();
    createCopy();

    setSnackbarOpen(true);
    setTimeout(() => {
      handleClose();
    }, 200);
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
          Link Copied to Clipboard
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
            Generate Strong Password
          </Typography>
          <div className="generator">
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                pt: 2,
                pb: 2,
                mb: 3,
                mt: 3,
                height: '3rem',
                width: '100%',
                border: '1px solid',
                borderColor: '#d3d3df',
                borderRadius: '5px',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  width: '50%',
                  fontWeight: 'bold',
                  marginBottom: '0rem',
                  padding: '0.5rem',
                  borderRadius: '5px',
                }}
              >
                {password}
              </Typography>
            </Box>
            <Container>
              <div className="generator__form-controls">
                <Box sx={{ display: 'flex' }}>
                  <input
                    checked={isUppercase}
                    onChange={(e) => setIsUppercase(e.target.checked)}
                    type="checkbox"
                    id="uppercase"
                    name="uppercase"
                    style={{
                      marginRight: '1rem',
                      width: '1.2rem',
                      height: '1.2rem',
                    }}
                  />
                  <label htmlFor="uppercase">Uppercase</label>
                </Box>

                <Box sx={{ display: 'flex' }}>
                  <input
                    checked={isLowercase}
                    onChange={(e) => setIsLowercase(e.target.checked)}
                    type="checkbox"
                    id="lowercase"
                    name="lowercase"
                    style={{
                      marginRight: '1rem',
                      width: '1.2rem',
                      height: '1.2rem',
                    }}
                  />
                  <label htmlFor="lowercase">Lowercase</label>
                </Box>

                <Box sx={{ display: 'flex' }}>
                  <input
                    checked={isNumber}
                    onChange={(e) => setIsNumber(e.target.checked)}
                    type="checkbox"
                    id="numbers"
                    name="numbers"
                    style={{
                      marginRight: '1rem',
                      width: '1.2rem',
                      height: '1.2rem',
                    }}
                  />
                  <label htmlFor="numbers">Numbers</label>
                </Box>

                <Box sx={{ display: 'flex' }}>
                  <input
                    checked={isSymbol}
                    onChange={(e) => setIsSymbol(e.target.checked)}
                    type="checkbox"
                    id="symbols"
                    name="symbols"
                    style={{
                      marginRight: '1rem',
                      width: '1.2rem',
                      height: '1.2rem',
                    }}
                  />
                  <label htmlFor="symbols">Symbols</label>
                </Box>

                <Box
                  sx={{
                    mt: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Typography sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                    Select Password Length
                  </Typography>
                  <Box className="generator__length-counter">
                    <Button onClick={decreaseCounter}>
                      <RemoveIcon />
                    </Button>
                    <span>{counter}</span>
                    <Button onClick={increaseCounter}>
                      <AddIcon />
                    </Button>
                  </Box>
                </Box>

                {/* <button
                  style={{ marginRight: '5rem' }}
                  onClick={generatePassword}
                >
                  Generate Password
                </button>
                <button onClick={copyPasswordHandler}>Copy Password</button> */}
              </div>
            </Container>
          </div>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '30px',
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Button
                  variant="outlined"
                  onClick={generatePassword}
                  sx={{ color: 'green', borderColor: 'green' }}
                >
                  <LoopIcon sx={{ color: 'green', fontSize: '2rem' }} />
                  Generate{' '}
                </Button>
              </Grid>
              <Grid item xs={3}></Grid>
              <Grid item xs={4}>
                <Button
                  variant="outlined"
                  onClick={copyPasswordHandler}
                  sx={{ color: 'black', width: '120px', borderColor: 'black' }}
                >
                  <ContentCopyIcon sx={{ color: 'black', fontSize: '2rem' }} />
                  Copy{' '}
                </Button>
              </Grid>
              <Grid item xs={4}>
                {/* <Button variant="contained" onClick={handleClose}>
                  Close
                </Button> */}
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
