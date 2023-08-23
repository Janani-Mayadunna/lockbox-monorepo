import React, { useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Collapse,
  List,
  ListItemText,
  ListItemButton,
  InputAdornment,
  IconButton,
  Stack,
  Tooltip,
  Menu,
  MenuItem,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useNavigate } from 'react-router';
import { IFolder } from '../../interfaces';
import SearchIcon from '@mui/icons-material/Search';
import { useAppSelector } from '../../../../../src/store';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import PasswordIcon from '@mui/icons-material/Password';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import FolderZipIcon from '@mui/icons-material/FolderZip';
import CallReceivedIcon from '@mui/icons-material/CallReceived';
interface FilterBarProps {
  onFilterSelect: (filter: string, keyword: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ onFilterSelect }) => {
  const { folders } = useAppSelector((state) => state.vaults);

  const navigate = useNavigate();
  const [isAllVaultsOpen, setIsAllVaultsOpen] = useState(true);
  const [isFilterByCategoryOpen, setIsFilterByCategoryOpen] = useState(true);
  const [isFilterByFolderOpen, setIsFilterByFolderOpen] = useState(true);
  const [isResponsive, setIsResponsive] = useState(window.innerWidth < 1100);
  const [folderMenuAnchorEl, setFolderMenuAnchorEl] =
    React.useState<null | HTMLElement>(null);

  const handleAllVaultsToggle = () => {
    setIsAllVaultsOpen(!isAllVaultsOpen);
  };

  const handleFilterByCategoryToggle = () => {
    setIsFilterByCategoryOpen(!isFilterByCategoryOpen);
  };

  const handleFilterByFolderToggle = () => {
    setIsFilterByFolderOpen(!isFilterByFolderOpen);
  };

  // Listen for window resize events and update the responsiveness state
  const handleResize = () => {
    setIsResponsive(window.innerWidth < 750);
    // console.log('window.innerWidth: ', window.innerWidth);
    // console.log('isResponsive: ', isResponsive);
  };

  // Folder menu

  const handleFolderMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setFolderMenuAnchorEl(event.currentTarget);
  };

  const handleFolderMenuClose = () => {
    setFolderMenuAnchorEl(null);
  };

  // Attach and detach window resize event listener
  React.useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div>
      <Box
        sx={{
          height: 'auto',
          minHeight: '450px',
          position: 'initial',
          boxShadow:
            'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px',
          borderRadius: '8px',
          mt: 6,
          maxWidth: {
            xs: '5rem',
            sm: '9rem',
            md: '10rem',
            lg: '100%',
          },
        }}
      >
        {/* Search Bar */}
        <Box
          sx={{
            p: 2,
            pt: 4,
            display: {
              xs: 'none',
              sm: 'none',
              md: 'block',
              lg: 'block',
            },
          }}
        >
          <TextField
            fullWidth
            variant='outlined'
            label='Search'
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {!isResponsive ? (
          <Box sx={{ padding: '16px' }}>
            {/* Filter by vault owner */}
            <Typography
              variant='body1'
              sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}
            >
              {isAllVaultsOpen ? (
                <ExpandLessIcon onClick={handleAllVaultsToggle} />
              ) : (
                <ExpandMoreIcon onClick={handleAllVaultsToggle} />
              )}
              <span style={{ marginLeft: '8px' }}>All Vaults</span>
            </Typography>
            <Collapse in={isAllVaultsOpen}>
              <List>
                <ListItemButton sx={{ pt: 0, pb: 0, pl: 7 }}>
                  <ListItemText
                    primary={<Typography variant='body2'>My Vaults</Typography>}
                    onClick={() => onFilterSelect('', '')}
                  />
                </ListItemButton>
                <ListItemButton
                  sx={{ pt: 0, pb: 0, pl: 7 }}
                  onClick={() => navigate('/vault/received')}
                >
                  <ListItemText
                    primary={
                      <Typography variant='body2'>Received Vaults</Typography>
                    }
                  />
                </ListItemButton>
              </List>
            </Collapse>

            {/* Filter by category */}
            <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
              {isFilterByCategoryOpen ? (
                <ExpandLessIcon onClick={handleFilterByCategoryToggle} />
              ) : (
                <ExpandMoreIcon onClick={handleFilterByCategoryToggle} />
              )}
              <span style={{ marginLeft: '8px' }}>Categories</span>
            </Typography>
            <Collapse in={isFilterByCategoryOpen}>
              <List>
                <ListItemButton
                  sx={{ pt: 0, pb: 0, pl: 7 }}
                  onClick={() => onFilterSelect('Login', 'category')}
                >
                  <ListItemText
                    primary={<Typography variant='body2'>Login</Typography>}
                  />
                </ListItemButton>

                <ListItemButton
                  sx={{ pt: 0, pb: 0, pl: 7 }}
                  onClick={() => onFilterSelect('Secret Note', 'category')}
                >
                  <ListItemText
                    primary={
                      <Typography variant='body2'>Secret Note</Typography>
                    }
                  />
                </ListItemButton>
              </List>
            </Collapse>

            {/* Filter by folder */}
            <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
              {isFilterByFolderOpen ? (
                <ExpandLessIcon onClick={handleFilterByFolderToggle} />
              ) : (
                <ExpandMoreIcon onClick={handleFilterByFolderToggle} />
              )}
              <span style={{ marginLeft: '8px' }}>Folders</span>
            </Typography>
            <Collapse in={isFilterByFolderOpen}>
              <List>
                {folders &&
                  folders?.map((folder: IFolder) => (
                    <ListItemButton
                      sx={{ pt: 0, pb: 0, pl: 7 }}
                      key={folder._id}
                      onClick={() => onFilterSelect(folder._id, 'folder')}
                    >
                      <ListItemText
                        primary={
                          <Typography variant='body2'>
                            {folder.folderName}
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  ))}
              </List>
            </Collapse>
          </Box>
        ) : (
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: 'flex', md: 'none' },
            }}
          >
            <Stack spacing={2}>
              <Tooltip title='My Vaults'>
                <IconButton onClick={() => onFilterSelect('', '')}>
                  <Stack sx={{ display: 'flex', alignItems: 'center' }}>
                    <FormatAlignJustifyIcon />
                    <Typography variant='caption'>My Vault</Typography>
                  </Stack>
                </IconButton>
              </Tooltip>

              <Tooltip title='Received Vaults'>
                <IconButton onClick={() => navigate('/vault/received')}>
                  <Stack sx={{ display: 'flex', alignItems: 'center' }}>
                    <CallReceivedIcon />
                    <Typography variant='caption'>Received</Typography>
                  </Stack>
                </IconButton>
              </Tooltip>

              <Tooltip title='Logins'>
                <IconButton onClick={() => onFilterSelect('Login', 'category')}>
                  <Stack sx={{ display: 'flex', alignItems: 'center' }}>
                    <PasswordIcon />
                    <Typography variant='caption'>Logins</Typography>
                  </Stack>
                </IconButton>
              </Tooltip>

              <Tooltip title='Secret Notes'>
                <IconButton
                  onClick={() => onFilterSelect('Secret Note', 'category')}
                >
                  <Stack sx={{ display: 'flex', alignItems: 'center' }}>
                    <StickyNote2Icon />
                    <Typography variant='caption'>Notes</Typography>
                  </Stack>
                </IconButton>
              </Tooltip>

              <Tooltip title='Folders'>
                <IconButton onClick={handleFolderMenuOpen}>
                  <Stack sx={{ display: 'flex', alignItems: 'center' }}>
                    <FolderZipIcon />
                    <Typography variant='caption'>Folders</Typography>
                  </Stack>
                </IconButton>
              </Tooltip>

              <Menu
                anchorEl={folderMenuAnchorEl}
                open={Boolean(folderMenuAnchorEl)}
                onClose={handleFolderMenuClose}
              >
                {folders &&
                  folders?.map((folder: IFolder) => (
                    <MenuItem
                      key={folder._id}
                      onClick={() => {
                        onFilterSelect(folder._id, 'folder');
                        handleFolderMenuClose();
                      }}
                    >
                      {folder.folderName}
                    </MenuItem>
                  ))}
              </Menu>
            </Stack>
          </Box>
        )}
      </Box>
    </div>
  );
};

export default FilterBar;
