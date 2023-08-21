/* eslint-disable no-console */
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Grid, Snackbar, Tooltip } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import {
  authorizedFetch,
  getVaultKey,
} from '../../../../../src/helpers/request-interceptor';
import CustomCrypto from '../../../../../src/helpers/custom-crypto';
import GenPassModal from './GenPassModal';
import AutoAwesomeTwoToneIcon from '@mui/icons-material/AutoAwesomeTwoTone';
import '../../styles/VaultAddModal.css';
import { IFolder, IUpdateVault } from '../../interfaces';
import {
  MenuItem,
  TextField,
  InputAdornment,
  IconButton,
  OutlinedInput,
} from '@mui/material';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../../../src/store';
import { getVaultByIdRequest, updateVaultRequest } from '../../redux/actions';
import ENVIRONMENT from '../../../../../src/helpers/environment';

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
  data: string;
}

export default function VaultUpdateModal({
  open,
  setOpenModal,
  data,
}: ShareModalProps) {
  const dispatch = useAppDispatch();
  const { singleVault, loading } = useAppSelector((state) => state.vaults);

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [vaultData, setVaultData] = React.useState({
    category: singleVault ? singleVault.category : '',
    name: singleVault ? singleVault.name : '',
    folder: singleVault ? singleVault.folder : '',
    username: singleVault ? singleVault.username : '',
    password: singleVault ? singleVault.password : '',
    link: singleVault ? singleVault.link : '',
    note: singleVault ? singleVault.note : '',
  });
  const [characterCount, setCharacterCount] = React.useState(0);
  const [openGeneratorModal, setOpenGeneratorModal] = React.useState(false);
  const [folders, setFolders] = React.useState<IFolder[]>([]);
  const [showPassword, setShowPassword] = React.useState(false);

  const maxCharacters = 300;

  const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
  ) {
    return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
  });

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  // handlers of the modal
  const handleClose = () => {
    setOpenModal(false);
    handleReset();
    setShowPassword(false);
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

  const getAllFolders = async () => {
    authorizedFetch(`${ENVIRONMENT.BACKEND_API}/user-folder`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setFolders(data);
      })
      .catch((err) => {
        throw new Error('Failed to get folders' + err.message);
      });
  };

  const handleUpdate = async (e: any) => {
    if (!vaultData.username || !vaultData.password) {
      return;
    }
    let encryptedNote = '';

    e.preventDefault();

    const vaultKey = getVaultKey();
    const vaultPW = vaultData.password;

    const encryptedVaultPW = await CustomCrypto.encrypt(vaultKey, vaultPW);
    const encryptedUsername = await CustomCrypto.encrypt(
      vaultKey,
      vaultData.username,
    );

    if (vaultData.note) {
      encryptedNote = await CustomCrypto.encrypt(vaultKey, vaultData.note);
    }

    const newVault: IUpdateVault = {
      category: vaultData.category,
      name: vaultData.name,
      folder: vaultData.folder,
      link: vaultData.link,
      username: encryptedUsername,
      password: encryptedVaultPW,
      note: encryptedNote,
    };

    const payload = {
      id: data,
      data: newVault,
    };

    dispatch(updateVaultRequest(payload));
  };

  React.useEffect(() => {
    if (open) {
      dispatch(getVaultByIdRequest(data));
    }
  }, [dispatch, data, open]);

  React.useEffect(() => {
    if (singleVault) {
      setVaultData({
        category: singleVault.category,
        name: singleVault.name,
        folder: singleVault.folder ? singleVault.folder : '',
        username: singleVault.username,
        password: singleVault.password,
        link: singleVault.link ? singleVault.link : '',
        note: singleVault.note ? singleVault.note : '',
      });
    }
  }, [singleVault]);

  React.useEffect(() => {
    getAllFolders();
  }, []);

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
            {/* <Typography variant='h5'>Add Vault</Typography> */}
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
                {loading ? (
                  <div>Loading...</div>
                ) : (
                  <Grid container spacing={1} alignItems='center'>
                    {/* 1. Grid item containing category input */}
                    <Grid item xs={6}>
                      <label htmlFor='category'>Vault Category</label>
                      <TextField
                        select
                        name='category'
                        id='category'
                        value={vaultData.category}
                        variant='outlined'
                        size='small'
                        className='input-field'
                        style={{ marginBottom: '10px' }}
                        onChange={(e) =>
                          setVaultData({
                            ...vaultData,
                            category: e.target.value,
                          })
                        }
                      >
                        <MenuItem value='Login'>Login</MenuItem>
                        <MenuItem value='Secret Note'>Note</MenuItem>
                      </TextField>
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
                        <TextField
                          type='text'
                          value={vaultData.name}
                          name='name'
                          variant='outlined'
                          size='small'
                          className='input-field'
                          style={{ marginBottom: '10px' }}
                          onChange={(e) =>
                            setVaultData({ ...vaultData, name: e.target.value })
                          }
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <label htmlFor='folder'>Folder</label>
                        <TextField
                          select
                          name='folder'
                          id='folder'
                          value={vaultData.folder}
                          variant='outlined'
                          size='small'
                          className='input-field'
                          style={{ marginBottom: '10px' }}
                          onChange={(e) =>
                            setVaultData({
                              ...vaultData,
                              folder: e.target.value,
                            })
                          }
                        >
                          <MenuItem value=''></MenuItem>
                          {folders.map((folder: IFolder) => (
                            <MenuItem key={folder._id} value={folder._id}>
                              {folder.folderName}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                    </Grid>

                    {vaultData.category === 'Login' ? (
                      <>
                        {/* 3. Grid item containing username input and password input */}
                        <Grid container item xs={12} spacing={4}>
                          <Grid item xs={6}>
                            <label htmlFor='username'>Username</label>
                            <TextField
                              type='text'
                              value={vaultData.username}
                              name='username'
                              required
                              variant='outlined'
                              size='small'
                              className='input-field'
                              style={{ marginBottom: '10px' }}
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

                              <OutlinedInput
                                sx={{ width: '100%' }}
                                id='outlined-adornment-password'
                                type={showPassword ? 'text' : 'password'}
                                size='small'
                                onChange={(e) =>
                                  setVaultData({
                                    ...vaultData,
                                    password: e.target.value,
                                  })
                                }
                                endAdornment={
                                  <InputAdornment position='end'>
                                    <IconButton
                                      aria-label='toggle password visibility'
                                      onClick={handleClickShowPassword}
                                      onMouseDown={handleMouseDownPassword}
                                      edge='end'
                                    >
                                      {showPassword ? (
                                        <VisibilityOff />
                                      ) : (
                                        <Visibility />
                                      )}
                                    </IconButton>
                                  </InputAdornment>
                                }
                                label='Password'
                                value={vaultData.password}
                              />
                            </Grid>
                            <Grid item xs={2} sx={{ display: 'flex' }}>
                              <Tooltip title='Generate safe password' arrow>
                                <Button
                                  onClick={handleGeneratorModalOpen}
                                  type='button'
                                  variant='text'
                                  sx={{ color: 'green' }}
                                >
                                  <AutoAwesomeTwoToneIcon
                                    sx={{ fontSize: '2rem', mt: '10px' }}
                                  />
                                </Button>
                              </Tooltip>
                            </Grid>
                          </Grid>
                        </Grid>

                        {/* 4. Grid item containing URI input */}
                        <Grid item xs={6}>
                          <label htmlFor='link'>URI</label>
                          <TextField
                            type='text'
                            value={vaultData.link}
                            name='link'
                            placeholder='https://example.com'
                            variant='outlined'
                            size='small'
                            className='input-field'
                            style={{ marginBottom: '10px' }}
                            onChange={(e) =>
                              setVaultData({
                                ...vaultData,
                                link: e.target.value,
                              })
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
                      <TextField
                        id='note'
                        name='note'
                        multiline
                        variant='outlined'
                        size='small'
                        className='input-field'
                        value={vaultData.note}
                        onChange={handleNoteChange}
                        rows={3}
                        inputProps={{ maxLength: maxCharacters }}
                        style={{ resize: 'vertical', marginBottom: '10px' }}
                      />

                      <Box sx={{ mt: 6 }}>
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
                            {vaultData.note && vaultData.note !== ''
                              ? maxCharacters - vaultData.note.length
                              : maxCharacters}{' '}
                            / 300
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
                      </Box>
                    </Grid>

                    {/* 6. Grid item containing submit button */}
                    <Grid container item xs={8} spacing={2}>
                      <Grid item xs={6}>
                        <Button
                          type='submit'
                          onClick={handleUpdate}
                          variant='contained'
                          sx={{
                            marginBottom: '10px',
                            backgroundColor: '#007bff',
                            color: 'black',
                          }}
                        >
                          Save
                        </Button>
                      </Grid>
                    </Grid>
                    <Grid item xs={2}>
                      {/* Empty */}
                    </Grid>
                  </Grid>
                )}
              </form>
            </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
