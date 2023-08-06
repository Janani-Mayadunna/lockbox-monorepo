import { Link } from 'react-router-dom';
import { Box, Button, Container, Typography } from '@mui/material';
import ResponsiveAppBar from '../../../src/components/global/AppBar';
import UserVaultTable from './components/vault/UserVault';

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
          <Typography variant="h4">Password Vault</Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginTop: '20px',
            marginRight: '30px',
            marginBottom: '40px',
          }}
        >
          <Link to="/password-vault/add">
            <Button variant="contained" sx={{ backgroundColor: 'green' }}>
              Add new Password
            </Button>
          </Link>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <UserVaultTable />
        </Box>
      </Container>
    </>
  );
};

export default Dashboard;
