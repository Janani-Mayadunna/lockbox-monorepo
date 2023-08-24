import {
  Box,
  Card,
  CardContent,
  Divider,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import SavedSearchIcon from '@mui/icons-material/SavedSearch';
import {
  setFoldersToStorage,
  getAllVaults,
  getDecryptedAllVaults,
  getFolders,
  logOut,
} from '../../../utils/api';
import { useNavigate } from 'react-router-dom';

const Vaults: React.FC<{}> = () => {
  const navigate = useNavigate();

  chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.action === 'replaceToLogin') {
      setValidity(false);
    }
    // sendResponse({ response: 'filters' });
  });

  const [validity, setValidity] = React.useState<boolean>(true);
  const [vaults, setVaults] = React.useState([]);
  const [folders, setFolders] = React.useState([]);
  const [logins, setLogins] = React.useState({
    vaultsArray: [],
    count: 0,
  });
  const [secretNotes, setSecretNotes] = React.useState({
    vaultsArray: [],
    count: 0,
  });

  React.useEffect(() => {
    if (!validity) {
      logOut();
      navigate('/');
    }
  }, [validity]);

  const getVaults = async () => {
    await getAllVaults();
    const decryptedVaults = await getDecryptedAllVaults();
    setVaults(decryptedVaults);
  };

  const getAllFolders = async () => {
    await setFoldersToStorage();
    const userFolder = await getFolders();
    setFolders(userFolder);
  };

  const getAllLogins = () => {
    const logins = vaults.filter((vault: any) => vault.category === 'Login');
    setLogins({
      vaultsArray: logins,
      count: logins.length,
    });
  };

  const getAllSecretNotes = () => {
    const secretNotes = vaults.filter(
      (vault: any) => vault.category === 'Secret Note'
    );
    setSecretNotes({
      vaultsArray: secretNotes,
      count: secretNotes.length,
    });
  };

  const getByCategories = (keyword: string) => {
    if (keyword === 'Login') {
      return logins.vaultsArray;
    } else if (keyword === 'Secret Note') {
      return secretNotes.vaultsArray;
    }
  };

  const handleAllVaultsClick = (title: string) => {
    navigate('/vaults/filtered', {
      state: { vault: vaults, title: title },
    });
  };

  const handleCategoryClick = (keyword: string) => {
    const vault = getByCategories(keyword);
    navigate('/vaults/filtered', {
      state: { vault: vault, title: keyword },
    });
  };

  const handleFolderClick = async (vault: any[], folderName: string) => {
    navigate('/vaults/filtered', {
      state: { vault: vault, title: folderName },
    });
  };

  React.useEffect(() => {
    getVaults();
  }, []);

  React.useEffect(() => {
    getAllFolders();
  }, []);

  React.useEffect(() => {
    getAllLogins();
    getAllSecretNotes();
  }, [vaults]);

  return (
    <div>
      <Box sx={{ mb: 3 }}>
        <TextField
          variant='outlined'
          fullWidth
          size='medium'
          placeholder='Search...'
          sx={{ padding: 0 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <IconButton edge='start'>
                  <SavedSearchIcon />
                </IconButton>
              </InputAdornment>
            ),
            style: { borderRadius: '4px' },
          }}
        />
      </Box>

      {/* All vaults */}
      <Card
        onClick={() => handleAllVaultsClick('All Vaults')}
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
          <Box sx={{ padding: 1 }}>
            <Typography sx={{ fontSize: '1rem' }}>All Vaults</Typography>
          </Box>
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant='body1' style={{ marginRight: '10px' }}>
              {vaults.length}
            </Typography>
            <Typography>
              <ArrowForwardIosIcon sx={{ fontSize: '1rem', display: 'flex' }} />
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Divider sx={{ mt: 2, mb: 2 }} />

      {/* Categories  */}
      <Box>
        <Box>
          <Typography>Categories</Typography>
        </Box>
        <Box>
          <Card
            onClick={() => handleCategoryClick('Login')}
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
              <Box sx={{ padding: 1 }}>
                <Typography sx={{ fontSize: '1rem' }}>Logins</Typography>
              </Box>
              <Box style={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant='body1' style={{ marginRight: '10px' }}>
                  {logins.count}
                </Typography>
                <Typography>
                  <ArrowForwardIosIcon
                    sx={{ fontSize: '1rem', display: 'flex' }}
                  />
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Card
            onClick={() => handleCategoryClick('Secret Note')}
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
              <Box sx={{ padding: 1 }}>
                <Typography sx={{ fontSize: '1rem' }}>Secret Notes</Typography>
              </Box>
              <Box style={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant='body1' style={{ marginRight: '10px' }}>
                  {secretNotes.count}
                </Typography>
                <Typography>
                  <ArrowForwardIosIcon
                    sx={{ fontSize: '1rem', display: 'flex' }}
                  />
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      <Divider sx={{ mt: 2, mb: 2 }} />

      {/* Folders  */}
      <Box>
        <Box>
          <Typography>Folders</Typography>
        </Box>
        <Box>
          {folders &&
            folders.map((folder: any) => (
              <Card
                onClick={() =>
                  handleFolderClick(folder.vaults, folder.folderName)
                }
                key={folder._id}
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
                  <Box sx={{ padding: 1 }}>
                    <Typography sx={{ fontSize: '1rem' }}>
                      {folder.folderName}
                    </Typography>
                  </Box>
                  <Box style={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant='body1' style={{ marginRight: '10px' }}>
                      {folder.vaults.length}
                    </Typography>
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
    </div>
  );
};

export default Vaults;
