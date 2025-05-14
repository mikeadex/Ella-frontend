import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  IconButton, 
  Typography, 
  Box, 
  CircularProgress, 
  Button,
  useTheme as useMuiTheme, 
  useMediaQuery,
  Paper,
  Grid
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { 
  DocumentTextIcon, 
  CheckIcon, 
  ArrowRightIcon, 
  PencilIcon, 
  DocumentChartBarIcon, 
  SparklesIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import RewriteStages from './RewriteStages';
import { TemplateSelectionDialog } from '../TemplateSelection';
import { useTheme } from '../../../../context/ThemeContext';

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
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [savedCvId, setSavedCvId] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);

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
          backgroundColor: 'white',
          backgroundImage: 'none',
          borderRadius: isMobile ? 0 : '0.5rem',
          width: '100%'
        }
      }}
    >
      <DialogTitle 
        component="div"
        sx={{ 
          backgroundColor: 'white',
          color: 'black',
          p: 2,
          borderBottom: '1px solid #e5e7eb',
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <DocumentTextIcon style={{ width: '1.5rem', height: '1.5rem', color: '#10b981', marginRight: '0.75rem' }} />
            <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
              CV Rewrite
            </Typography>
          </Box>
          <IconButton 
            edge="end" 
            color="inherit" 
            onClick={handleClose} 
            aria-label="close"
            sx={{ color: 'black' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent 
        sx={{ 
          backgroundColor: 'white',
          color: 'black',
          p: 3,
          overflowX: 'hidden',
          minHeight: '400px', 
          display: 'flex',
          flexDirection: 'column',
          justifyContent: loading ? 'center' : 'flex-start'
        }}
      >
        {/* Debug output */}
        {!loading && rewriteData && (
          <Box sx={{ mb: 2, p: 2, border: '1px dashed red', backgroundColor: '#ffeeee', overflow: 'auto', maxHeight: '200px' }}>
            <Typography variant="subtitle2" fontWeight="bold" color="error">
              Debug Information (will be removed):
            </Typography>
            <pre style={{ fontSize: '11px', whiteSpace: 'pre-wrap' }}>
              {JSON.stringify({
                dataType: typeof rewriteData,
                hasResult: Boolean(rewriteData?.result),
                resultType: typeof rewriteData?.result,
                topLevelKeys: rewriteData ? Object.keys(rewriteData) : [],
                resultKeys: rewriteData?.result ? Object.keys(rewriteData.result) : [],
                name: rewriteData?.result?.name || rewriteData?.name || rewriteData?.personal_info?.name || "Professional CV",
                summary: rewriteData?.result?.professional_summary || rewriteData?.result?.summary || rewriteData?.professional_summary || rewriteData?.summary,
                experience: Boolean(rewriteData?.result?.experience || rewriteData?.experience),
                skills: Boolean(rewriteData?.result?.skills || rewriteData?.skills),
                education: Boolean(rewriteData?.result?.education || rewriteData?.education),
                hasSections: Boolean(rewriteData?.result?.sections || rewriteData?.sections),
                sectionsLength: rewriteData?.result?.sections?.length || rewriteData?.sections?.length || 0
              }, null, 2)}
            </pre>
          </Box>
        )}
        
        {loading ? (
          <Box sx={{ 
            minHeight: '400px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            backgroundColor: 'white', 
            borderRadius: '8px',
            p: 3
          }}>
            {/* Main loading indicator */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              mb: 4,
              width: '100%'
            }}>
              <CircularProgress 
                variant="determinate" 
                value={progress} 
                size={80} 
                thickness={5} 
                sx={{ mb: 3, color: '#3b82f6' }} 
              />
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                Rewriting Your CV
              </Typography>
              <Typography variant="body1" sx={{ 
                color: '#64748b', 
                textAlign: 'center',
                maxWidth: '600px',
                mb: 2
              }}>
                Our AI is enhancing your CV with professional language and ATS-friendly formatting
              </Typography>
            </Box>
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
          <Box sx={{ 
            width: '100%', 
            minHeight: '400px',
            backgroundColor: 'white', 
            borderRadius: '8px',
            p: 3,
            border: '1px solid #e5e7eb',
            position: 'relative'
          }}>
            {/* Content display - Template-based preview */}
            <Box sx={{ 
              mb: 4, 
              border: '1px solid #e5e7eb', 
              borderRadius: '8px',
              overflow: 'hidden',
              position: 'relative'
            }}>
              {/* Print button */}
              <Box sx={{ 
                position: 'absolute',
                top: 10,
                right: 10,
                zIndex: 10
              }}>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<ArrowDownTrayIcon style={{ width: '1rem', height: '1rem' }} />}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    color: '#2563eb',
                    '&:hover': {
                      backgroundColor: 'white'
                    },
                    fontSize: '0.75rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}
                  onClick={() => {
                    console.log("Print preview clicked, CV content:", rewriteData);
                    const printContent = document.getElementById('cv-preview-content');
                    if (printContent) {
                      const printWindow = window.open('', '_blank');
                      printWindow.document.write(`
                        <html>
                          <head>
                            <title>CV Preview - ${rewriteData?.result?.name || rewriteData?.name || "Professional CV"}</title>
                            <style>
                              body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
                              .container { max-width: 800px; margin: 0 auto; padding: 20px; }
                              .header { background-color: #2563eb; color: white; padding: 20px; }
                              h1, h2, h3, h4, h5, h6 { margin-top: 0; }
                              .content { display: flex; flex-wrap: wrap; }
                              .sidebar { width: 30%; background-color: #f8fafc; padding: 20px; }
                              .main { width: 70%; padding: 20px; }
                              .section { margin-bottom: 20px; }
                              .section-title { color: #2563eb; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 15px; }
                              @media print {
                                body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
                                .header { background-color: #2563eb !important; color: white !important; }
                                .sidebar { background-color: #f8fafc !important; }
                                .section-title { color: #2563eb !important; }
                              }
                              @media (max-width: 768px) {
                                .sidebar, .main { width: 100%; }
                              }
                            </style>
                          </head>
                          <body>
                            <div class="container">
                              ${printContent.innerHTML}
                            </div>
                            <script>
                              setTimeout(() => { window.print(); }, 500);
                            </script>
                          </body>
                        </html>
                      `);
                      printWindow.document.close();
                    }
                  }}
                >
                  Print Preview
                </Button>
              </Box>
              
              {/* CV Content */}
              <Box id="cv-preview-content">
                {/* Header with name and title */}
                <Box sx={{ 
                  backgroundColor: '#2563eb', 
                  color: 'white', 
                  p: 3,
                  borderBottom: '4px solid #1d4ed8'
                }}>
                  <Typography variant="h4" fontWeight="bold">
                    {rewriteData?.result?.name || rewriteData?.name || rewriteData?.personal_info?.name || "Professional CV"}
                  </Typography>
                  {(rewriteData?.result?.title || rewriteData?.title || rewriteData?.personal_info?.title) && (
                    <Typography variant="h6" sx={{ mt: 1, opacity: 0.9 }}>
                      {rewriteData?.result?.title || rewriteData?.title || rewriteData?.personal_info?.title}
                    </Typography>
                  )}
                </Box>
                
                {/* Main content in a clean two-column layout */}
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', md: 'row' }, 
                  backgroundColor: 'white'
                }}>
                  {/* Left sidebar */}
                  <Box sx={{ 
                    width: { xs: '100%', md: '30%' }, 
                    p: 3,
                    backgroundColor: '#f8fafc',
                    borderRight: { xs: 'none', md: '1px solid #e5e7eb' },
                    borderBottom: { xs: '1px solid #e5e7eb', md: 'none' }
                  }}>
                    {/* Contact Details Section */}
                    {((rewriteData?.result?.email || rewriteData?.result?.phone || rewriteData?.result?.location) ||
                      (rewriteData?.email || rewriteData?.phone || rewriteData?.location) ||
                      (rewriteData?.personal_info?.email || rewriteData?.personal_info?.phone || rewriteData?.personal_info?.location)) && (
                      <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: '#2563eb' }}>
                          Contact Details
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          {(rewriteData?.result?.email || rewriteData?.email || rewriteData?.personal_info?.email) && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Box component="span" sx={{ color: '#2563eb', fontWeight: 'bold' }}>Email:</Box>
                              <Typography variant="body2">
                                {rewriteData?.result?.email || rewriteData?.email || rewriteData?.personal_info?.email}
                              </Typography>
                            </Box>
                          )}
                          {(rewriteData?.result?.phone || rewriteData?.phone || rewriteData?.personal_info?.phone) && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Box component="span" sx={{ color: '#2563eb', fontWeight: 'bold' }}>Phone:</Box>
                              <Typography variant="body2">
                                {rewriteData?.result?.phone || rewriteData?.phone || rewriteData?.personal_info?.phone}
                              </Typography>
                            </Box>
                          )}
                          {(rewriteData?.result?.location || rewriteData?.location || rewriteData?.personal_info?.location) && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Box component="span" sx={{ color: '#2563eb', fontWeight: 'bold' }}>Location:</Box>
                              <Typography variant="body2">
                                {rewriteData?.result?.location || rewriteData?.location || rewriteData?.personal_info?.location}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    )}
                    
                    {/* Skills Section */}
                    {(rewriteData?.result?.skills || rewriteData?.skills || rewriteData?.personal_info?.skills) && (
                      <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: '#2563eb' }}>
                          Skills
                        </Typography>
                        <Typography variant="body2">
                          {rewriteData?.result?.skills || rewriteData?.skills || rewriteData?.personal_info?.skills}
                        </Typography>
                      </Box>
                    )}
                    
                    {/* Education Section - Can be in sidebar or main area depending on template */}
                    {(rewriteData?.result?.education || rewriteData?.education || rewriteData?.personal_info?.education) && (
                      <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: '#2563eb' }}>
                          Education
                        </Typography>
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                          {rewriteData?.result?.education || rewriteData?.education || rewriteData?.personal_info?.education}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  
                  {/* Main content area */}
                  <Box sx={{ 
                    width: { xs: '100%', md: '70%' },
                    p: 3 
                  }}>
                    {/* Professional Summary */}
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="h6" fontWeight="bold" sx={{ 
                        mb: 2, 
                        color: '#2563eb',
                        pb: 1,
                        borderBottom: '2px solid #e5e7eb'
                      }}>
                        Professional Summary
                      </Typography>
                      <Typography variant="body1" sx={{ 
                        lineHeight: 1.7,
                        color: '#1e293b'  
                      }}>
                        {rewriteData?.result?.professional_summary || 
                          rewriteData?.result?.summary || 
                          rewriteData?.professional_summary || 
                          rewriteData?.summary || 
                          rewriteData?.personal_info?.summary ||
                          "No professional summary provided"}
                      </Typography>
                    </Box>
                    
                    {/* Experience section */}
                    {(rewriteData?.result?.experience || rewriteData?.experience || rewriteData?.personal_info?.experience) && (
                      <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ 
                          mb: 2, 
                          color: '#2563eb',
                          pb: 1,
                          borderBottom: '2px solid #e5e7eb'
                        }}>
                          Experience
                        </Typography>
                        <Typography variant="body1" sx={{ 
                          lineHeight: 1.7,
                          color: '#1e293b',
                          whiteSpace: 'pre-line'
                        }}>
                          {rewriteData?.result?.experience || rewriteData?.experience || rewriteData?.personal_info?.experience}
                        </Typography>
                      </Box>
                    )}
                    
                    {/* Dynamic Sections */}
                    {rewriteData?.result?.sections && 
                     Array.isArray(rewriteData?.result?.sections) && 
                     rewriteData.result.sections.map((section, index) => (
                      <Box key={index} sx={{ mb: 4 }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ 
                          mb: 2, 
                          color: '#2563eb',
                          pb: 1,
                          borderBottom: '2px solid #e5e7eb'
                        }}>
                          {section.title}
                        </Typography>
                        <Typography variant="body1" sx={{ 
                          lineHeight: 1.7,
                          color: '#1e293b',
                          whiteSpace: 'pre-line'
                        }}>
                          {section.content}
                        </Typography>
                      </Box>
                    ))}
                    
                    {rewriteData?.sections && 
                     Array.isArray(rewriteData?.sections) && 
                     rewriteData.sections.map((section, index) => (
                      <Box key={index} sx={{ mb: 4 }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ 
                          mb: 2, 
                          color: '#2563eb',
                          pb: 1,
                          borderBottom: '2px solid #e5e7eb'
                        }}>
                          {section.title}
                        </Typography>
                        <Typography variant="body1" sx={{ 
                          lineHeight: 1.7,
                          color: '#1e293b',
                          whiteSpace: 'pre-line'
                        }}>
                          {section.content}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Box>
            
            {/* Action guidance */}
            <Box sx={{ 
              backgroundColor: '#f0f9ff',
              p: 3,
              borderRadius: '8px',
              border: '1px solid #bae6fd',
            }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#0284c7' }}>
                Ready to save your CV
              </Typography>
              <Typography variant="body2" sx={{ color: '#0369a1' }}>
                Click "Save CV" below to save this rewritten CV to your account.
                Then you can choose a template and download it as a PDF.
              </Typography>
            </Box>
          </Box>
        ) : null}
      </DialogContent>

      <DialogActions sx={{ 
        p: 2, 
        backgroundColor: 'white',
        borderTop: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <Button 
          onClick={handleClose}
          sx={{ 
            color: '#64748b',
            textTransform: 'none',
            mr: 1
          }}
        >
          Close
        </Button>
        
        {rewriteData && (
          <Button 
            variant="contained" 
            color="primary"
            disabled={loading}
            startIcon={<CheckIcon style={{ width: '1.25rem', height: '1.25rem' }} />}
            sx={{ 
              minWidth: '180px', 
              fontWeight: 600,
              mb: isMobile ? 2 : 0,
              zIndex: 10, // Ensure button is clickable
              backgroundColor: '#2563eb', 
              '&:hover': {
                backgroundColor: '#1d4ed8'
              }
            }}
            onClick={() => {
              handleSaveRewrite(
                // Add a success callback
                (savedCvData) => {
                  if (savedCvData && savedCvData.id) {
                    setSavedCvId(savedCvData.id);
                    setIsTemplateDialogOpen(true);
                  }
                }
              );
            }}
          >
            Save CV
          </Button>
        )}
        {savedCvId && (
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setIsTemplateDialogOpen(true)}
            sx={{ 
              minWidth: '180px', 
              fontWeight: 600,
              ml: isMobile ? 0 : 2,
              mb: isMobile ? 2 : 0
            }}
          >
            Choose Template
          </Button>
        )}
      </DialogActions>
      
      {/* Template Selection Dialog */}
      <TemplateSelectionDialog
        open={isTemplateDialogOpen}
        onClose={() => setIsTemplateDialogOpen(false)}
        cvId={savedCvId}
        onTemplateSelected={(updatedCv) => {
          setIsTemplateDialogOpen(false);
          // You could add additional handling here if needed
        }}
      />
    </Dialog>
  );
};

export default RewriteDialog;
