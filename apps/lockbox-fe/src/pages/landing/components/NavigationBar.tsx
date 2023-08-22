/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InfoIcon from '@mui/icons-material/Info';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useNavigate } from 'react-router';

const Navbar = () => {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);
  const menuOptions = [
    {
      text: 'User Guide',
      icon: <InfoIcon />,
    },
  ];
  return (
    <nav>
      <div className='nav-logo-container'>
        {/* <img src={Logo} alt="" /> */}
      </div>
      <div className='navbar-links-container'>
        <a href='https://surgeglobal.atlassian.net/l/cp/5kqRY6BR'>User Manual</a>
        <a href=''>
          <PlayArrowIcon className='navbar-cart-icon' />
        </a>
        <button className='primary-button' onClick={() => navigate('/auth')}>
          Login
        </button>
      </div>
      <div className='navbar-menu-container'>
        <PlayArrowIcon onClick={() => setOpenMenu(true)} />
      </div>
      <Drawer open={openMenu} onClose={() => setOpenMenu(false)} anchor='right'>
        <Box
          sx={{ width: 250 }}
          role='presentation'
          onClick={() => setOpenMenu(false)}
          onKeyDown={() => setOpenMenu(false)}
        >
          <List>
            {menuOptions.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
        </Box>
      </Drawer>
    </nav>
  );
};

export default Navbar;
