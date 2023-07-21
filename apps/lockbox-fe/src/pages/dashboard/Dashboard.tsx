import { Link } from 'react-router-dom';
import { Button, Container } from '@mui/material';
import ResponsiveAppBar from '../../../src/components/global/AppBar';
import PasswordVault from './components/vault/PasswordVault';

const Dashboard = () => {
  return (
    <>
      <ResponsiveAppBar />

      <Container>
        <h1 className='title'>Dashboard</h1>

        <Link to='/password-vault/add'>
          <Button>Add new Password</Button>
        </Link>

        <PasswordVault />
      </Container>
    </>
  );
};

export default Dashboard;
