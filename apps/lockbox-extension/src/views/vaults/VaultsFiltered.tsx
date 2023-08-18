import React from 'react';
import { Box, Typography, Card, CardContent, Container } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useLocation, useNavigate } from 'react-router-dom';

type Props = {};

const VaultsFiltered = (props: Props) => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { vault, title } = state;

  return (
    <Container sx={{ height: '400px', minWidth: '300px', overflowY: 'scroll' }}>
      <h1>Vaults Filtered</h1>
      <button onClick={() => navigate('/dashboard')}>Back</button>
      <Box>
        <Box>
          <Typography>{title}</Typography>
        </Box>
        <Box>
          {vault.map((vault: any) => (
            <Card
              onClick={() => navigate('/vaults/update', { state: vault })}
              key={vault._id}
              variant='outlined'
              sx={{
                backgroundColor: '#91b9ce',
                p: 0,
                mt: 1,
                ml: 1,
                mr: 1,
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
                <Box sx={{ display: 'flex' }}>
                  <Box sx={{ pt: 0.5 }}>
                    {vault.link?.split('//') && vault.link.split('//')[1] ? (
                      <img
                        src={`https://icons.bitwarden.net/${
                          vault.link.split('//')[1]
                        }/icon.png`}
                        alt='logo'
                        style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '30%',
                        }}
                      />
                    ) : (
                      <img
                        src='https://cdn-icons-png.flaticon.com/512/3170/3170748.png'
                        alt='logo'
                        style={{ width: '30px', height: '30px' }}
                      />
                    )}
                  </Box>
                  <Box sx={{ padding: 1 }}>
                    <Typography sx={{ fontSize: '1rem' }}>
                      {vault.name}
                    </Typography>
                  </Box>
                </Box>
                <Box style={{ display: 'flex', alignItems: 'center' }}>
                  <Typography>
                    <ArrowForwardIosIcon
                      sx={{ fontSize: '1rem', display: 'flex' }}
                    />
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default VaultsFiltered;
