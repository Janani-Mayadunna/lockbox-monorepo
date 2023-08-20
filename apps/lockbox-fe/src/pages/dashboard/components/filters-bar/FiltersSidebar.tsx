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
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useNavigate } from 'react-router';
import { IFolder } from '../../interfaces';
import SearchIcon from '@mui/icons-material/Search';
import { useAppSelector } from '../../../../../src/store';

interface FilterBarProps {
  onFilterSelect: (filter: string, keyword: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ onFilterSelect }) => {
  const { folders } = useAppSelector((state) => state.vaults);

  const navigate = useNavigate();
  const [isAllVaultsOpen, setIsAllVaultsOpen] = useState(true);
  const [isFilterByCategoryOpen, setIsFilterByCategoryOpen] = useState(true);
  const [isFilterByFolderOpen, setIsFilterByFolderOpen] = useState(true);

  const handleAllVaultsToggle = () => {
    setIsAllVaultsOpen(!isAllVaultsOpen);
  };

  const handleFilterByCategoryToggle = () => {
    setIsFilterByCategoryOpen(!isFilterByCategoryOpen);
  };

  const handleFilterByFolderToggle = () => {
    setIsFilterByFolderOpen(!isFilterByFolderOpen);
  };

  return (
    <Box
      sx={{
        height: 'auto',
        minHeight: '450px',
        position: 'initial',
        boxShadow:
          'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px',
        borderRadius: '8px',
        mt: 6,
      }}
    >
      {/* Search Bar */}
      <Box sx={{ p: 2, pt: 4 }}>
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
                primary={<Typography variant='body2'>Secret Note</Typography>}
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
    </Box>
  );
};

export default FilterBar;
