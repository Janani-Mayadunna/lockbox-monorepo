import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import FolderZipIcon from '@mui/icons-material/FolderZip';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import SettingsIcon from '@mui/icons-material/Settings';

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
        showLabels
        value={value}
        onChange={handleChange}
        sx={{ pr: 1, WebkitTextStrokeWidth: 'medium' }}
      >
        <BottomNavigationAction sx={{ minWidth: '60px', borderBlockEnd: '1px solid #b6c9d6'}}
          label='Fill'
          value='current_tab_vaults'
          icon={<KeyboardDoubleArrowLeftIcon />}
        />
        <BottomNavigationAction sx={{ minWidth: '60px'}}
          label='Vaults'
          value='all_vaults'
          icon={<FolderZipIcon />}
        />
        <BottomNavigationAction sx={{ minWidth: '60px'}}
          label='Add'
          value='add_vault'
          icon={<AddCircleOutlineIcon />}
        />
        <BottomNavigationAction sx={{ minWidth: '60px'}}
          label='Generate'
          value='generator'
          icon={<AutoAwesomeIcon />}
        />
        <BottomNavigationAction sx={{ minWidth: '60px'}}
          label='Settings'
          value='settings'
          icon={<SettingsIcon />}
        />
      </BottomNavigation>
    </Box>
  );
}
