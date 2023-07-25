import { Link } from 'react-router-dom';
import { Box, Button, Container, Typography } from '@mui/material';
import ResponsiveAppBar from '../../../src/components/global/AppBar';
import PasswordVault from './components/vault/PasswordVault';

const Dashboard = () => {
  return (
    <>
      <ResponsiveAppBar />

      <Container>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '30px',
            marginBottom: '30px',
          }}
        >
          <Typography variant='h4'>Vault Dashboard</Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginTop: '20px',
            marginRight: '30px',
          }}
        >
          <Link to='/password-vault/add'>
            <Button variant='contained' sx={{ backgroundColor: 'green' }}>
              Add new Password
            </Button>
          </Link>
        </Box>

        <PasswordVault />
      </Container>
    </>
  );
};

export default Dashboard;
