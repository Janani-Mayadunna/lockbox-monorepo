import { Box, Card, CardContent, Typography } from '@mui/material';
import React from 'react';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { decryptTabVaults } from '../../../utils/api';

const CurrentTabVaults: React.FC<{}> = () => {
  const [tabVaults, setTabVaults] = React.useState<string[]>([]);

  const getTabVaults = async () => {
    const currentTabVaults = await decryptTabVaults();
    // console.log('currentTabVaults', currentTabVaults);
    setTabVaults(currentTabVaults);
  };

  const handleAutoFill = ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    // send these to background script
    chrome.runtime.sendMessage(
      { action: 'autoFill', username, password },
      (response) => {
        // console.log('Background script response:', response);
      }
    );
  };

  React.useEffect(() => {
    getTabVaults();
  }, []);

  // React.useEffect(() => {
  //   console.log('tabVaults', tabVaults);
  // }, [tabVaults]);

  return (
    <div>
      <h1>Current Tab Vaults</h1>

      <Box>
        {tabVaults?.map((vault: any) => (
          <Card
            onClick={() =>
              handleAutoFill({
                username: vault.username,
                password: vault.password,
              })
            }
            key={vault._id}
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
              <Box sx={{ display: 'flex' }}>
                <Box sx={{ pt: 0.5 }}>
                  {vault.link?.split('//') && vault.link.split('//')[1] ? (
                    <img
                      src={`https://icons.bitwarden.net/${
                        vault.link.split('//')[1]
                      }/icon.png`}
                      alt='logo'
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '30%',
                      }}
                    />
                  ) : (
                    <img
                      src='https://cdn-icons-png.flaticon.com/512/3170/3170748.png'
                      alt='logo'
                      style={{ width: '30px', height: '30px' }}
                    />
                  )}
                </Box>
                <Box sx={{ padding: 1 }}>
                  <Typography sx={{ fontSize: '1rem' }}>
                    {vault.name}
                  </Typography>
                </Box>
              </Box>
              <Box style={{ display: 'flex', alignItems: 'center' }}>
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
    </div>
  );
};

export default CurrentTabVaults;
