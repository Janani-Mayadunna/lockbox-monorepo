import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FolderZipIcon from '@mui/icons-material/FolderZip';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

interface BottomNavProps {
  onNavChange: (newValue: string) => void;
}

export default function BottomNav({ onNavChange }: BottomNavProps) {
  const [value, setValue] = React.useState<string>('all_vaults');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    onNavChange(newValue);
  };

  return (
    <Box>
      <BottomNavigation 
      // sx={{backgroundColor: '#b6c9d6'}}
       showLabels value={value} onChange={handleChange}>
        <BottomNavigationAction
          label='Vaults'
          value='all_vaults'
          icon={<FolderZipIcon />}
        />
        <BottomNavigationAction
          label='Add Vault'
          value='add_vault'
          icon={<AddCircleOutlineIcon />}
        />
        <BottomNavigationAction
          label='Generator'
          value='generator'
          icon={<LocationOnIcon />}
        />
      </BottomNavigation>
    </Box>
  );
}
