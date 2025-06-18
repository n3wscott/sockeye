import React, { memo } from 'react';
import { IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { useApp } from '../../contexts/AppContext';

function ConnectionStatus() {
  const { events, clearEvents } = useApp();

  return (
    <IconButton 
      onClick={clearEvents}
      title="Clear events"
      size="small"
      disabled={events.length === 0}
      sx={{
        color: 'white',
        '&:disabled': {
          color: 'rgba(255, 255, 255, 0.3)'
        }
      }}
    >
      <Delete />
    </IconButton>
  );
}

export default memo(ConnectionStatus);