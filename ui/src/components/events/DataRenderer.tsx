import React, { memo } from 'react';
import { Box } from '@mui/material';
import JSONPretty from 'react-json-pretty';
import { useTheme } from '@mui/material/styles';
import { CloudEvent } from '../../types';

interface DataRendererProps {
  event: CloudEvent;
}

function parseQuotedData(data: any): any {
  if (typeof data === 'string' && data.startsWith('"') && data.endsWith('"')) {
    try {
      return JSON.parse(data);
    } catch {
      return data;
    }
  }
  return data;
}

function DataRenderer({ event }: DataRendererProps) {
  const theme = useTheme();
  let data = event.data;
  
  // Handle base64 encoded data
  if (event.data_base64) {
    try {
      data = atob(event.data_base64);
    } catch (err) {
      console.error('Failed to decode base64 data:', err);
      data = event.data_base64;
    }
  }

  const mediaType = event.datacontenttype || 'text/plain';
  const parsedData = parseQuotedData(data);

  // Get theme-aware JSON colors
  const getJsonTheme = () => {
    if (theme.palette.mode === 'dark') {
      return {
        main: 'line-height:1.3;color:#e0e0e0;background:#2d2d2d;overflow:auto;padding:8px;border-radius:4px;border:1px solid #444;',
        error: 'line-height:1.3;color:#ff6b6b;background:#2d2d2d;overflow:auto;',
        key: 'color:#66d9ef;',      // Cyan for keys
        string: 'color:#a6e22e;',   // Green for strings
        value: 'color:#ae81ff;',    // Purple for values
        boolean: 'color:#fd971f;'   // Orange for booleans
      };
    } else {
      return {
        main: 'line-height:1.3;color:#444;background:#fff;overflow:auto;padding:8px;border-radius:4px;border:1px solid #e0e0e0;',
        error: 'line-height:1.3;color:#444;background:#fff;overflow:auto;',
        key: 'color:#881391;',      // Purple for keys
        string: 'color:#c41a16;',   // Red for strings  
        value: 'color:#1c00cf;',    // Blue for values
        boolean: 'color:#1c00cf;'   // Blue for booleans
      };
    }
  };

  // Handle JSON content
  if (mediaType.startsWith('application/json') || mediaType.startsWith('text/json')) {
    try {
      const jsonData = typeof parsedData === 'string' ? JSON.parse(parsedData) : parsedData;
      return (
        <Box>
          <JSONPretty 
            data={jsonData}
            theme={getJsonTheme()}
            space={2}
          />
        </Box>
      );
    } catch (err) {
      return (
        <Box component="pre" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {String(parsedData)}
        </Box>
      );
    }
  }

  // Handle images
  if (mediaType.startsWith('image/')) {
    if (typeof parsedData === 'string' && parsedData.startsWith('data:image/')) {
      return (
        <Box>
          <img 
            src={parsedData} 
            alt="CloudEvent data" 
            style={{ 
              maxWidth: '100%', 
              height: 'auto',
              borderRadius: 4
            }} 
          />
        </Box>
      );
    }
  }

  // Handle XML
  if (mediaType.startsWith('application/xml') || mediaType.startsWith('text/xml')) {
    return (
      <Box component="pre" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
        {String(parsedData)}
      </Box>
    );
  }

  // Default: plain text
  return (
    <Box component="pre" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
      {String(parsedData)}
    </Box>
  );
}

export default memo(DataRenderer);