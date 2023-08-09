import { Typography } from '@mui/material';
import React, { useEffect } from 'react';
import BottomNav from './components/BottomNav';
import Vaults from './components/Vaults';
import AddVault from './components/AddVault';
import { authorizedFetch } from '../../utils/request-interceptor';
import { getAllVaults } from '../../utils/api';

const Dashboard = () => {
  const [selectedValue, setSelectedValue] =
    React.useState<string>('all_vaults');

  const handleNavChange = (newValue: string) => {
    setSelectedValue(newValue);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 350 }}>
      <div style={{ flex: '1', marginBottom: 'auto' }}>
        {selectedValue === 'all_vaults' ? (
          <Vaults />
        ) : selectedValue === 'add_vault' ? (
          <AddVault />
        ) : selectedValue === 'generator' ? (
          <div>Generator</div>
        ) : (
          ''
        )}
      </div>

      <div style={{ flexShrink: 0 }}>
        <BottomNav onNavChange={handleNavChange} />
      </div>
    </div>
  );
};

export default Dashboard;
