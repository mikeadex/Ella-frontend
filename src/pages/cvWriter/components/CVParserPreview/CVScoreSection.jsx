import React from 'react';
import { Box, Paper, Typography, Tooltip, LinearProgress, Divider } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const CVScoreSection = ({ cvScore, isDark, isMobile }) => {
  // Handle score as either a direct number or an object with overall_score property
  const scoreValue = typeof cvScore === 'object' ? cvScore.overall_score : cvScore;
  
  // Ensure we have a numeric value
  const numericScore = typeof scoreValue === 'number' ? scoreValue : 0;
  
  // Determine if the score is on a 0-10 scale (AI model) or 0-100 scale
  const isSmallScale = numericScore <= 10;
  
  // Normalized score for color and progress (0-100)
  const normalizedScore = isSmallScale ? numericScore * 10 : numericScore;
  
  // Display score in the original scale
  const displayScore = numericScore;
  
  return (
    <>
      {/* Overall Score */}
      <Paper elevation={0} variant="outlined" sx={{ 
        padding: '1.5rem', 
        backgroundColor: isDark ? '#0f172a' : '#f9fafb',
        borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
      }}>
        <Typography variant="h6" gutterBottom color={isDark ? '#f1f5f9' : 'inherit'}>Overall Score</Typography>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'stretch' : 'center',
          justifyContent: 'space-between'
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            mb: isMobile ? 2 : 0
          }}>
            <Typography 
              variant="h4" 
              color={(() => {
                if (normalizedScore >= 80) return isDark ? '#10b981' : '#059669';
                if (normalizedScore >= 60) return isDark ? '#f59e0b' : '#d97706';
                return isDark ? '#ef4444' : '#dc2626';
              })()}
              sx={{ fontWeight: 'bold' }}
            >
              {displayScore}{isSmallScale ? '/10' : '%'}
            </Typography>
            <Tooltip 
              title="Your CV score is calculated based on content quality, formatting, completeness, and relevance."
              placement="top"
            >
              <InfoOutlinedIcon sx={{ 
                color: isDark ? '#94a3b8' : '#9ca3af',
                fontSize: '1rem',
                cursor: 'help'
              }} />
            </Tooltip>
          </Box>
          
          <Box sx={{ 
            width: isMobile ? '100%' : '60%'
          }}>
            <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
              <Typography 
                variant="body2" 
                color={isDark ? '#94a3b8' : '#6b7280'}
              >
                Needs Work
              </Typography>
              <Typography 
                variant="body2" 
                color={isDark ? '#94a3b8' : '#6b7280'}
              >
                Excellent
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={normalizedScore} 
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  background: (() => {
                    if (normalizedScore >= 80) return isDark ? 'linear-gradient(90deg, #059669, #10b981)' : 'linear-gradient(90deg, #059669, #10b981)';
                    if (normalizedScore >= 60) return isDark ? 'linear-gradient(90deg, #d97706, #f59e0b)' : 'linear-gradient(90deg, #d97706, #f59e0b)';
                    return isDark ? 'linear-gradient(90deg, #dc2626, #ef4444)' : 'linear-gradient(90deg, #dc2626, #ef4444)';
                  })()
                }
              }}
            />
          </Box>
        </Box>
      </Paper>
      
      {/* Section Scores */}
      {cvScore.section_scores && Object.keys(cvScore.section_scores).length > 0 && (
        <Paper elevation={0} variant="outlined" sx={{ 
          padding: '1.5rem', 
          backgroundColor: isDark ? '#0f172a' : '#f9fafb',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        }}>
          <Typography variant="h6" gutterBottom color={isDark ? '#f1f5f9' : 'inherit'}>Section Scores</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {Object.entries(cvScore.section_scores).map(([section, score], index) => (
              <Box key={index}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      textTransform: 'capitalize', 
                      color: isDark ? '#cbd5e1' : 'inherit',
                      fontWeight: 'medium'
                    }}
                  >
                    {section.replace(/_/g, ' ')}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    fontWeight="medium" 
                    sx={{ 
                      width: '1.5rem', 
                      textAlign: 'center',
                      color: isDark ? '#f1f5f9' : 'inherit'
                    }}
                  >
                    {score}
                  </Typography>
                </Box>
                
                <LinearProgress
                  variant="determinate"
                  value={score}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 3,
                      background: (() => {
                        if (score >= 80) return isDark ? '#10b981' : '#10b981';
                        if (score >= 60) return isDark ? '#f59e0b' : '#f59e0b';
                        return isDark ? '#ef4444' : '#ef4444';
                      })()
                    }
                  }}
                />
              </Box>
            ))}
          </Box>
        </Paper>
      )}
      
      {/* Strengths & Weaknesses */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: '1rem' }}>
        {/* Strengths */}
        {cvScore.strengths && cvScore.strengths.length > 0 && (
          <Paper elevation={0} variant="outlined" sx={{ 
            padding: '1rem', 
            backgroundColor: isDark ? '#0f172a' : '#f9fafb',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
          }}>
            <Typography variant="h6" gutterBottom sx={{ color: isDark ? '#10b981' : '#15803d' }}>Strengths</Typography>
            <Box component="ul" sx={{ 
              margin: 0,
              paddingLeft: '1.5rem',
              color: isDark ? '#cbd5e1' : 'inherit' 
            }}>
              {cvScore.strengths.map((strength, i) => (
                <Box component="li" key={i} sx={{ mb: 1 }}>
                  {strength}
                </Box>
              ))}
            </Box>
          </Paper>
        )}
        
        {/* Weaknesses */}
        {cvScore.weaknesses && cvScore.weaknesses.length > 0 && (
          <Paper elevation={0} variant="outlined" sx={{ 
            padding: '1rem', 
            backgroundColor: isDark ? '#0f172a' : '#f9fafb',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
          }}>
            <Typography variant="h6" gutterBottom sx={{ color: isDark ? '#f87171' : '#b91c1c' }}>Weaknesses</Typography>
            <Box component="ul" sx={{ 
              margin: 0,
              paddingLeft: '1.5rem',
              color: isDark ? '#cbd5e1' : 'inherit'
            }}>
              {cvScore.weaknesses.map((weakness, i) => (
                <Box component="li" key={i} sx={{ mb: 1 }}>
                  {weakness}
                </Box>
              ))}
            </Box>
          </Paper>
        )}
      </Box>
      
      {/* Improvement Suggestions */}
      {cvScore.improvement_suggestions && cvScore.improvement_suggestions.length > 0 && (
        <Paper elevation={0} variant="outlined" sx={{ 
          padding: '1rem', 
          backgroundColor: isDark ? '#0f172a' : '#f9fafb',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        }}>
          <Typography variant="h6" gutterBottom sx={{ color: isDark ? '#fbbf24' : '#a16207' }}>Improvement Suggestions</Typography>
          <Box component="ul" sx={{ 
            margin: 0,
            paddingLeft: '1.5rem',
            color: isDark ? '#cbd5e1' : 'inherit'
          }}>
            {cvScore.improvement_suggestions.map((suggestion, i) => (
              <Box component="li" key={i} sx={{ mb: 1 }}>
                {suggestion}
              </Box>
            ))}
          </Box>
        </Paper>
      )}
    </>
  );
};

export default CVScoreSection;
