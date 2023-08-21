import { Box, Button, Container, Grid, Tooltip } from '@mui/material';
import UserVaultTable from './components/vault/UserVault';
import FilterBar from './components/filters-bar/FiltersSidebar';
import ResponsiveAppBar from '../../components/global/AppBar';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import EnhancedEncryptionIcon from '@mui/icons-material/EnhancedEncryption';
import React from 'react';
import FolderAddModal from './components/modals/FolderAddModal';
import VaultAddModal from './components/modals/VaultAddModal';
import { useAppDispatch } from '../../../src/store';
import { getAllFoldersRequest } from './redux/actions';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const [folderModalOpen, setFolderModalOpen] = React.useState(false);
  const [vaultModalOpen, setVaultModalOpen] = React.useState(false);
  const [selectedFilter, setSelectedFilter] = React.useState({
    filter: '',
    keyword: '',
  });

  const handleFilterSelect = (filter: string, keyword: string) => {
    setSelectedFilter({
      filter,
      keyword,
    }); // Update the parent component's state with the selected filter
  };
  const handleNewFolderModalOpen = () => {
    setFolderModalOpen(true);
  };

  const handleNewVaultModalOpen = () => {
    setVaultModalOpen(true);
  };

  React.useEffect(() => {
    if (!folderModalOpen) {
      dispatch(getAllFoldersRequest());
    }
  }, [dispatch, folderModalOpen]);

  return (
    <>
      <ResponsiveAppBar />
      <FolderAddModal
        open={folderModalOpen}
        setOpenModal={setFolderModalOpen}
      />
      <VaultAddModal open={vaultModalOpen} setOpenModal={setVaultModalOpen} />
      <Container>
        <Grid container spacing={4}>
          <Grid item xs={3}>
            <Box sx={{ mt: 5 }}>
              <FilterBar onFilterSelect={handleFilterSelect} />
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
                    {/* <Typography variant="h5">Password Vault</Typography> */}
                  </Box>

                  <Box>
                    <Tooltip title='Add new folder'>
                      <Button
                        variant='text'
                        sx={{ marginRight: '10px' }}
                        onClick={handleNewFolderModalOpen}
                      >
                        <CreateNewFolderIcon
                          sx={{ fontSize: '2.5rem', color: 'black' }}
                        />
                      </Button>
                    </Tooltip>

                    {/* <Link to="/password-vault/add"> */}
                    <Button
                      variant='contained'
                      sx={{ backgroundColor: 'green' }}
                      onClick={handleNewVaultModalOpen}
                    >
                      New Vault
                      <EnhancedEncryptionIcon sx={{ marginLeft: '10px' }} />
                    </Button>
                    {/* </Link> */}
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <UserVaultTable selectedFilter={selectedFilter} />
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
