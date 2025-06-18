import React, { memo } from 'react';
import { Box, Typography, Paper, Fab } from '@mui/material';
import { KeyboardArrowDown } from '@mui/icons-material';
import { CloudEvent } from '../../types';
import CloudEventCard from './CloudEventCard';
import { useAutoScroll } from '../../hooks/useAutoScroll';

interface EventsListProps {
  events: CloudEvent[];
}

function EventsList({ events }: EventsListProps) {
  const { isAtBottom, shouldAutoScroll, isScrolling, scrollToBottom } = useAutoScroll([events.length]);

  if (events.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No events to display
        </Typography>
        <Typography color="text.secondary">
          Events will appear here when they are received
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Box sx={{ '& > *': { mb: 0.5 } }}>
        {events.map((event, index) => {
          // Create a more unique key combining multiple fields
          const uniqueKey = event.id
            ? `${event.id}-${event.source}-${event.type}-${index}`
            : `event-${index}-${Date.now()}`;

          return (
            <CloudEventCard
              key={uniqueKey}
              event={event}
            />
          );
        })}
      </Box>

      {/* Scroll to bottom button - only show if not auto-scrolling */}
      {!isAtBottom && !shouldAutoScroll && !isScrolling && events.length > 0 && (
        <Fab
          size="small"
          color="primary"
          onClick={scrollToBottom}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000
          }}
        >
          <KeyboardArrowDown />
        </Fab>
      )}
    </Box>
  );
}

export default memo(EventsList);