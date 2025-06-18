import React, { memo, useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableRow, 
  Paper,
  Box,
  Typography,
  Chip,
  Collapse
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { CloudEvent } from '../../types';
import DataRenderer from './DataRenderer';

interface CloudEventCardProps {
  event: CloudEvent;
}

function CloudEventCard({ event }: CloudEventCardProps) {
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();

  if (!event) {
    return (
      <Paper sx={{ p: 1, mb: 1 }}>
        <Typography color="text.secondary">No event data</Typography>
      </Paper>
    );
  }

  // Filter out data fields and datacontenttype (shown in data area)
  // Only show specversion if it's not the standard "1.0"
  const attributeEntries = Object.entries(event).filter(
    ([key, value]) => {
      if (key === 'data' || key === 'data_base64' || key === 'datacontenttype') {
        return false;
      }
      if (key === 'specversion' && value === '1.0') {
        return false;
      }
      return true;
    }
  );

  // Get data preview
  const getDataPreview = () => {
    if (!event.data) return null;
    const dataStr = typeof event.data === 'string' ? event.data : JSON.stringify(event.data);
    return dataStr.length > 100 ? dataStr.substring(0, 100) + '...' : dataStr;
  };

  // Get type color based on event type (theme-aware colors)
  const getTypeColor = (type: string) => {
    const lightModeColors = [
      // Vibrant but not too bright for light backgrounds
      '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4',
      '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FF9800',
      '#FF5722', '#795548', '#607D8B', '#F44336', '#9E9E9E', '#DC004E',
      '#6C5CE7', '#A29BFE', '#FD79A8', '#FDCB6E', '#E17055', '#00B894',
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD',
      '#FF8A80', '#B39DDB', '#90CAF9', '#81C784', '#FFB74D', '#F06292'
    ];
    
    const darkModeColors = [
      // Brighter, more neon colors for dark backgrounds  
      '#FF1744', '#E040FB', '#7C4DFF', '#448AFF', '#40C4FF', '#18FFFF',
      '#64FFDA', '#69F0AE', '#B2FF59', '#EEFF41', '#FFFF00', '#FF9100',
      '#FF3D00', '#8D6E63', '#78909C', '#F44336', '#BDBDBD', '#FF006E',
      '#8338EC', '#3A86FF', '#06FFA5', '#FFBE0B', '#FB5607', '#FF10F0',
      '#00D9FF', '#39FF14', '#00FFFF', '#FF1493', '#9400D3', '#FFD700',
      '#FF9A8B', '#A8E6CF', '#DDA0DD', '#98D8C8', '#F7DC6F', '#E74C3C'
    ];
    
    const colors = theme.palette.mode === 'dark' ? darkModeColors : lightModeColors;
    
    const hash = type.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <Paper 
      variant="outlined" 
      sx={{ 
        mb: 1,
        borderLeft: `4px solid ${getTypeColor(event.type)}`,
        borderRadius: '4px'
      }}
    >
      <Box display="flex">
        {/* Attributes Table - Left Side */}
        <Box flex="0 0 300px">
          <TableContainer>
            <Table size="small">
              <TableBody>
                {attributeEntries.map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell 
                      component="th" 
                      scope="row" 
                      sx={{ 
                        fontWeight: 'medium', 
                        width: '80px',
                        py: 0.25,
                        px: 1,
                        fontSize: '0.75rem',
                        borderBottom: '1px solid rgba(224, 224, 224, 0.2)'
                      }}
                    >
                      {key}
                    </TableCell>
                    <TableCell sx={{ 
                      py: 0.25, 
                      px: 1,
                      fontSize: '0.75rem',
                      borderBottom: '1px solid rgba(224, 224, 224, 0.2)'
                    }}>
                      {key === 'time' && value ? (
                        new Date(value).toLocaleString()
                      ) : (
                        String(value || '')
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Data Display - Right Side */}
        <Box 
          flex="1" 
          sx={{ 
            borderLeft: '1px solid rgba(224, 224, 224, 0.2)',
            minHeight: expanded ? 'auto' : '40px',
            position: 'relative'
          }}
        >
          {/* Content type pill with preview and expand button */}
          <Box 
            display="flex" 
            alignItems="center" 
            justifyContent={expanded ? "flex-end" : "space-between"}
            sx={{ p: 1 }}
          >
            {/* Data preview - left justified (only when collapsed) */}
            {!expanded && getDataPreview() && (
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ 
                  fontSize: '0.75rem',
                  fontFamily: 'monospace',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  flex: 1,
                  mr: 1
                }}
              >
                {getDataPreview()}
              </Typography>
            )}
            
            {/* Content type pill - right justified */}
            {event.datacontenttype && (
              <Chip 
                label={event.datacontenttype}
                size="small"
                variant="outlined"
                sx={{ 
                  fontSize: '0.7rem',
                  fontFamily: 'monospace',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
                onClick={() => setExpanded(!expanded)}
                onDelete={() => setExpanded(!expanded)}
                deleteIcon={expanded ? <ExpandLess /> : <ExpandMore />}
              />
            )}
          </Box>
          
          {/* Expandable full data content */}
          <Collapse in={expanded}>
            <Box sx={{ p: 1, pt: 0, width: '100%' }}>
              <DataRenderer event={event} />
            </Box>
          </Collapse>
        </Box>
      </Box>
    </Paper>
  );
}

export default memo(CloudEventCard);