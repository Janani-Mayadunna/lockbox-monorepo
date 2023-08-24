import { Box, Card, CardContent, Typography } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import React from 'react';
import { logOut } from '../../../utils/api';
import { useNavigate } from 'react-router-dom';
import ElevateAppBar from '../../vaults/components/NavigationBar';

type Props = {};

const Settings = (props: Props) => {
  const title = 'Settings';
  const navigate = useNavigate();

  const handleLogOut = async () => {
    navigate('/');
    await logOut();
  };
  return (
    <div>
      <ElevateAppBar title={title} />

      <Box>
        <Card
          onClick={() => handleLogOut()}
          variant='outlined'
          sx={{
            backgroundColor: '#91b9ce',
            p: 0,
            mt: 1,
            cursor: 'pointer',
          }}
        >
          <CardContent
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '0px',
              paddingTop: '0px',
            }}
          >
            <Box sx={{ padding: 1 }}>
              <Typography sx={{ fontSize: '1rem' }}>Log Out</Typography>
            </Box>
            <Box style={{ display: 'flex', alignItems: 'center' }}>
              <Typography>
                <LogoutIcon sx={{ fontSize: '1rem', display: 'flex' }} />
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
};

export default Settings;
