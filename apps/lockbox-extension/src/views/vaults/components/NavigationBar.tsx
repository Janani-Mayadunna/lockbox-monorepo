import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Box from '@mui/material/Box';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
  children?: React.ReactElement;
  title?: string;
}

function ElevationScroll(props: Props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

export default function ElevateAppBar(props: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <React.Fragment>
      <CssBaseline />
      <ElevationScroll {...props}>
        <AppBar sx={{ backgroundColor: '#1b4266' }}>
          <Toolbar
            sx={{
              minHeight: '3rem',
              display: 'flex',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Box>
              {location.pathname === '/dashboard' ? (
                ''
              ) : (
                <Button onClick={() => navigate('/dashboard')}>
                  <ArrowBackIcon sx={{ color: 'white' }} />
                </Button>
              )}
            </Box>
            <Box sx={{ pl: '20px', width: '40%' }}>
              <Typography
                variant='h6'
                component='div'
                sx={{ textAlign: 'center' }}
              >
                {props.title === 'Secret Note'
                  ? 'Notes'
                  : props.title === 'Login'
                  ? 'Logins'
                  : props.title}
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>
      </ElevationScroll>
      <Toolbar />
    </React.Fragment>
  );
}
