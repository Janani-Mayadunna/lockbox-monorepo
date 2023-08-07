import { Link } from 'react-router-dom';
import { Box, Button, Container, Grid, Typography } from '@mui/material';
import UserVaultTable from './components/vault/UserVault';
import FilterBar from './components/filters-bar/FiltersSidebar';
import ResponsiveAppBar from '../../../src/components/global/AppBar';

const Dashboard = () => {
  return (
    <>
      <ResponsiveAppBar />
      <Container>
        <Grid container spacing={1}>
          <Grid item xs={3}>
            <Box sx={{ mt: 5 }}>
              <FilterBar />
            </Box>
          </Grid>
          <Grid item xs={8}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '30px',
                    marginBottom: '30px',
                  }}
                ></Box>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    marginTop: '20px',
                    marginBottom: '40px',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'left',
                    }}
                  >
                    <Typography variant="h5">Password Vault</Typography>
                  </Box>

                  <Link to="/password-vault/add">
                    <Button
                      variant="contained"
                      sx={{ backgroundColor: 'green' }}
                    >
                      Add new Password
                    </Button>
                  </Link>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <UserVaultTable />
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Dashboard;
