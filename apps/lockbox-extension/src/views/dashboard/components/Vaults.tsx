import {
  Box,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import SavedSearchIcon from '@mui/icons-material/SavedSearch';
import { getAllVaults, getDecryptedAllVaults } from '../../../utils/api';

const Vaults: React.FC<{}> = () => {
  const [vaults, setVaults] = React.useState([]);

  const getVaults = async () => {
    await getAllVaults();
    const decryptedVaults = await getDecryptedAllVaults();
    console.log('decrypted vaults from vault ui', decryptedVaults);
    setVaults(decryptedVaults);
    // data is fetched successfully. 
    // Continue this after setting up backend for folders and categories
  };

  React.useEffect(() => {
    getVaults();
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

      <Card variant='outlined' sx={{ backgroundColor: '#91b9ce', padding: 0 }}>
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
            <Typography sx={{ fontSize: '1rem' }}>Left Box</Typography>
          </Box>
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant='body1' style={{ marginRight: '10px' }}>
              1
            </Typography>
            <Typography>
              <ArrowForwardIosIcon sx={{ fontSize: '1rem', display: 'flex' }} />
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default Vaults;
