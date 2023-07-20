import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Button, Container } from '@mui/material';
import ResponsiveAppBar from '../../../src/components/global/AppBar';
import PasswordVault from '../pw-vault/PasswordVault';

const Dashboard = () => {
  const handleGetAll = async () => {
    //token string of type string or null
    const tokenString = localStorage.getItem('jwt-lockbox');
    if (tokenString !== null) {
      const userToken: string = JSON.parse(tokenString);

      const data = await axios
        .post('http://localhost:4000/api/auth/current-user', userToken)
        .then((res) => {
          console.log('res: ', res);
        })
        .catch((err) => {
          console.log('err: ', err);
        });
      console.log('data: ', data);
    }
  };

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
