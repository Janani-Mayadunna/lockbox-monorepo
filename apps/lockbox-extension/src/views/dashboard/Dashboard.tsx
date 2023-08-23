import { Container } from '@mui/material';
import React from 'react';
import BottomNav from './components/BottomNav';
import Vaults from './components/Filters';
import AddVault from './components/AddVault';
import CurrentTabVaults from './components/CurrentTabVaults';
import Settings from './components/Settings';
import { useNavigate } from 'react-router-dom';
import { logOut } from '../../utils/api';

const Dashboard = () => {
  const navigate = useNavigate();

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'replaceToLogin') {
      setValidity(false);
    }
    sendResponse({ response: 'dashboard' });
  });

  const [validity, setValidity] = React.useState<boolean>(true);
  const [selectedValue, setSelectedValue] =
    React.useState<string>('all_vaults');

  const handleNavChange = (newValue: string) => {
    setSelectedValue(newValue);
  };

  React.useEffect(() => {
    if (!validity) {
      logOut();
      navigate('/');
    }
  }, [validity]);

  return (
    <>
      <Container
        sx={{ height: '400px', minWidth: '300px', overflowY: 'scroll', pb: 8 }}
      >
        <div
          style={{ display: 'flex', flexDirection: 'column', minHeight: 350 }}
        >
          <div style={{ flex: '1', marginBottom: 'auto' }}>
            {selectedValue === 'all_vaults' ? (
              <Vaults />
            ) : selectedValue === 'add_vault' ? (
              <AddVault />
            ) : selectedValue === 'generator' ? (
              <div>Generator</div>
            ) : selectedValue === 'current_tab_vaults' ? (
              <CurrentTabVaults />
            ) : selectedValue === 'settings' ? (
              <Settings />
            ) : (
              ''
            )}
          </div>
        </div>
      </Container>

      <div
        style={{
          flexShrink: 0,
          position: 'absolute',
          bottom: 0,
          width: '-webkit-fill-available',
          zIndex: 100,
        }}
      >
        <BottomNav onNavChange={handleNavChange} />
      </div>
    </>
  );
};

export default Dashboard;
