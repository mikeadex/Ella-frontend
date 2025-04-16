import React from 'react';
import { Box, Typography, Paper, LinearProgress, useMediaQuery, useTheme } from '@mui/material';

const ExperienceLevel = ({ experienceLevel, getLevelColor, isDark }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Extract years value and handle multiple property names, parsing strings if needed
  const getYearsValue = () => {
    if (!experienceLevel) return 0;
    
    // Check for all possible property names
    const yearsValue = experienceLevel.years_experience || 
                       experienceLevel.years_of_experience || 
                       experienceLevel.years;
    
    // Handle case where value might be a string like "12"
    if (yearsValue === undefined || yearsValue === null) return 0;
    if (typeof yearsValue === 'number') return yearsValue;
    if (typeof yearsValue === 'string') {
      const parsed = parseInt(yearsValue, 10);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  const yearsValue = getYearsValue();
  const level = experienceLevel?.level || '';
  const description = experienceLevel?.description || '';
  
  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 3 }}>
        {/* Years of Experience */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            Years of Experience
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 2
          }}>
            <Box sx={{ 
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.1)',
              borderWidth: '2px',
              borderStyle: 'solid',
              borderColor: isDark ? '#3b82f6' : '#2563eb',
              boxShadow: '0 0 10px rgba(59, 130, 246, 0.3)',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: isDark ? '#60a5fa' : '#2563eb'
            }}>
              {yearsValue}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  mb: 0.5, 
                  fontWeight: 500,
                  color: isDark ? '#e2e8f0' : '#334155' 
                }}
              >
                {yearsValue < 2 ? 'Early Career' : 
                 yearsValue < 5 ? 'Mid-Level' : 
                 yearsValue < 10 ? 'Senior Level' : 'Expert Level'}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={Math.min(100, (yearsValue / 15) * 100)} 
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  backgroundColor: isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: isDark ? '#3b82f6' : '#2563eb',
                    borderRadius: 4
                  }
                }} 
              />
            </Box>
          </Box>
        </Box>
        
        {/* Experience Level Classification */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            Experience Classification
          </Typography>
          <Box sx={{ 
            border: '1px solid',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            padding: 2,
            backgroundColor: isDark ? 'rgba(15, 23, 42, 0.3)' : 'rgba(248, 250, 252, 0.8)'
          }}>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 1,
                fontWeight: 600,
                fontSize: '1.1rem',
                color: level && getLevelColor ? getLevelColor(experienceLevel.level_score || 5) : (isDark ? '#e2e8f0' : '#334155')
              }}
            >
              {level}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: isDark ? '#cbd5e1' : '#64748b',
                lineHeight: 1.6
              }}
            >
              {description}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ExperienceLevel;
