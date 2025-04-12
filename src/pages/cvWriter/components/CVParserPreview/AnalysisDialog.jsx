import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Typography, Box, Paper, CircularProgress, Chip, Divider, Tooltip, useTheme as useMuiTheme, Button, Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { BriefcaseIcon, DocumentChartBarIcon, ChartBarIcon, MagnifyingGlassIcon, LightBulbIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../../../../context/ThemeContext';
import AnalysisStages from './AnalysisStages';
import ExperienceLevel from './ExperienceLevel';
import SkillsAssessment from './SkillsAssessment';
import PotentialRoles from './PotentialRoles';
import CVScoreSection from './CVScoreSection';
import EmploymentGaps from './EmploymentGaps';

const AnalysisDialog = ({ 
  open, 
  onClose, 
  analysisData, 
  analysisLoading, 
  analysisError, 
  analysisProgress, 
  analysisStages,
  isMobile,
  getLevelColor,
  getSkillLevel 
}) => {
  const { isDark } = useTheme();
  const muiTheme = useMuiTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          backgroundColor: isDark ? '#1e293b' : 'white',
          backgroundImage: 'none',
          borderRadius: isMobile ? 0 : '0.5rem',
          width: '100%'
        }
      }}
    >
      <DialogTitle 
        component="div"
        sx={{ 
          backgroundColor: isDark ? '#1e293b' : 'white',
          color: isDark ? '#e2e8f0' : 'inherit',
          p: 2,
          borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            CV Analysis
          </Typography>
          <IconButton 
            onClick={onClose}
            sx={{ color: isDark ? '#e2e8f0' : 'inherit' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography variant="subtitle2" color={isDark ? 'rgba(226, 232, 240, 0.7)' : 'text.secondary'}>
          AI-powered analysis of your CV
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ 
        backgroundColor: isDark ? '#1e293b' : 'white',
        color: isDark ? '#e2e8f0' : 'inherit',
        maxHeight: isMobile ? 'none' : '80vh',
        p: 0
      }}>
        {analysisLoading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 4, px: 2 }}>
            {/* Loading Animation */}
            <Box sx={{ width: '100%', maxWidth: 500, mx: 'auto', mb: 4 }}>
              {/* Document Flying Animation */}
              <Box sx={{ 
                position: 'relative',
                height: '80px',
                width: '100%',
                mb: 3,
                overflow: 'hidden'
              }}>
                <Box sx={{
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '60px',
                  height: '60px',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  animation: 'flyingDocument 3s infinite ease-in-out',
                  '& svg': {
                    fontSize: '2.5rem',
                    color: isDark ? '#10b981' : '#10b981'
                  },
                  '@keyframes flyingDocument': {
                    '0%': { transform: 'translate(-120%, -50%)', opacity: 0 },
                    '20%': { transform: 'translate(-50%, -50%)', opacity: 1 },
                    '80%': { transform: 'translate(-50%, -50%)', opacity: 1 },
                    '100%': { transform: 'translate(120%, -50%)', opacity: 0 }
                  }
                }}>
                  {analysisStages.find(s => s.active)?.icon ? (
                    React.createElement(
                      analysisStages.find(s => s.active)?.icon, 
                      { style: { width: '2.5rem', height: '2.5rem' } }
                    )
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <line x1="10" y1="9" x2="8" y2="9" />
                    </svg>
                  )}
                </Box>
              </Box>
              
              {/* Progress Indicator */}
              <Box sx={{ position: 'relative', mb: 3 }}>
                <Box sx={{ 
                  height: '0.5rem', 
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb',
                  borderRadius: '9999px',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <Box sx={{ 
                    height: '100%',
                    width: `${analysisProgress}%`,
                    background: isDark ? 'linear-gradient(90deg, #10b981, #34d399)' : 'linear-gradient(90deg, #10b981, #34d399)',
                    borderRadius: '9999px',
                    position: 'relative',
                    transition: 'width 0.3s ease',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      bottom: 0,
                      width: '100%',
                      background: isDark ? 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)' : 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent)',
                      animation: 'shimmer 1.5s infinite',
                      '@keyframes shimmer': {
                        '0%': { transform: 'translateX(-100%)' },
                        '100%': { transform: 'translateX(100%)' }
                      }
                    }
                  }} />
                  <Typography 
                    sx={{ 
                      position: 'absolute', 
                      right: 0, 
                      top: '-1.5rem', 
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: isDark ? '#10b981' : '#10b981'
                    }}
                  >
                    {analysisProgress}%
                  </Typography>
                </Box>
              </Box>
              
              {/* Animated Dots */}
              <Box sx={{ 
                textAlign: 'center',
                mt: 3
              }}>
                {Array.isArray([0, 1, 2, 3, 4]) && [0, 1, 2, 3, 4].length > 0 ? (
                  [0, 1, 2, 3, 4].map((i, index) => (
                    <Box 
                      key={index}
                      component="span" 
                      sx={{ 
                        width: '8px',
                        height: '8px',
                        mx: 0.5,
                        borderRadius: '50%',
                        backgroundColor: isDark ? '#10b981' : '#10b981',
                        display: 'inline-block',
                        animation: 'bounce 1.5s infinite ease-in-out',
                        animationDelay: `${i * 0.2}s`,
                        '@keyframes bounce': {
                          '0%': { transform: 'translateY(0)' },
                          '50%': { transform: 'translateY(-10px)' }
                        }
                      }}
                    />
                  ))
                ) : null}
              </Box>
            </Box>
            
            {/* Analysis Stages Progress */}
            <AnalysisStages stages={analysisStages} isDark={isDark} />
          </Box>
        ) : analysisError ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="error" gutterBottom>
              Analysis Error
            </Typography>
            <Typography color={isDark ? '#f1f5f9' : 'text.secondary'}>
              {analysisError}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ p: 0 }}>
            {analysisData && (
              <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* CV Score */}
                {analysisData.hasOwnProperty('overall_score') && (
                  <CVScoreSection 
                    cvScore={analysisData.overall_score} 
                    isDark={isDark} 
                    isMobile={isMobile} 
                  />
                )}
                
                {/* Section Scores */}
                {analysisData.section_scores && (
                  <Box sx={{ 
                    mb: 3, 
                    p: 3, 
                    borderRadius: '0.5rem',
                    backgroundColor: isDark ? 'rgba(30, 41, 59, 0.5)' : '#f8fafc',
                    border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                  }}>
                    <Typography variant="h6" fontWeight="600" color={isDark ? '#f1f5f9' : 'inherit'} gutterBottom>
                      Section Scores
                    </Typography>
                    <Box sx={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
                      gap: 2,
                      mt: 2 
                    }}>
                      {Object.entries(analysisData.section_scores).map(([key, score]) => (
                        <Box 
                          key={key}
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            p: 2,
                            borderRadius: '0.375rem',
                            backgroundColor: isDark ? 'rgba(51, 65, 85, 0.5)' : 'white',
                            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{
                              textTransform: 'capitalize',
                              textAlign: 'center',
                              fontSize: '0.75rem',
                              color: isDark ? '#94a3b8' : 'text.secondary',
                              mb: 1
                            }}
                          >
                            {key.replace(/_/g, ' ')}
                          </Typography>
                          <Box
                            sx={{
                              width: '3rem',
                              height: '3rem',
                              borderRadius: '9999px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: getLevelColor(score, isDark),
                              color: 'white',
                              fontWeight: 'bold',
                              fontSize: '1.25rem',
                              mb: 1
                            }}
                          >
                            {score}
                          </Box>
                          <Typography
                            variant="caption"
                            sx={{
                              textAlign: 'center',
                              color: isDark ? '#cbd5e1' : 'text.secondary'
                            }}
                          >
                            {getSkillLevel(score)}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
                
                {/* Strengths & Weaknesses */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  {/* Strengths */}
                  <Grid item xs={12} md={6}>
                    <Box sx={{ 
                      height: '100%',
                      p: 3, 
                      borderRadius: '0.5rem',
                      backgroundColor: isDark ? 'rgba(20, 83, 45, 0.25)' : 'rgba(240, 253, 244, 0.8)',
                      border: `1px solid ${isDark ? 'rgba(20, 83, 45, 0.5)' : 'rgba(20, 83, 45, 0.2)'}`,
                    }}>
                      <Typography variant="h6" fontWeight="600" color={isDark ? '#4ade80' : '#16a34a'} gutterBottom>
                        Strengths
                      </Typography>
                      {analysisData.strengths && analysisData.strengths.length > 0 ? (
                        <Box component="ul" sx={{ pl: 3, mt: 1, '& li': { mb: 1 } }}>
                          {analysisData.strengths.map((strength, index) => (
                            <Typography component="li" key={index} variant="body2" color={isDark ? '#bbf7d0' : '#166534'}>
                              {strength}
                            </Typography>
                          ))}
                        </Box>
                      ) : (
                        <Typography variant="body2" color={isDark ? '#bbf7d0' : '#166534'}>
                          No strengths identified.
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                  
                  {/* Weaknesses */}
                  <Grid item xs={12} md={6}>
                    <Box sx={{ 
                      height: '100%',
                      p: 3, 
                      borderRadius: '0.5rem',
                      backgroundColor: isDark ? 'rgba(153, 27, 27, 0.25)' : 'rgba(254, 242, 242, 0.8)',
                      border: `1px solid ${isDark ? 'rgba(153, 27, 27, 0.5)' : 'rgba(153, 27, 27, 0.2)'}`,
                    }}>
                      <Typography variant="h6" fontWeight="600" color={isDark ? '#f87171' : '#dc2626'} gutterBottom>
                        Weaknesses
                      </Typography>
                      {analysisData.weaknesses && analysisData.weaknesses.length > 0 ? (
                        <Box component="ul" sx={{ pl: 3, mt: 1, '& li': { mb: 1 } }}>
                          {analysisData.weaknesses.map((weakness, index) => (
                            <Typography component="li" key={index} variant="body2" color={isDark ? '#fecaca' : '#7f1d1d'}>
                              {weakness}
                            </Typography>
                          ))}
                        </Box>
                      ) : (
                        <Typography variant="body2" color={isDark ? '#fecaca' : '#7f1d1d'}>
                          No weaknesses identified.
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                </Grid>
                
                {/* Improvement Suggestions */}
                {analysisData.improvement_suggestions && analysisData.improvement_suggestions.length > 0 && (
                  <Box sx={{ 
                    mb: 3, 
                    p: 3, 
                    borderRadius: '0.5rem',
                    backgroundColor: isDark ? 'rgba(30, 58, 138, 0.25)' : 'rgba(239, 246, 255, 0.8)',
                    border: `1px solid ${isDark ? 'rgba(30, 58, 138, 0.5)' : 'rgba(30, 58, 138, 0.2)'}`,
                  }}>
                    <Typography variant="h6" fontWeight="600" color={isDark ? '#93c5fd' : '#1d4ed8'} gutterBottom>
                      Improvement Suggestions
                    </Typography>
                    <Box component="ul" sx={{ pl: 3, mt: 1, '& li': { mb: 1 } }}>
                      {analysisData.improvement_suggestions.map((suggestion, index) => (
                        <Typography component="li" key={index} variant="body2" color={isDark ? '#bfdbfe' : '#1e3a8a'}>
                          {suggestion}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                )}
                
                {/* Experience Level */}
                {analysisData.experience_level && (
                  <ExperienceLevel 
                    experienceLevel={analysisData.experience_level} 
                    isDark={isDark} 
                    isMobile={isMobile} 
                  />
                )}
                
                {/* Skills Assessment */}
                {analysisData.skills_assessment && (
                  <SkillsAssessment 
                    skillsAssessment={analysisData.skills_assessment} 
                    isDark={isDark} 
                    getLevelColor={getLevelColor}
                    getSkillLevel={getSkillLevel}
                  />
                )}
                
                {/* ATS Readiness */}
                {analysisData.ats_readiness && (
                  <Box sx={{ 
                    mb: 3, 
                    p: 3, 
                    borderRadius: '0.5rem',
                    backgroundColor: isDark ? 'rgba(5, 46, 22, 0.3)' : 'rgba(236, 252, 243, 0.8)',
                    border: `1px solid ${isDark ? 'rgba(5, 46, 22, 0.6)' : 'rgba(5, 46, 22, 0.2)'}`,
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h6" fontWeight="600" color={isDark ? '#6ee7b7' : '#059669'} gutterBottom sx={{ mb: 0 }}>
                        ATS Readiness
                      </Typography>
                      <Box sx={{ 
                        backgroundColor: getLevelColor(analysisData.ats_readiness.score, isDark),
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        height: '2.2rem',
                        width: '2.2rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '9999px',
                      }}>
                        {analysisData.ats_readiness.score}
                      </Box>
                    </Box>
                    
                    {analysisData.ats_readiness.issues && analysisData.ats_readiness.issues.length > 0 && (
                      <>
                        <Typography variant="subtitle2" color={isDark ? '#a7f3d0' : '#065f46'} sx={{ mt: 2, mb: 1 }}>
                          Issues:
                        </Typography>
                        <Box component="ul" sx={{ pl: 3, mt: 0, '& li': { mb: 0.5 } }}>
                          {analysisData.ats_readiness.issues.map((issue, index) => (
                            <Typography component="li" key={index} variant="body2" color={isDark ? '#a7f3d0' : '#065f46'}>
                              {issue}
                            </Typography>
                          ))}
                        </Box>
                      </>
                    )}
                    
                    {analysisData.ats_readiness.suggestions && analysisData.ats_readiness.suggestions.length > 0 && (
                      <>
                        <Typography variant="subtitle2" color={isDark ? '#a7f3d0' : '#065f46'} sx={{ mt: 2, mb: 1 }}>
                          Suggestions:
                        </Typography>
                        <Box component="ul" sx={{ pl: 3, mt: 0, '& li': { mb: 0.5 } }}>
                          {analysisData.ats_readiness.suggestions.map((suggestion, index) => (
                            <Typography component="li" key={index} variant="body2" color={isDark ? '#a7f3d0' : '#065f46'}>
                              {suggestion}
                            </Typography>
                          ))}
                        </Box>
                      </>
                    )}
                  </Box>
                )}
                
                {/* Employment Gaps Analysis */}
                {analysisData.employment_gaps && (
                  <EmploymentGaps 
                    gapsAnalysis={analysisData.employment_gaps} 
                    isDark={isDark} 
                    isMobile={isMobile} 
                  />
                )}
                
                {/* Potential Matching Roles */}
                {analysisData.potential_roles && (
                  <PotentialRoles 
                    potentialRoles={analysisData.potential_roles} 
                    isDark={isDark} 
                  />
                )}
              </Box>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ 
        backgroundColor: isDark ? '#1e293b' : 'white',
        borderTop: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
        px: 2,
        py: 1.5
      }}>
        <Button
          sx={{
            backgroundColor: 'transparent',
            color: isDark ? '#e2e8f0' : 'inherit',
            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'}`,
            '&:hover': {
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'
            }
          }}
          onClick={onClose}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AnalysisDialog;
