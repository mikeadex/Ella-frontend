import React from 'react';
import { Box, Paper, Typography, Divider, Stack } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const EmploymentGaps = ({ gapsAnalysis, isDark, isMobile }) => {
  if (!gapsAnalysis || (!gapsAnalysis.gaps?.length && !gapsAnalysis.summary)) {
    return null;
  }

  return (
    <Paper elevation={0} variant="outlined" sx={{ 
      padding: '1.5rem', 
      backgroundColor: isDark ? '#0f172a' : '#f9fafb',
      borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
    }}>
      <Typography variant="h6" gutterBottom color={isDark ? '#f1f5f9' : 'inherit'}>
        Employment Gaps Analysis
      </Typography>
      
      {/* Summary */}
      {gapsAnalysis.summary && (
        <Box sx={{ mb: 2, p: 2, borderRadius: '0.5rem', backgroundColor: isDark ? 'rgba(30, 41, 59, 0.5)' : '#f1f5f9' }}>
          <Typography variant="body1" color={isDark ? '#cbd5e1' : 'text.secondary'}>
            {gapsAnalysis.summary}
          </Typography>
        </Box>
      )}
      
      {/* Custom Timeline for employment gaps */}
      {gapsAnalysis.gaps && gapsAnalysis.gaps.length > 0 && (
        <Stack spacing={2} sx={{ mt: 3, position: 'relative' }}>
          {/* Vertical line connecting timeline items */}
          <Box sx={{ 
            position: 'absolute', 
            left: '12px', 
            top: '24px', 
            bottom: '24px', 
            width: '2px', 
            backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' 
          }} />
          
          {gapsAnalysis.gaps.map((gap, index) => {
            // Choose dot color based on gap duration
            const getDotColor = () => {
              const months = gap.duration_months || 0;
              if (months > 12) return isDark ? '#ef4444' : '#dc2626';  // Red for long gaps
              if (months > 6) return isDark ? '#f59e0b' : '#d97706';   // Orange for medium gaps
              return isDark ? '#10b981' : '#059669';                   // Green for short gaps
            };
            
            return (
              <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start' }}>
                {/* Timeline dot indicator */}
                <Box sx={{ 
                  mr: 2, 
                  display: 'flex', 
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  zIndex: 1
                }}>
                  <FiberManualRecordIcon sx={{ 
                    color: getDotColor(),
                    fontSize: '16px'
                  }} />
                </Box>
                
                {/* Timeline content */}
                <Box sx={{ 
                  flex: 1, 
                  p: 2, 
                  backgroundColor: isDark ? 'rgba(51, 65, 85, 0.3)' : '#fff',
                  borderRadius: '0.5rem',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                }}>
                  <Typography variant="subtitle2" component="div" fontWeight="medium">
                    {gap.period || `${gap.start_date} - ${gap.end_date}`}
                  </Typography>
                  <Typography variant="body2" color={isDark ? '#cbd5e1' : 'text.secondary'}>
                    {gap.duration_months && (
                      <span>{gap.duration_months} month{gap.duration_months !== 1 ? 's' : ''}</span>
                    )}
                    {gap.duration_years && (
                      <span> ({gap.duration_years} year{gap.duration_years !== 1 ? 's' : ''})</span>
                    )}
                  </Typography>
                  {gap.explanation && (
                    <Typography variant="body2" sx={{ mt: 1, color: isDark ? '#e2e8f0' : 'text.primary' }}>
                      {gap.explanation}
                    </Typography>
                  )}
                  {gap.recommendation && (
                    <Box sx={{ 
                      mt: 1.5,
                      p: 1.5, 
                      borderRadius: '0.25rem',
                      backgroundColor: isDark ? 'rgba(14, 116, 144, 0.15)' : '#e0f7fa',
                      borderLeft: `4px solid ${isDark ? '#06b6d4' : '#0097a7'}`
                    }}>
                      <Typography variant="body2" sx={{ color: isDark ? '#a5f3fc' : '#00838f' }}>
                        <strong>Recommendation:</strong> {gap.recommendation}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            );
          })}
        </Stack>
      )}
      
      {/* Impact statement */}
      {gapsAnalysis.impact && (
        <Box sx={{ 
          mt: 3, 
          p: 2, 
          borderRadius: '0.5rem',
          backgroundColor: isDark ? 'rgba(30, 58, 138, 0.2)' : '#e0f2fe',
          borderLeft: `4px solid ${isDark ? '#3b82f6' : '#2563eb'}`
        }}>
          <Typography variant="subtitle2" color={isDark ? '#93c5fd' : '#1d4ed8'} fontWeight="bold" gutterBottom>
            Impact on Career Progression
          </Typography>
          <Typography variant="body2" color={isDark ? '#bfdbfe' : '#1e40af'}>
            {gapsAnalysis.impact}
          </Typography>
        </Box>
      )}
      
      {/* Tips for addressing gaps */}
      {gapsAnalysis.addressing_tips && gapsAnalysis.addressing_tips.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" color={isDark ? '#f1f5f9' : 'inherit'} fontWeight="bold" gutterBottom>
            Tips for Addressing Gaps
          </Typography>
          <Box component="ul" sx={{ pl: 3, mt: 1, '& li': { mb: 1 } }}>
            {gapsAnalysis.addressing_tips.map((tip, index) => (
              <Typography component="li" key={index} variant="body2" color={isDark ? '#cbd5e1' : 'text.secondary'}>
                {tip}
              </Typography>
            ))}
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default EmploymentGaps;
