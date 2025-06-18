import React, { memo, useMemo } from 'react';
import { 
  Container, 
  Box, 
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
import { useApp } from '../../contexts/AppContext';
import { filterEvents } from '../../utils/filterUtils';
import EventsList from '../events/EventsList';
import FilterButton from '../filters/FilterButton';
import ConnectionStatus from '../common/ConnectionStatus';
import { useWebSocket } from '../../hooks/useWebSocket';

function Dashboard() {
  const { events, filters, loading, error, isConnected } = useApp();
  const { connect, disconnect } = useWebSocket();
  
  const filteredEvents = useMemo(() => 
    filterEvents(events, filters), 
    [events, filters]
  );

  return (
    <>
      {/* Sticky Header */}
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center" 
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1100,
          background: 'linear-gradient(135deg, #6C5CE7FF 50%, #E91E63 100%)',
          color: 'white',
          p: 2,
          boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
          '& .MuiTypography-root': {
            color: 'white'
          }
        }}
      >
        <Box
          component="img"
          src="/sockeye-logo.png"
          alt={isConnected ? 'Connected' : 'Disconnected'}
          onClick={() => {
            if (isConnected) {
              disconnect();
            } else {
              connect();
            }
          }}
          sx={{
            height: '40px',
            width: 'auto',
            cursor: 'pointer',
            filter: isConnected ? 'none' : 'brightness(0) invert(1)',
            transition: 'filter 0.2s ease, opacity 0.2s ease',
            '&:hover': {
              opacity: 0.8
            }
          }}
        />
        <Box display="flex" alignItems="center" gap={2}>
          <Chip 
            label={`Total: ${events.length}`} 
            clickable={false}
            sx={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              cursor: 'default'
            }}
            variant="outlined"
            size="small"
          />
          {filters.length > 0 && (
            <Chip 
              label={`Showing: ${filteredEvents.length}`} 
              clickable={false}
              sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.25)',
                color: 'white',
                cursor: 'default'
              }}
              variant="filled"
              size="small"
            />
          )}
          <FilterButton />
          <ConnectionStatus />
        </Box>
      </Box>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        )}

        {/* Events List */}
        <EventsList events={filteredEvents} />
      </Container>
    </>
  );
}

export default memo(Dashboard);