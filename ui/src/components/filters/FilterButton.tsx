import React, { memo, useState } from 'react';
import { 
  Button, 
  Popover, 
  Badge, 
  Box,
  Typography
} from '@mui/material';
import { FilterList } from '@mui/icons-material';
import { useApp } from '../../contexts/AppContext';
import FiltersPanel from './FiltersPanel';

function FilterButton() {
  const { filters } = useApp();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'filter-popover' : undefined;

  return (
    <>
      <Badge 
        badgeContent={filters.length} 
        color="primary"
        invisible={filters.length === 0}
      >
        <Button
          aria-describedby={id}
          variant={filters.length > 0 ? "contained" : "outlined"}
          onClick={handleClick}
          startIcon={<FilterList />}
          size="small"
          sx={{
            color: filters.length > 0 ? 'primary.main' : 'white',
            borderColor: 'white',
            backgroundColor: filters.length > 0 ? 'white' : 'transparent',
            '&:hover': {
              backgroundColor: filters.length > 0 ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.1)',
              borderColor: 'white'
            }
          }}
        >
          Filters
        </Button>
      </Badge>
      
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        slotProps={{
          paper: {
            sx: {
              p: 2,
              minWidth: 600,
              maxWidth: 800,
              mt: 1
            }
          }
        }}
      >
        <Box>
          <Typography variant="h6" gutterBottom>
            Event Filters
          </Typography>
          <FiltersPanel onClose={handleClose} />
        </Box>
      </Popover>
    </>
  );
}

export default memo(FilterButton);