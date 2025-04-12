import React from 'react';
import { Box, Typography, Paper, LinearProgress } from '@mui/material';

const ExperienceLevel = ({ experienceLevel, isDark, isMobile }) => {
  // Extract years value and handle multiple property names, parsing strings if needed
  const getYearsValue = () => {
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
  
  return (
    <Paper elevation={0} variant="outlined" sx={{ 
      padding: '1.5rem', 
      backgroundColor: isDark ? '#0f172a' : '#f9fafb',
      borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
    }}>
      <Typography variant="h6" gutterBottom color={isDark ? '#f1f5f9' : 'inherit'}>Experience Level</Typography>
      
      <Box sx={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row'
      }}>
        {/* Years of Experience */}
        <Box sx={{ 
          flex: 1, 
          mr: isMobile ? 0 : 2,
          mb: isMobile ? 2 : 0
        }}>
          <Typography variant="subtitle1" gutterBottom color={isDark ? '#f1f5f9' : 'inherit'}>
            Years of Experience
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            borderRadius: '8px',
            backgroundColor: isDark ? 'rgba(14, 116, 144, 0.2)' : '#e0f2fe',
            p: 2
          }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontWeight: 'bold',
                color: isDark ? '#22d3ee' : '#0369a1'
              }}
            >
              {yearsValue}
            </Typography>
            <Typography variant="body1" sx={{ ml: 1, color: isDark ? '#cbd5e1' : 'text.secondary' }}>
              {yearsValue === 1 ? 'year' : 'years'}
            </Typography>
          </Box>
        </Box>
        
        {/* Career Stage */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" gutterBottom color={isDark ? '#f1f5f9' : 'inherit'}>
            Career Stage
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            backgroundColor: isDark ? 'rgba(124, 58, 237, 0.2)' : '#ede9fe',
            borderRadius: '8px',
            p: 2
          }}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 'bold',
                mb: 1,
                color: isDark ? '#a78bfa' : '#6d28d9'
              }}
              textAlign={isMobile ? 'center' : 'left'}
            >
              {experienceLevel.classification || experienceLevel.career_stage || 'Entry Level'}
            </Typography>
            <Typography variant="body2" sx={{ color: isDark ? '#cbd5e1' : 'text.secondary' }}>
              {experienceLevel.stage_description || experienceLevel.career_stage || 'Starting your professional journey with foundational skills and knowledge.'}
            </Typography>
          </Box>
        </Box>
      </Box>
      
      {/* Industry Expertise */}
      {experienceLevel.industry_expertise && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom color={isDark ? '#f1f5f9' : 'inherit'}>
            Industry Expertise
          </Typography>
          <Box sx={{ mt: 1 }}>
            {Object.entries(experienceLevel.industry_expertise).map(([industry, level], index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" color={isDark ? '#cbd5e1' : 'text.secondary'}>
                    {industry}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    fontWeight="medium" 
                    sx={{ color: (() => {
                      if (level >= 80) return isDark ? '#10b981' : '#059669';
                      if (level >= 60) return isDark ? '#f59e0b' : '#d97706';
                      return isDark ? '#ef4444' : '#dc2626';
                    })() }}
                  >
                    {level}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate"
                  value={level}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 3,
                      backgroundColor: (() => {
                        if (level >= 80) return isDark ? '#10b981' : '#059669';
                        if (level >= 60) return isDark ? '#f59e0b' : '#d97706';
                        return isDark ? '#ef4444' : '#dc2626';
                      })()
                    }
                  }}
                />
              </Box>
            ))}
          </Box>
        </Box>
      )}
      
      {/* Career Trajectory */}
      {experienceLevel.career_trajectory && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom color={isDark ? '#f1f5f9' : 'inherit'}>
            Career Trajectory
          </Typography>
          <Typography variant="body2" sx={{ color: isDark ? '#cbd5e1' : 'text.secondary' }}>
            {experienceLevel.career_trajectory}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default ExperienceLevel;
