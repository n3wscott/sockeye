import React, { memo, useState, useCallback } from 'react';
import { 
  Box, 
  TextField, 
  Select, 
  MenuItem, 
  Button, 
  IconButton,
  FormControl,
  InputLabel
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { useApp } from '../../contexts/AppContext';
import { Filter } from '../../types';

const MATCH_OPTIONS = [
  { value: 'Exact', label: 'Exact' },
  { value: 'Includes', label: 'Includes' },
  { value: 'Prefix', label: 'Prefix' },
  { value: 'Suffix', label: 'Suffix' },
] as const;

interface FiltersPanelProps {
  onClose?: () => void;
}

function FiltersPanel({ onClose }: FiltersPanelProps) {
  const { filters, setFilters } = useApp();
  const [newFilter, setNewFilter] = useState<Filter>({
    attr: '',
    match: 'Exact',
    value: ''
  });

  const handleAddFilter = useCallback(() => {
    if (newFilter.attr && newFilter.value) {
      setFilters([...filters, newFilter]);
      setNewFilter({ attr: '', match: 'Exact', value: '' });
    }
  }, [filters, newFilter, setFilters]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddFilter();
    } else if (e.key === 'Escape' && onClose) {
      onClose();
    }
  }, [handleAddFilter, onClose]);

  const handleRemoveFilter = useCallback((index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  }, [filters, setFilters]);

  const handleClearFilters = useCallback(() => {
    setFilters([]);
  }, [setFilters]);

  return (
    <Box>
      {/* Add New Filter */}
      <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
        <TextField
          size="small"
          label="Attribute"
          value={newFilter.attr}
          onChange={(e) => setNewFilter({ ...newFilter, attr: e.target.value })}
          placeholder="e.g., source, type"
          sx={{ minWidth: 120 }}
        />
        
        <FormControl size="small" sx={{ minWidth: 100 }}>
          <InputLabel>Match</InputLabel>
          <Select
            value={newFilter.match}
            label="Match"
            onChange={(e) => setNewFilter({ ...newFilter, match: e.target.value as Filter['match'] })}
          >
            {MATCH_OPTIONS.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <TextField
          size="small"
          label="Value"
          value={newFilter.value}
          onChange={(e) => setNewFilter({ ...newFilter, value: e.target.value })}
          onKeyPress={handleKeyPress}
          sx={{ minWidth: 150, flex: 1 }}
        />
        
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddFilter}
          disabled={!newFilter.attr || !newFilter.value}
        >
          Add
        </Button>
        
        <Button
          variant="outlined"
          onClick={handleClearFilters}
          disabled={filters.length === 0}
        >
          Clear All
        </Button>
      </Box>

      {/* Current Filters */}
      {filters.map((filter, index) => (
        <Box key={index} display="flex" alignItems="center" gap={1} mt={1}>
          <TextField
            size="small"
            value={filter.attr}
            disabled
            sx={{ minWidth: 120 }}
          />
          <TextField
            size="small"
            value={filter.match}
            disabled
            sx={{ minWidth: 100 }}
          />
          <TextField
            size="small"
            value={filter.value}
            disabled
            sx={{ flex: 1 }}
          />
          <IconButton 
            size="small" 
            onClick={() => handleRemoveFilter(index)}
            color="error"
          >
            <Delete />
          </IconButton>
        </Box>
      ))}
    </Box>
  );
}

export default memo(FiltersPanel);