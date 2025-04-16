import React from 'react';
import { Box, Typography, Stack, useTheme, useMediaQuery, Paper } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const EmploymentGaps = ({ gaps, isDark }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  if (!gaps) {
    return null;
  }
  
  // Normalize the data structure - handle both array and object formats
  const gapsList = Array.isArray(gaps) ? gaps : (gaps.gaps || []);
  const summary = Array.isArray(gaps) ? null : gaps.summary;
  
  // Helper function to get color based on gap duration
  const getDotColor = (months) => {
    if (months > 12) return isDark ? '#ef4444' : '#dc2626'; // Red for long gaps
    if (months > 6) return isDark ? '#f59e0b' : '#d97706';  // Orange for medium gaps
    return isDark ? '#10b981' : '#059669';                  // Green for short gaps
  };

  // If no data available, return a message
  if (gapsList.length === 0 && !summary) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body1" sx={{ color: isDark ? '#cbd5e1' : '#475569' }}>
          No employment gaps were detected in your CV.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Summary */}
      {summary && (
        <Box sx={{ mb: 3, p: 2, borderRadius: '0.5rem', backgroundColor: isDark ? 'rgba(15, 23, 42, 0.3)' : 'rgba(241, 245, 249, 0.7)' }}>
          <Typography variant="body1" sx={{ color: isDark ? '#cbd5e1' : '#334155', fontWeight: 500 }}>
            {summary}
          </Typography>
        </Box>
      )}
      
      {/* Custom Timeline for employment gaps */}
      {gapsList.length > 0 && (
        <Stack spacing={3} sx={{ position: 'relative' }}>
          {/* Vertical line connecting timeline items */}
          <Box sx={{ 
            position: 'absolute', 
            left: '12px', 
            top: '24px', 
            bottom: '24px', 
            width: '2px', 
            backgroundColor: isDark ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)' 
          }} />
          
          {gapsList.map((gap, index) => (
            <Box key={index} sx={{ display: 'flex', position: 'relative' }}>
              {/* Timeline dot */}
              <FiberManualRecordIcon 
                sx={{ 
                  fontSize: '24px', 
                  color: getDotColor(gap.duration_months || 0),
                  marginRight: 2,
                  position: 'relative',
                  zIndex: 1,
                  filter: `drop-shadow(0 0 3px ${getDotColor(gap.duration_months || 0)}80)`
                }} 
              />
              
              {/* Gap information */}
              <Box sx={{ flex: 1 }}>
                <Box sx={{
                  p: 2,
                  borderRadius: '0.75rem',
                  backgroundColor: isDark ? 'rgba(15, 23, 42, 0.4)' : 'white',
                  boxShadow: isDark 
                    ? '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)' 
                    : '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                  border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)'}`
                }}>
                  {/* Period */}
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: 700, 
                      mb: 1,
                      fontSize: '0.95rem',
                      color: isDark ? '#e2e8f0' : '#1e293b' 
                    }}
                  >
                    {gap.start_date && gap.end_date ? (
                      `${gap.start_date} to ${gap.end_date}`
                    ) : (
                      `Employment Gap #${index + 1}`
                    )}
                  </Typography>
                  
                  {/* Duration */}
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      display: 'inline-block',
                      mb: 1.5,
                      px: 1.5,
                      py: 0.5,
                      borderRadius: '4px',
                      fontWeight: 600,
                      backgroundColor: isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.05)',
                      color: getDotColor(gap.duration_months || 0)
                    }}
                  >
                    {gap.duration ? (
                      gap.duration
                    ) : (
                      gap.duration_months ? (
                        `${gap.duration_months} month${gap.duration_months === 1 ? '' : 's'}`
                      ) : (
                        'Duration unknown'
                      )
                    )}
                  </Typography>
                  
                  {/* Description */}
                  {gap.description && (
                    <Typography variant="body2" sx={{ 
                      color: isDark ? '#cbd5e1' : '#475569',
                      whiteSpace: 'pre-wrap'
                    }}>
                      {gap.description}
                    </Typography>
                  )}
                  
                  {/* Recommendations */}
                  {gap.recommendations && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" sx={{ 
                        fontWeight: 600, 
                        mb: 1,
                        color: isDark ? '#60a5fa' : '#3b82f6'
                      }}>
                        Recommendations
                      </Typography>
                      <Box component="ul" sx={{ 
                        pl: 2, 
                        m: 0,
                        '& li': {
                          mb: 1,
                          color: isDark ? '#cbd5e1' : '#475569'
                        } 
                      }}>
                        {Array.isArray(gap.recommendations) ? (
                          gap.recommendations.map((rec, i) => (
                            <Box component="li" key={i}>{rec}</Box>
                          ))
                        ) : (
                          <Box component="li">{gap.recommendations}</Box>
                        )}
                      </Box>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default EmploymentGaps;
