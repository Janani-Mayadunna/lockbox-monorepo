import { Box, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import BottomNav from './components/BottomNav';

const Dashboard: React.FC<{}> = () => {
  const [selectedValue, setSelectedValue] = React.useState('all_vaults');

  const handleNavChange = (newValue: string) => {
    setSelectedValue(newValue);
  };

  useEffect(() => {
    console.log('selected value', selectedValue);
  }, [selectedValue]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 350 }}>
      <div style={{ flex: '1', marginBottom: 'auto' }}>
        <Typography>Dashboard</Typography>
        {selectedValue === 'all_vaults' && <div>Vaults</div>}
        {selectedValue === 'add_vault' && <div>Add Vault</div>}
        {selectedValue === 'generator' && <div>Generator</div>}
      </div>

      <div style={{ flexShrink: 0 }}>
        <BottomNav onNavChange={handleNavChange} />
      </div>
    </div>
  );
};

export default Dashboard;
