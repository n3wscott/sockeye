import React, { memo } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { CloudEvent } from '../../types';

interface EventAttributesProps {
  event: CloudEvent;
}

function EventAttributes({ event }: EventAttributesProps) {
  const attributeEntries = Object.entries(event).filter(
    ([key]) => key !== 'data' && key !== 'data_base64'
  );

  return (
    <Box>
      {attributeEntries.map(([key, value]) => (
        <Box key={key} mb={1}>
          <Typography variant="caption" color="text.secondary" component="div">
            {key}
          </Typography>
          <Typography variant="body2" component="div" sx={{ wordBreak: 'break-word' }}>
            {key === 'time' && value ? (
              new Date(value).toLocaleString()
            ) : key === 'datacontenttype' && value ? (
              <Chip label={value} size="small" variant="outlined" />
            ) : (
              String(value || '')
            )}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

export default memo(EventAttributes);