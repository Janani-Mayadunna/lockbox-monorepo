import { VisibilityOff, Visibility } from '@mui/icons-material';
import {
  Box,
  Container,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  TextField,
} from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

type Props = {};

const VaultsUpdate = (props: Props) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <Container
      sx={{ maxHeight: '400px', overflowY: 'scroll', overflowX: 'hidden' }}
    >
      <h1>Vaults Update</h1>
      <button onClick={() => navigate('/dashboard')}>Back</button>
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
        <Stack>
          <TextField
            label='Category'
            id='category'
            name='category'
            defaultValue=''
            size='small'
          />

          <TextField
            label='Folder'
            id='folder'
            name='folder'
            defaultValue=''
            size='small'
          />

          <TextField
            label='Alias'
            id='name'
            name='name'
            defaultValue=''
            size='small'
          />

          <TextField
            label='Alias'
            id='name'
            name='name'
            defaultValue=''
            size='small'
          />

          <TextField
            label='Username'
            id='username'
            name='username'
            defaultValue=''
            size='small'
          />

          <FormControl sx={{ m: 1, width: '25ch' }} variant='outlined'>
            <InputLabel htmlFor='outlined-adornment-password'>
              Password
            </InputLabel>
            <OutlinedInput
              id='outlined-adornment-password'
              type={showPassword ? 'text' : 'password'}
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
            />
          </FormControl>

          <TextField
            label='URI'
            id='link'
            name='link'
            defaultValue=''
            size='small'
          />

          <TextField
            label='Notes'
            id='note'
            name='note'
            defaultValue=''
            size='small'
          />
        </Stack>
      </Box>
    </Container>
  );
};

export default VaultsUpdate;
