import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

const SkillsAssessment = ({ skillsAssessment, isDark, getLevelColor, getSkillLevel }) => {
  return (
    <Paper elevation={0} variant="outlined" sx={{ 
      padding: '1.5rem', 
      backgroundColor: isDark ? '#0f172a' : '#f9fafb',
      borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
    }}>
      <Typography variant="h6" gutterBottom sx={{ 
        color: isDark ? '#f1f5f9' : 'inherit',
        mb: 2 
      }}>Skills Assessment</Typography>
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: {
          xs: '1fr',
          sm: '1fr 1fr'
        }, 
        gap: '2.5rem'
      }}>
        {/* Technical Skills */}
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography 
            variant="subtitle1" 
            gutterBottom 
            color={isDark ? '#f1f5f9' : 'inherit'} 
            sx={{ 
              mb: 2,
              fontWeight: 'medium'
            }}
          >
            Technical Skills
          </Typography>
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            {skillsAssessment.technical_skills.map((skill, i) => (
              <Box key={i} sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
                paddingBottom: '0.5rem'
              }}>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    textTransform: 'capitalize',
                    color: isDark ? '#cbd5e1' : 'inherit',
                    fontWeight: 'medium'
                  }}
                >
                  {skill.name || skill.skill}
                </Typography>
                <Box sx={{
                  backgroundColor: getLevelColor(skill.rating || skill.level, isDark),
                  borderRadius: '9999px',
                  px: 1.5,
                  py: 0.5,
                  fontSize: '0.75rem',
                  fontWeight: 'medium',
                  color: 'white',
                  textTransform: 'capitalize'
                }}>
                  {getSkillLevel(skill.rating || skill.level)}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
        
        {/* Soft Skills */}
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography 
            variant="subtitle1" 
            gutterBottom 
            color={isDark ? '#f1f5f9' : 'inherit'} 
            sx={{ 
              mb: 2,
              fontWeight: 'medium'
            }}
          >
            Soft Skills
          </Typography>
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            {skillsAssessment.soft_skills.map((skill, i) => (
              <Box key={i} sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
                paddingBottom: '0.5rem'
              }}>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    textTransform: 'capitalize',
                    color: isDark ? '#cbd5e1' : 'inherit',
                    fontWeight: 'medium'
                  }}
                >
                  {skill.name || skill.skill}
                </Typography>
                <Box sx={{
                  backgroundColor: getLevelColor(skill.rating || skill.level, isDark),
                  borderRadius: '9999px',
                  px: 1.5,
                  py: 0.5,
                  fontSize: '0.75rem',
                  fontWeight: 'medium',
                  color: 'white',
                  textTransform: 'capitalize'
                }}>
                  {getSkillLevel(skill.rating || skill.level)}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default SkillsAssessment;
