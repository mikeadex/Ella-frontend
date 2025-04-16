import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Typography, Box, CircularProgress, Button, Grid, useTheme as useMuiTheme, useMediaQuery, Paper } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { DocumentTextIcon, CheckIcon, ArrowRightIcon, PencilIcon, DocumentChartBarIcon, SparklesIcon, TicketIcon } from '@heroicons/react/24/outline';
import RewriteStages from './RewriteStages';

// Animation pages for each stage of the rewrite process
const StageContent = ({ stage, isDark }) => {
  const getIcon = () => {
    switch (stage.id) {
      case 1:
        return <DocumentChartBarIcon style={{ width: '3rem', height: '3rem', color: isDark ? '#60a5fa' : '#3b82f6' }} />;
      case 2:
        return <PencilIcon style={{ width: '3rem', height: '3rem', color: isDark ? '#60a5fa' : '#3b82f6' }} />;
      case 3:
        return <DocumentTextIcon style={{ width: '3rem', height: '3rem', color: isDark ? '#60a5fa' : '#3b82f6' }} />;
      case 4:
        return <SparklesIcon style={{ width: '3rem', height: '3rem', color: isDark ? '#60a5fa' : '#3b82f6' }} />;
      default:
        return null;
    }
  };

  const getAnimationContent = () => {
    switch (stage.id) {
      case 1:
        return (
          <Box sx={{ mt: 3, width: '100%' }}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 2, 
                backgroundColor: isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(241, 245, 249, 0.7)',
                border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(203, 213, 225, 0.7)'}`,
                borderRadius: '0.5rem',
                maxWidth: '500px',
                mx: 'auto',
                mt: 2
              }}
            >
              {/* Animated content appearance */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <Box 
                  sx={{ 
                    width: '80%', 
                    height: 16, 
                    backgroundColor: isDark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(203, 213, 225, 0.5)', 
                    borderRadius: 1,
                    animation: 'pulse 1.5s infinite'
                  }} 
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <Box 
                  sx={{ 
                    width: '60%', 
                    height: 16, 
                    backgroundColor: isDark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(203, 213, 225, 0.5)', 
                    borderRadius: 1,
                    animation: 'pulse 1.5s infinite 0.2s'
                  }} 
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <Box 
                  sx={{ 
                    width: '70%', 
                    height: 16, 
                    backgroundColor: isDark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(203, 213, 225, 0.5)', 
                    borderRadius: 1,
                    animation: 'pulse 1.5s infinite 0.4s'
                  }} 
                />
              </Box>
            </Paper>
            <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 2, color: isDark ? '#94a3b8' : '#64748b' }}>
              Organizing CV content data...
            </Typography>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ mt: 3, width: '100%' }}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 2, 
                backgroundColor: isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(241, 245, 249, 0.7)',
                border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(203, 213, 225, 0.7)'}`,
                borderRadius: '0.5rem',
                maxWidth: '500px',
                mx: 'auto',
                mt: 2,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Document text with editing cursor effect */}
              <Box sx={{ 
                position: 'absolute', 
                right: 10, 
                top: 10, 
                width: 40, 
                height: 40, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                borderRadius: '50%',
                backgroundColor: isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(203, 213, 225, 0.3)',
              }}>
                <PencilIcon style={{ width: '1.5rem', height: '1.5rem', color: isDark ? '#94a3b8' : '#64748b' }} />
              </Box>
              <Box sx={{ mt: 1 }}>
                <Box sx={{ width: '100%', height: 14, backgroundColor: isDark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(203, 213, 225, 0.5)', borderRadius: 1, mb: 1.5 }} />
                <Box sx={{ width: '80%', height: 14, backgroundColor: isDark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(203, 213, 225, 0.5)', borderRadius: 1, mb: 1.5 }} />
                <Box sx={{ width: '90%', height: 14, backgroundColor: isDark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(203, 213, 225, 0.5)', borderRadius: 1, mb: 1.5 }} />
                <Box sx={{ width: '85%', height: 14, backgroundColor: isDark ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)', borderRadius: 1, mb: 1.5, position: 'relative' }} >
                  <Box sx={{ 
                    position: 'absolute', 
                    right: 0, 
                    height: '100%', 
                    width: 3, 
                    backgroundColor: isDark ? '#3b82f6' : '#2563eb',
                    animation: 'blink 1s infinite'
                  }} />
                </Box>
                <Box sx={{ width: '70%', height: 14, backgroundColor: isDark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(203, 213, 225, 0.5)', borderRadius: 1, mb: 1.5 }} />
              </Box>
            </Paper>
            <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 2, color: isDark ? '#94a3b8' : '#64748b' }}>
              Enhancing professional language...
            </Typography>
          </Box>
        );
      case 3:
        return (
          <Box sx={{ mt: 3, width: '100%' }}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 2, 
                backgroundColor: isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(241, 245, 249, 0.7)',
                border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(203, 213, 225, 0.7)'}`,
                borderRadius: '0.5rem',
                maxWidth: '500px',
                mx: 'auto',
                mt: 2
              }}
            >
              {/* Document structure animation */}
              <Box sx={{ mb: 2, height: 20, width: '60%', backgroundColor: isDark ? 'rgba(148, 163, 184, 0.3)' : 'rgba(203, 213, 225, 0.6)', borderRadius: 1 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Box sx={{ p: 1, border: `1px dashed ${isDark ? 'rgba(148, 163, 184, 0.3)' : 'rgba(203, 213, 225, 0.8)'}`, borderRadius: 1, textAlign: 'center', animation: 'slideIn 1s' }}>
                    <Box sx={{ width: '100%', height: 8, backgroundColor: isDark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(203, 213, 225, 0.5)', borderRadius: 1, mb: 1 }} />
                    <Box sx={{ width: '80%', height: 8, backgroundColor: isDark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(203, 213, 225, 0.5)', borderRadius: 1, mb: 1, mx: 'auto' }} />
                  </Box>
                </Grid>
                <Grid item xs={8}>
                  <Box sx={{ p: 1, border: `1px dashed ${isDark ? 'rgba(148, 163, 184, 0.3)' : 'rgba(203, 213, 225, 0.8)'}`, borderRadius: 1, animation: 'slideIn 1s 0.2s' }}>
                    <Box sx={{ width: '100%', height: 8, backgroundColor: isDark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(203, 213, 225, 0.5)', borderRadius: 1, mb: 1 }} />
                    <Box sx={{ width: '90%', height: 8, backgroundColor: isDark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(203, 213, 225, 0.5)', borderRadius: 1, mb: 1 }} />
                    <Box sx={{ width: '80%', height: 8, backgroundColor: isDark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(203, 213, 225, 0.5)', borderRadius: 1 }} />
                  </Box>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 2, width: '100%', height: 1, backgroundColor: isDark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(203, 213, 225, 0.5)' }} />
              
              <Box sx={{ mt: 2, animation: 'slideIn 1s 0.4s' }}>
                <Box sx={{ width: '40%', height: 10, backgroundColor: isDark ? 'rgba(148, 163, 184, 0.3)' : 'rgba(203, 213, 225, 0.6)', borderRadius: 1, mb: 1.5 }} />
                <Box sx={{ width: '100%', height: 8, backgroundColor: isDark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(203, 213, 225, 0.5)', borderRadius: 1, mb: 1 }} />
                <Box sx={{ width: '90%', height: 8, backgroundColor: isDark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(203, 213, 225, 0.5)', borderRadius: 1 }} />
              </Box>
            </Paper>
            <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 2, color: isDark ? '#94a3b8' : '#64748b' }}>
              Optimizing structure and layout...
            </Typography>
          </Box>
        );
      case 4:
        return (
          <Box sx={{ mt: 3, width: '100%' }}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 2, 
                backgroundColor: isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(241, 245, 249, 0.7)',
                border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(203, 213, 225, 0.7)'}`,
                borderRadius: '0.5rem',
                maxWidth: '500px',
                mx: 'auto',
                mt: 2,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Final touches animation */}
              <Box sx={{ position: 'absolute', top: -5, right: -5, transform: 'rotate(30deg)' }}>
                <SparklesIcon style={{ width: '3rem', height: '3rem', color: isDark ? '#eab308' : '#ca8a04', opacity: 0.3 }} />
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ width: '50%', height: 16, backgroundColor: isDark ? 'rgba(148, 163, 184, 0.4)' : 'rgba(203, 213, 225, 0.8)', borderRadius: 1, mb: 1.5, position: 'relative' }}>
                  <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)', animation: 'shine 2s infinite' }} />
                </Box>
                <Box sx={{ width: '100%', height: 10, backgroundColor: isDark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(203, 213, 225, 0.5)', borderRadius: 1, mb: 1, position: 'relative' }}>
                  <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)', animation: 'shine 2s infinite 0.2s' }} />
                </Box>
                <Box sx={{ width: '90%', height: 10, backgroundColor: isDark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(203, 213, 225, 0.5)', borderRadius: 1, mb: 1, position: 'relative' }}>
                  <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)', animation: 'shine 2s infinite 0.4s' }} />
                </Box>
              </Box>
              
              <Box sx={{ mt: 3, mb: 2 }}>
                <Box sx={{ width: '40%', height: 14, backgroundColor: isDark ? 'rgba(148, 163, 184, 0.3)' : 'rgba(203, 213, 225, 0.7)', borderRadius: 1, mb: 1.5, position: 'relative' }}>
                  <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)', animation: 'shine 2s infinite 0.6s' }} />
                </Box>
                <Box sx={{ width: '100%', height: 10, backgroundColor: isDark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(203, 213, 225, 0.5)', borderRadius: 1, mb: 1, position: 'relative' }} />
                <Box sx={{ width: '85%', height: 10, backgroundColor: isDark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(203, 213, 225, 0.5)', borderRadius: 1, mb: 1, position: 'relative' }} />
                <Box sx={{ width: '75%', height: 10, backgroundColor: isDark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(203, 213, 225, 0.5)', borderRadius: 1, position: 'relative' }} />
              </Box>
              
              <Box sx={{ position: 'absolute', bottom: 5, left: 10 }}>
                <CheckIcon style={{ width: '1.5rem', height: '1.5rem', color: isDark ? '#10b981' : '#059669' }} />
              </Box>
            </Paper>
            <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 2, color: isDark ? '#94a3b8' : '#64748b' }}>
              Adding final professional touches...
            </Typography>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ 
      textAlign: 'center', 
      opacity: stage.active ? 1 : 0.4, 
      transition: 'opacity 0.3s ease-in-out',
      pt: 3 
    }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        height: '80px'
      }}>
        {getIcon()}
      </Box>
      <Typography variant="h6" sx={{ mb: 1 }}>
        {stage.title}
      </Typography>
      <Typography variant="body2" sx={{ color: isDark ? '#94a3b8' : '#64748b', mb: 3 }}>
        {stage.description}
      </Typography>
      
      {stage.active && getAnimationContent()}
    </Box>
  );
};

const RewriteDialog = ({ 
  open, 
  handleClose, 
  rewriteData, 
  loading,
  error, 
  progress, 
  stages,
  isDark,
  handleSaveRewrite
}) => {
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  const [activeStageIndex, setActiveStageIndex] = useState(0);

  // Find the currently active stage index
  useEffect(() => {
    if (!stages || stages.length === 0) return;
    
    const activeIndex = stages.findIndex(stage => stage.active);
    if (activeIndex !== -1) {
      setActiveStageIndex(activeIndex);
    }
  }, [stages]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <DocumentTextIcon style={{ width: '1.5rem', height: '1.5rem', color: isDark ? '#10b981' : '#059669', marginRight: '0.75rem' }} />
            <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
              CV Rewrite
            </Typography>
          </Box>
          <IconButton 
            edge="end" 
            color="inherit" 
            onClick={handleClose} 
            aria-label="close"
            sx={{ color: isDark ? '#e2e8f0' : 'rgba(0, 0, 0, 0.54)' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent 
        sx={{ 
          backgroundColor: isDark ? '#1e293b' : 'white',
          color: isDark ? '#e2e8f0' : 'inherit',
          p: 3,
          overflowX: 'hidden'
        }}
      >
        {loading ? (
          <Box sx={{ minHeight: '400px' }}>
            {/* Main loading indicator */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              mb: 4
            }}>
              <CircularProgress 
                variant="determinate" 
                value={progress} 
                size={70} 
                thickness={4} 
                sx={{ mb: 2, color: isDark ? '#3b82f6' : '#2563eb' }} 
              />
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Rewriting Your CV
              </Typography>
              <Typography variant="body2" sx={{ 
                color: isDark ? '#94a3b8' : '#64748b', 
                textAlign: 'center',
                maxWidth: '600px'
              }}>
                Our AI is enhancing your CV with professional language and ATS-friendly formatting
              </Typography>
            </Box>
            
            {/* Simplified stages display */}
            <Box sx={{ 
              maxWidth: '700px', 
              mx: 'auto', 
              backgroundColor: isDark ? 'rgba(15, 23, 42, 0.3)' : 'rgba(248, 250, 252, 0.7)',
              borderRadius: '0.75rem',
              border: `1px solid ${isDark ? 'rgba(51, 65, 85, 0.5)' : 'rgba(226, 232, 240, 0.8)'}`,
              overflow: 'hidden',
              p: 0
            }}>
              {stages.map((stage) => (
                <Box 
                  key={stage.id}
                  sx={{
                    p: 2.5,
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: stage.active 
                      ? isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.08)'
                      : 'transparent',
                    borderBottom: `1px solid ${isDark ? 'rgba(51, 65, 85, 0.5)' : 'rgba(226, 232, 240, 0.8)'}`,
                    transform: stage.active ? 'scale(1.02)' : 'scale(1)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: stage.completed
                        ? isDark ? '#3b82f6' : '#2563eb'
                        : stage.active
                        ? isDark ? 'rgba(59, 130, 246, 0.25)' : 'rgba(59, 130, 246, 0.15)'
                        : isDark ? 'rgba(51, 65, 85, 0.5)' : 'rgba(203, 213, 225, 0.6)',
                      color: stage.completed
                        ? 'white'
                        : stage.active
                        ? isDark ? '#60a5fa' : '#3b82f6'
                        : isDark ? '#94a3b8' : '#64748b',
                      mr: 2.5,
                      transition: 'all 0.3s ease',
                      boxShadow: stage.active ? '0 0 10px rgba(59, 130, 246, 0.3)' : 'none',
                    }}
                  >
                    {stage.completed ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: '1.25rem', height: '1.25rem' }}>
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <Typography 
                        variant="body1" 
                        component="span" 
                        sx={{ 
                          fontWeight: stage.active ? 700 : 600,
                          fontSize: '1rem'
                        }}
                      >
                        {stage.id}
                      </Typography>
                    )}
                  </Box>
                  
                  <Box sx={{ flex: 1 }}>
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        fontWeight: stage.active ? 700 : 600,
                        fontSize: '0.95rem',
                        color: stage.active 
                          ? isDark ? '#e2e8f0' : '#1e293b'
                          : isDark ? '#94a3b8' : '#64748b',
                      }}
                    >
                      {stage.title || stage.name}
                    </Typography>
                    
                    {stage.active && (
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: isDark ? '#cbd5e1' : '#475569',
                          fontSize: '0.85rem',
                          mt: 0.5
                        }}
                      >
                        {stage.description}
                      </Typography>
                    )}
                  </Box>
                  
                  {stage.active && (
                    <Box 
                      sx={{ 
                        width: 16, 
                        height: 16, 
                        borderRadius: '50%', 
                        backgroundColor: isDark ? '#60a5fa' : '#3b82f6',
                        ml: 2,
                        animation: 'pulse 1.2s infinite'
                      }} 
                    />
                  )}
                </Box>
              ))}
            </Box>
            
            {/* Active stage visualization */}
            {stages && stages.length > 0 && stages[activeStageIndex] && stages[activeStageIndex].active && (
              <Box sx={{ 
                mt: 4, 
                textAlign: 'center', 
                backgroundColor: isDark ? 'rgba(15, 23, 42, 0.3)' : 'rgba(248, 250, 252, 0.7)',
                borderRadius: '0.75rem',
                p: 3,
                maxWidth: '700px',
                mx: 'auto',
                border: `1px solid ${isDark ? 'rgba(51, 65, 85, 0.5)' : 'rgba(226, 232, 240, 0.8)'}`,
              }}>
                <Typography variant="caption" sx={{ 
                  color: isDark ? '#60a5fa' : '#3b82f6',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  display: 'block'
                }}>
                  Currently Processing
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  {stages[activeStageIndex].description}
                </Typography>
                
                {/* Simple animation based on current stage */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  {activeStageIndex === 0 && (
                    <Box sx={{ 
                      width: '200px', 
                      height: '12px', 
                      borderRadius: '6px', 
                      backgroundColor: isDark ? 'rgba(51, 65, 85, 0.5)' : 'rgba(203, 213, 225, 0.6)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <Box sx={{ 
                        position: 'absolute', 
                        top: 0, 
                        left: 0, 
                        height: '100%', 
                        width: '30%', 
                        backgroundColor: isDark ? '#60a5fa' : '#3b82f6',
                        borderRadius: '6px',
                        animation: 'indeterminateProgress 1.5s infinite ease-in-out'
                      }} />
                    </Box>
                  )}
                  
                  {activeStageIndex === 1 && (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {[1, 2, 3].map((i) => (
                        <Box 
                          key={i}
                          sx={{ 
                            width: 10, 
                            height: 10, 
                            borderRadius: '50%', 
                            backgroundColor: isDark ? '#60a5fa' : '#3b82f6',
                            animation: `bounce 1.4s infinite ease-in-out both`,
                            animationDelay: `${i * 0.16}s`
                          }} 
                        />
                      ))}
                    </Box>
                  )}
                  
                  {activeStageIndex === 2 && (
                    <Box sx={{ 
                      width: 24, 
                      height: 24, 
                      borderRadius: '50%', 
                      borderTop: `2px solid ${isDark ? '#60a5fa' : '#3b82f6'}`,
                      borderRight: `2px solid transparent`,
                      animation: 'spin 0.8s linear infinite'
                    }} />
                  )}
                  
                  {activeStageIndex === 3 && (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <SparklesIcon style={{ width: '1.5rem', height: '1.5rem', color: isDark ? '#60a5fa' : '#3b82f6', animation: 'pulse 1.2s infinite' }} />
                    </Box>
                  )}
                </Box>
              </Box>
            )}
            
            {/* Custom animation keyframes */}
            <style jsx="true">{`
              @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.4; }
              }
              @keyframes bounce {
                0%, 80%, 100% { transform: scale(0); }
                40% { transform: scale(1); }
              }
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
              @keyframes indeterminateProgress {
                0% { left: -30%; }
                100% { left: 100%; }
              }
            `}</style>
          </Box>
        ) : error ? (
          <Box 
            sx={{ 
              p: 4, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              textAlign: 'center',
              minHeight: '300px',
              justifyContent: 'center'
            }}
          >
            <Typography variant="h6" color="error" sx={{ mb: 2 }}>
              Rewrite Error
            </Typography>
            <Typography variant="body1">
              {error}
            </Typography>
            <Button 
              variant="contained" 
              sx={{ mt: 3 }} 
              onClick={handleClose}
            >
              Close
            </Button>
          </Box>
        ) : rewriteData ? (
          <Box sx={{ p: 3 }}>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                mb: 2
              }}>
                <CheckIcon style={{ width: '2rem', height: '2rem', color: isDark ? '#10b981' : '#059669' }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                Your CV has been rewritten!
              </Typography>
              <Typography variant="body1" sx={{ color: isDark ? '#94a3b8' : '#64748b', mb: 4, maxWidth: '600px', mx: 'auto' }}>
                We've enhanced your CV with professional language and formatting. Review the rewritten content below.
              </Typography>
            </Box>
            
            <Box sx={{ 
              border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
              borderRadius: '0.5rem',
              p: 3,
              mb: 4,
              backgroundColor: isDark ? 'rgba(15, 23, 42, 0.5)' : 'rgba(248, 250, 252, 0.6)',
              maxHeight: '400px',
              overflow: 'auto'
            }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Professional Summary
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, whiteSpace: 'pre-line' }}>
                {rewriteData.professional_summary || rewriteData.summary || "No professional summary provided"}
              </Typography>
              
              {rewriteData.sections && rewriteData.sections.map((section, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    {section.title}
                  </Typography>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                    {section.content}
                  </Typography>
                </Box>
              ))}
              
              {!rewriteData.sections && rewriteData.experience && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Experience
                  </Typography>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                    {rewriteData.experience}
                  </Typography>
                </Box>
              )}
              
              {!rewriteData.sections && rewriteData.skills && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Skills
                  </Typography>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                    {rewriteData.skills}
                  </Typography>
                </Box>
              )}
              
              {!rewriteData.sections && rewriteData.education && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Education
                  </Typography>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                    {rewriteData.education}
                  </Typography>
                </Box>
              )}
            </Box>
            
            <Box sx={{ 
              bgcolor: isDark ? 'rgba(37, 99, 235, 0.1)' : 'rgba(219, 234, 254, 0.8)',
              p: 3,
              borderRadius: '0.5rem',
              border: `1px solid ${isDark ? 'rgba(37, 99, 235, 0.3)' : 'rgba(37, 99, 235, 0.2)'}`,
            }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: isDark ? '#60a5fa' : '#2563eb' }}>
                What's next?
              </Typography>
              <Typography variant="body2" sx={{ color: isDark ? '#93c5fd' : '#1e40af', mb: 2 }}>
                Save this rewritten CV to your CV writer to further customize it, download it as a PDF, or use it for job applications.
              </Typography>
            </Box>
          </Box>
        ) : null}
      </DialogContent>

      <DialogActions sx={{ 
        p: 2, 
        backgroundColor: isDark ? '#1e293b' : 'white',
        borderTop: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
      }}>
        <Button 
          onClick={handleClose}
          sx={{ 
            color: isDark ? '#94a3b8' : '#64748b',
            textTransform: 'none',
            mr: 1
          }}
        >
          Close
        </Button>
        
        {rewriteData && (
          <Button 
            variant="contained" 
            onClick={handleSaveRewrite}
            startIcon={<ArrowRightIcon style={{ width: '1rem', height: '1rem' }} />}
            sx={{ 
              bgcolor: isDark ? '#3b82f6' : '#2563eb',
              '&:hover': {
                bgcolor: isDark ? '#2563eb' : '#1d4ed8',
              },
              textTransform: 'none',
              px: 3
            }}
          >
            Save to CV Writer
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default RewriteDialog;
