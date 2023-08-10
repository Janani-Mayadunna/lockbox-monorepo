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
} from '../../../utils/api';
import { useNavigate } from 'react-router-dom';

const Vaults: React.FC<{}> = () => {
  const navigate = useNavigate();
  const [vaults, setVaults] = React.useState([]);
  const [folders, setFolders] = React.useState([]);
  const [loginCount, setLoginCount] = React.useState(0);
  const [secretNoteCount, setSecretNoteCount] = React.useState(0);

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

  const getByCategories = (keyword: string) => {
    if (keyword === 'Login') {
      const logins = vaults.filter((vault: any) => vault.category === 'Login');
      setLoginCount(logins.length);
      return logins;
    } else if (keyword === 'Secret Note') {
      const secretNotes = vaults.filter(
        (vault: any) => vault.category === 'Secret Note'
      );
      setSecretNoteCount(secretNotes.length);
      return secretNotes;
    }
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

  return (
    <div>
      <Box sx={{ mb: 3 }}>
        <TextField
          variant='outlined'
          fullWidth
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
                  {loginCount}
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
            sx={{ backgroundColor: '#91b9ce', p: 0, mt: 1, ml: 1, mr: 1 }}
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
                  {secretNoteCount}
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
          {folders.map((folder: any) => (
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
