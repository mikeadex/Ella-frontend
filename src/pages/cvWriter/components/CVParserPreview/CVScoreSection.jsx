import React from 'react';
import { Box, Typography, Tooltip, LinearProgress, Grid, useTheme, useMediaQuery } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const CVScoreSection = ({ overallScore, sectionScores, analysisData, isDark }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Ensure we have a numeric value
  const numericScore = typeof overallScore === 'number' ? overallScore : 0;
  
  // Determine if the score is on a 0-10 scale (AI model) or 0-100 scale
  const isSmallScale = numericScore <= 10;
  
  // Normalized score for color and progress (0-100)
  const normalizedScore = isSmallScale ? numericScore * 10 : numericScore;
  
  // Get color based on score
  const getScoreColor = (score) => {
    const normalized = score <= 10 ? score * 10 : score;
    if (normalized >= 80) return isDark ? '#10b981' : '#059669';
    if (normalized >= 60) return isDark ? '#f59e0b' : '#d97706';
    return isDark ? '#ef4444' : '#dc2626';
  };
  
  return (
    <Box>
      {/* Overall Score */}
      <Box sx={{ 
        mb: 3, 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        <Typography variant="subtitle2" sx={{ 
          fontWeight: 700, 
          mb: 2,
          color: isDark ? '#e2e8f0' : '#1e293b',
          fontSize: '0.95rem'
        }}>
          Overall CV Score
        </Typography>
        
        <Box sx={{ 
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '160px',
          height: '160px',
          mb: 2
        }}>
          {/* Circular background */}
          <Box sx={{ 
            position: 'absolute',
            width: '160px',
            height: '160px',
            borderRadius: '50%',
            background: `conic-gradient(
              ${getScoreColor(numericScore)} ${normalizedScore}%, 
              ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'} ${normalizedScore}% 100%
            )`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: isDark 
              ? `0 0 15px 0px ${getScoreColor(numericScore)}40` 
              : `0 0 15px 0px ${getScoreColor(numericScore)}20`
          }} />
          
          {/* White/Dark circle in the middle */}
          <Box sx={{ 
            position: 'absolute',
            width: '130px',
            height: '130px',
            borderRadius: '50%',
            backgroundColor: isDark ? 'rgba(15, 23, 42, 0.7)' : 'white',
            border: `2px solid ${isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            boxShadow: isDark ? '0 4px 6px rgba(0, 0, 0, 0.2)' : '0 4px 6px rgba(0, 0, 0, 0.05)'
          }}>
            <Typography variant="h3" component="div" sx={{ 
              fontWeight: 700,
              color: getScoreColor(numericScore),
              textShadow: `0 0 4px ${getScoreColor(numericScore)}50`,
              fontSize: '3rem',
              mb: 0
            }}>
              {isSmallScale ? numericScore.toFixed(1) : Math.round(numericScore)}
            </Typography>
            <Typography variant="caption" sx={{ 
              fontSize: '0.75rem',
              color: isDark ? '#94a3b8' : '#64748b',
              fontWeight: 500
            }}>
              {isSmallScale ? 'out of 10' : 'out of 100'}
            </Typography>
          </Box>
        </Box>
        
        <Typography variant="body2" sx={{ 
          color: getScoreColor(numericScore),
          fontWeight: 600,
          mb: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 0.5
        }}>
          {normalizedScore >= 80 && 'Excellent'}
          {normalizedScore >= 60 && normalizedScore < 80 && 'Good'}
          {normalizedScore >= 40 && normalizedScore < 60 && 'Average'}
          {normalizedScore < 40 && 'Needs Improvement'}
          
          <Tooltip title="This score represents the overall quality of your CV based on content, structure, and relevance to industry standards" arrow>
            <InfoOutlinedIcon sx={{ fontSize: '0.85rem', ml: 0.5, cursor: 'pointer', opacity: 0.7 }} />
          </Tooltip>
        </Typography>
      </Box>
      
      {/* Section Scores */}
      {sectionScores && Object.keys(sectionScores).length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom sx={{ 
            fontWeight: 700, 
            mb: 2,
            color: isDark ? '#e2e8f0' : '#1e293b',
            fontSize: '0.9rem',
            textAlign: 'center'
          }}>
            Section Scores
          </Typography>
          
          <Grid container spacing={1}>
            {Object.entries(sectionScores).map(([section, score]) => {
              // Skip any non-numeric or null scores
              if (typeof score !== 'number' || score === null) return null;
              
              // Format the section name
              const formattedSection = section
                .replace(/_/g, ' ')
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
              
              // Normalize score if needed
              const normalizedSectionScore = score <= 10 ? score * 10 : score;
              
              return (
                <Grid item xs={12} key={section}>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5, alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ 
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        color: isDark ? '#e2e8f0' : '#334155'
                      }}>
                        {formattedSection}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        fontWeight: 700,
                        color: getScoreColor(score),
                        fontSize: '0.85rem'
                      }}>
                        {score <= 10 ? score.toFixed(1) : Math.round(score)}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ position: 'relative', height: '6px' }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={normalizedSectionScore} 
                        sx={{ 
                          height: '6px',
                          borderRadius: '3px',
                          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                          '.MuiLinearProgress-bar': {
                            backgroundColor: getScoreColor(score),
                            borderRadius: '3px'
                          }
                        }} 
                      />
                    </Box>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      )}
      
      {/* Improvement Suggestions */}
      {sectionScores.improvementSuggestions && sectionScores.improvementSuggestions.length > 0 && (
        <Box elevation={0} variant="outlined" sx={{ 
          padding: '1rem', 
          backgroundColor: isDark ? '#0f172a' : '#f9fafb',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          mt: 2
        }}>
          <Typography variant="h6" gutterBottom sx={{ color: isDark ? '#fbbf24' : '#a16207' }}>Improvement Suggestions</Typography>
          <Box component="ul" sx={{ 
            margin: 0,
            paddingLeft: '1.5rem',
            color: isDark ? '#cbd5e1' : 'inherit'
          }}>
            {sectionScores.improvementSuggestions.map((suggestion, i) => (
              <Box component="li" key={i} sx={{ mb: 1 }}>
                {suggestion}
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default CVScoreSection;
