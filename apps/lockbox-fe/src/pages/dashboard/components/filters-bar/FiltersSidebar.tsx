import { useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Collapse,
  List,
  ListItemText,
  ListItemButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useNavigate } from 'react-router';

const FilterBar = () => {
  const navigate = useNavigate();
  const [isAllVaultsOpen, setIsAllVaultsOpen] = useState(true);
  const [isFilterByCategoryOpen, setIsFilterByCategoryOpen] = useState(true);

  const handleAllVaultsToggle = () => {
    setIsAllVaultsOpen(!isAllVaultsOpen);
  };

  const handleFilterByCategoryToggle = () => {
    setIsFilterByCategoryOpen(!isFilterByCategoryOpen);
  };

  return (
    <Box
      sx={{
        height: '400px',
        position: 'initial',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
      }}
    >
      {/* Search Bar */}
      <Box sx={{ padding: '16px' }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Search"
          // search functionality here
        />
      </Box>

      {/* Filter by Category */}
      <Box sx={{ padding: '16px' }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
          {isAllVaultsOpen ? (
            <ExpandLessIcon onClick={handleAllVaultsToggle} />
          ) : (
            <ExpandMoreIcon onClick={handleAllVaultsToggle} />
          )}
          <span style={{ marginLeft: '8px' }}>All Vaults</span>
        </Typography>
        <Collapse in={isAllVaultsOpen}>
          <List>
            <ListItemButton sx={{ pt: 0, pb: 0 }}>
              <ListItemText primary="My Vaults" onClick={() => navigate('/dashboard')}/>
            </ListItemButton>
            <ListItemButton sx={{ pt: 0, pb: 0 }} onClick={()=> navigate('/vault/received')}>
              <ListItemText primary="Received Vaults" />
            </ListItemButton>
            {/*  more vaults here */}
          </List>
        </Collapse>
        <Typography variant="h6">
          {isFilterByCategoryOpen ? (
            <ExpandLessIcon onClick={handleFilterByCategoryToggle} />
          ) : (
            <ExpandMoreIcon onClick={handleFilterByCategoryToggle} />
          )}
          <span style={{ marginLeft: '8px' }}>Filter by Category</span>
        </Typography>
        <Collapse in={isFilterByCategoryOpen}>
          <List>
            <ListItemButton sx={{ pt: 0, pb: 0 }}>
              <ListItemText primary="Category 1" />
            </ListItemButton>
            {/*  more categories here */}
          </List>
        </Collapse>
        <Typography variant="h6" sx={{ marginBottom: '8px' }}>
          Filter by Folders
        </Typography>
      </Box>
    </Box>
  );
};

export default FilterBar;
