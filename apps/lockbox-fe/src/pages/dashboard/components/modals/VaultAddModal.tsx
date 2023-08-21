/* eslint-disable no-console */
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Grid, Snackbar, Tooltip } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { getVaultKey } from '../../../../../src/helpers/request-interceptor';
import CustomCrypto from '../../../../../src/helpers/custom-crypto';
import GenPassModal from './GenPassModal';
import AutoAwesomeTwoToneIcon from '@mui/icons-material/AutoAwesomeTwoTone';
import '../../styles/VaultAddModal.css';
import { ICreateVault, IFolder } from '../../interfaces';
import { useAppDispatch, useAppSelector } from '../../../../../src/store';
import { createVaultRequest } from '../../redux/actions';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 0,
  borderRadius: '10px',
};

interface ShareModalProps {
  open: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function VaultAddModal({ open, setOpenModal }: ShareModalProps) {
  const dispatch = useAppDispatch();
  const { folders } = useAppSelector((state) => state.vaults);

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [vaultData, setVaultData] = React.useState({
    category: '',
    name: '',
    folder: '',
    username: '',
    password: '',
    link: '',
    note: '',
  });
  const [characterCount, setCharacterCount] = React.useState(0);
  const [openGeneratorModal, setOpenGeneratorModal] = React.useState(false);
  const maxCharacters = 300;

  const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
  ) {
    return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
  });

  // handlers of the modal
  const handleClose = () => {
    setOpenModal(false);
    handleReset();
  };

  const handleGeneratorModalOpen = () => {
    setOpenGeneratorModal(true);
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

  const handleReset = () => {
    setVaultData({
      category: '',
      name: '',
      folder: '',
      username: '',
      password: '',
      link: '',
      note: '',
    });

    setCharacterCount(0);
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setVaultData({ ...vaultData, [name]: value });
    setCharacterCount(value.length);
  };

  const handleSubmit = async (e: any) => {
    if (!vaultData.username || !vaultData.password) {
      return;
    }

    e.preventDefault();
    handleReset();

    const vaultKey = getVaultKey();
    const vaultPW = vaultData.password;

    const encryptedVaultPW = await CustomCrypto.encrypt(vaultKey, vaultPW);
    const encryptedUsername = await CustomCrypto.encrypt(
      vaultKey,
      vaultData.username,
    );
    const encryptedNote = await CustomCrypto.encrypt(vaultKey, vaultData.note);

    const newVault: ICreateVault = {
      category: vaultData.category,
      name: vaultData.name,
      folder: vaultData.folder,
      link: vaultData.link,
      username: encryptedUsername,
      password: encryptedVaultPW,
      note: encryptedNote,
    };

    dispatch(createVaultRequest(newVault));
    handleClose();
  };

  // update category state
  React.useEffect(() => {
    if (vaultData.category === '') {
      setVaultData({ ...vaultData, category: 'Login' });
    }
  }, [vaultData, vaultData.category]);

  // React.useEffect(() => {
  //   dispatch(getAllFoldersRequest());
  // }, [dispatch]);

  return (
    <div>
      <GenPassModal
        open={openGeneratorModal}
        setOpenModal={setOpenGeneratorModal}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity='success'
          sx={{ width: '100%' }}
        >
          Folder Created
        </Alert>
      </Snackbar>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '20px',
            }}
          >
            <Typography variant='h5'>Add Vault</Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              padding: '20px',
            }}
          >
            <Box>
              <form
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Main Grid Container */}
                <Grid container spacing={1} alignItems='center'>
                  {/* 1. Grid item containing category input */}
                  <Grid item xs={6}>
                    <label htmlFor='category'>Vault Category</label>
                    <select
                      name='category'
                      id='category'
                      defaultValue={vaultData.category}
                      className='input-field'
                      style={{ marginBottom: '10px', padding: '5px' }}
                      onChange={(e) =>
                        setVaultData({ ...vaultData, category: e.target.value })
                      }
                    >
                      <option value='Login'>Login</option>
                      <option value='Secret Note'>Note</option>
                    </select>
                  </Grid>
                  <Grid item xs={6}>
                    {/* Empty */}
                  </Grid>

                  {/* 2. Grid item containing alias input and folder input */}
                  <Grid
                    container
                    item
                    xs={12}
                    spacing={4}
                    sx={{ pt: '8px', pb: '8px' }}
                  >
                    <Grid item xs={6}>
                      <label htmlFor='name'>Alias</label>
                      <input
                        type='text'
                        value={vaultData.name}
                        name='name'
                        className='input-field'
                        style={{ marginBottom: '10px', padding: '5px' }}
                        onChange={(e) =>
                          setVaultData({
                            ...vaultData,
                            name: e.target.value,
                          })
                        }
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <label htmlFor='folder'>Choose Folder</label>
                      <select
                        name='folder'
                        id='folder'
                        defaultValue={vaultData.folder}
                        className='input-field'
                        style={{ marginBottom: '10px', padding: '5px' }}
                        onChange={(e) =>
                          setVaultData({
                            ...vaultData,
                            folder: e.target.value,
                          })
                        }
                      >
                        <option value='value'></option>
                        {folders.map((folder: IFolder) => (
                          <option key={folder._id} value={folder._id}>
                            {folder.folderName}
                          </option>
                        ))}
                      </select>
                    </Grid>
                  </Grid>

                  {vaultData.category === 'Login' ? (
                    <>
                      {/* 3. Grid item containing username input and password input */}
                      <Grid container item xs={12} spacing={4}>
                        <Grid item xs={6}>
                          <label htmlFor='username'>Username</label>
                          <input
                            value={vaultData.username}
                            name='username'
                            required
                            className='input-field'
                            style={{
                              marginBottom: '10px',
                              padding: '5px',
                              // backgroundColor: 'rgb(234 234 234 / 50%)',
                            }}
                            onChange={(e) =>
                              setVaultData({
                                ...vaultData,
                                username: e.target.value,
                              })
                            }
                          />
                        </Grid>
                        <Grid container item xs={6}>
                          {/* 3.1 Grid item containing password input and generator button */}
                          <Grid item xs={10}>
                            <label htmlFor='password'>Password</label>
                            <input
                              id='password'
                              type='password'
                              value={vaultData.password}
                              name='password'
                              required
                              className='input-field'
                              style={{ marginBottom: '10px', padding: '5px' }}
                              onChange={(e) =>
                                setVaultData({
                                  ...vaultData,
                                  password: e.target.value,
                                })
                              }
                            />
                          </Grid>
                          <Grid
                            item
                            xs={2}
                            sx={{ display: 'flex', alignItems: 'center' }}
                          >
                            <Tooltip title='Generate safe password' arrow>
                              <Button
                                onClick={handleGeneratorModalOpen}
                                type='button'
                                variant='text'
                                sx={{ color: 'green' }}
                              >
                                <AutoAwesomeTwoToneIcon
                                  sx={{ fontSize: '2rem', mt: 1 }}
                                />
                              </Button>
                            </Tooltip>
                          </Grid>
                        </Grid>
                      </Grid>

                      {/* 4. Grid item containing URI input */}
                      <Grid item xs={6}>
                        <label htmlFor='link'>URI</label>
                        <input
                          type='text'
                          value={vaultData.link}
                          name='link'
                          placeholder='https://example.com'
                          className='input-field'
                          style={{ marginBottom: '10px', padding: '5px' }}
                          onChange={(e) =>
                            setVaultData({ ...vaultData, link: e.target.value })
                          }
                        />
                      </Grid>
                      <Grid item xs={6}></Grid>
                    </>
                  ) : (
                    ''
                  )}

                  {/* 5. Grid item containing note input */}
                  <Grid item xs={12}>
                    <label htmlFor='note'>Note</label>
                    <textarea
                      id='note'
                      typeof='text'
                      name='note'
                      className='input-field'
                      value={vaultData.note}
                      onChange={handleNoteChange}
                      rows={3}
                      cols={50}
                      maxLength={maxCharacters}
                      style={{
                        resize: 'vertical',
                        maxWidth: '100%',
                        minHeight: '80px',
                      }}
                    />

                    {characterCount <= 300 ? (
                      <Typography
                        variant='body2'
                        sx={{
                          display: 'flex',
                          justifyContent: 'flex-start',
                          marginRight: '5px',
                          color: 'green',
                          marginBottom: '15px',
                        }}
                      >
                        Remaining Characters:{' '}
                        {maxCharacters - vaultData.note.length} / 300
                      </Typography>
                    ) : (
                      <Typography
                        variant='body2'
                        sx={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          color: 'red',
                          marginRight: '5px',
                          marginBottom: '15px',
                        }}
                      >
                        Passed maximum character count
                      </Typography>
                    )}
                  </Grid>

                  {/* 6. Grid item containing submit button */}
                  <Grid container item xs={8} spacing={2}>
                    <Grid item xs={3}>
                      <Button
                        type='submit'
                        onClick={handleSubmit}
                        variant='contained'
                        sx={{
                          marginBottom: '10px',
                          backgroundColor: '#007bff',
                          color: 'black',
                        }}
                      >
                        Submit
                      </Button>
                    </Grid>

                    <Grid item xs={4}>
                      <Button
                        type='reset'
                        onClick={() => handleReset()}
                        variant='contained'
                        sx={{
                          marginBottom: '10px',
                          backgroundColor: '#6c757d',
                          color: 'black',
                        }}
                      >
                        Reset
                      </Button>
                    </Grid>
                  </Grid>
                  <Grid item xs={4}>
                    {/* Empty */}
                  </Grid>
                </Grid>
              </form>
            </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
