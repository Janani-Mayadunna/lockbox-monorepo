import { VisibilityOff, Visibility } from '@mui/icons-material';
import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { backendUrl, getFolders } from '../../../utils/api';
import { authorizedFetch } from '../../../utils/request-interceptor';

type Props = {};

interface IFolder {
  _id: string;
  folderName: string;
}

const VaultsUpdate = (props: Props) => {
  const { state } = useLocation();
  const [folders, setFolders] = React.useState([]);
  const [updatedData, setUpdatedData] = React.useState({
    name: '',
    username: '',
    password: '',
    link: '',
    note: '',
    category: '',
    folder: '',
  });

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const getAllFolders = async () => {
    const userFolder = await getFolders();
    setFolders(userFolder);
  };

  const handleUpdateVault = async () => {
    console.log('in update')
    const data = {
      name: state.name,
      username: state.username,
      password: state.password,
      link: state.link,
      note: state.note,
      category: state.category,
      folder: state.folder,
    };
    console.log('data', data);

    await authorizedFetch(`${backendUrl}/vault/${state._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then((res) => {
      console.log('res', res);
      navigate('/dashboard');
    });
  };

  React.useEffect(() => {
    console.log('state', state);
  }, [state]);

  React.useEffect(() => {
    getAllFolders();
  }, []);

  return (
    <Container
      sx={{ maxHeight: '400px', overflowY: 'scroll', overflowX: 'hidden' }}
    >
      <h1>Vaults Update</h1>
      <button style={{ margin: '16px' }} onClick={() => navigate('/dashboard')}>
        Back
      </button>
      <Box
        component='form'
        sx={{
          '& .MuiTextField-root': {
            mt: 0.7,
            mb: 0.7,
            width: '40ch',
            display: 'flex',
            justifyContent: 'center',
          },
        }}
        autoComplete='off'
      >
        <Stack spacing={1.5}>
          <FormControl size='small' sx={{ mt: 1.5 }}>
            <InputLabel id='category_select'>Category</InputLabel>
            <Select
              sx={{ backgroundColor: '#f0f4f8cc' }}
              labelId='category_select'
              id='category'
              defaultValue={state.category}
              label='Category'
              onChange={(e) =>
                setUpdatedData({ ...updatedData, category: e.target.value })
              }
            >
              <MenuItem value=''>
                <em>None</em>
              </MenuItem>
              <MenuItem value='Login'>Login</MenuItem>
              <MenuItem value='Secret Note'>Secret Note</MenuItem>
            </Select>
          </FormControl>
          <FormControl size='small' sx={{ mt: 3 }}>
            <InputLabel id='folder_select'>Folder</InputLabel>
            <Select
              sx={{ backgroundColor: '#f0f4f8cc' }}
              labelId='folder_select'
              id='folder'
              defaultValue={state.folder}
              label='Folder'
              onChange={(e) =>
                setUpdatedData({ ...updatedData, folder: e.target.value })
              }
            >
              <MenuItem value=''>
                <em>None</em>
              </MenuItem>
              {folders &&
                folders.map((folder: IFolder) => (
                  <MenuItem key={folder.folderName} value={folder._id}>
                    {folder.folderName}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <Divider sx={{ mt: 2, mb: 2 }} />
          <FormControl>
            <TextField
              sx={{ backgroundColor: '#f0f4f8cc' }}
              label='Alias'
              id='name'
              name='name'
              size='small'
              defaultValue={state.name}
              onChange={(e) =>
                setUpdatedData({ ...updatedData, name: e.target.value })
              }
            />
          </FormControl>
          <FormControl>
            <TextField
              sx={{ backgroundColor: '#f0f4f8cc' }}
              label='Username'
              id='username'
              name='username'
              size='small'
              defaultValue={state.username}
              onChange={(e) =>
                setUpdatedData({ ...updatedData, username: e.target.value })
              }
            />
          </FormControl>
          <FormControl
            sx={{
              m: 1,
              width: '25ch',
              display: 'flex',
              justifyContent: 'flex-start',
            }}
            variant='outlined'
          >
            <InputLabel htmlFor='outlined-adornment-password'>
              Password
            </InputLabel>
            <OutlinedInput
              sx={{ backgroundColor: '#f0f4f8cc' }}
              id='outlined-adornment-password'
              type={showPassword ? 'text' : 'password'}
              size='small'
              endAdornment={
                <InputAdornment position='end'>
                  <IconButton
                    aria-label='toggle password visibility'
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge='end'
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label='Password'
              defaultValue={state.password}
              onChange={(e) =>
                setUpdatedData({ ...updatedData, password: e.target.value })
              }
            />
          </FormControl>
          <FormControl>
            <TextField
              sx={{ backgroundColor: '#f0f4f8cc' }}
              label='URI'
              id='link'
              name='link'
              defaultValue={state.link}
              size='small'
              onChange={(e) =>
                setUpdatedData({ ...updatedData, link: e.target.value })
              }
            />
          </FormControl>
          <Divider sx={{ mt: 2, mb: 2 }} />
          <FormControl>
            <TextField
              sx={{ backgroundColor: '#f0f4f8cc' }}
              label='Notes'
              id='note'
              name='note'
              defaultValue={state.note}
              size='small'
              onChange={(e) =>
                setUpdatedData({ ...updatedData, note: e.target.value })
              }
            />
          </FormControl>
          {/* button to save */}
          <Button onClick={handleUpdateVault}>Save</Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default VaultsUpdate;
