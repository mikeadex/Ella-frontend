import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Box, Grid, Typography, Button, Card, CardContent, CardActions, useMediaQuery, useTheme as useMuiTheme } from '@mui/material';
import { useTheme } from '../../../../context/ThemeContext';
import { useAuth } from '../../../../context/AuthContext';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import HistoryIcon from '@mui/icons-material/History';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import toast from 'react-hot-toast';
import axiosInstance from '../../../../api/axios';
import { BriefcaseIcon, DocumentChartBarIcon, ChartBarIcon, MagnifyingGlassIcon, LightBulbIcon } from '@heroicons/react/24/outline';
import { fetchParsedCV } from '../../../../api/cvParser';

// Import custom components
import AnalysisDialog from './AnalysisDialog';
import { getLevelColor, getSkillLevel, formatFileSize, createStageUpdater } from './utils';
import CVParserService from './services';

/**
 * CV Parser Preview component
 * Shows the parsed CV data and provides options to analyze, rewrite, etc.
 */
const CVParserPreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  const { isAuthenticated } = useAuth();
  
  // State management
  const [parsedCV, setParsedCV] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [operationLoading, setOperationLoading] = useState(false);
  const [analysisDialogOpen, setAnalysisDialogOpen] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState(null);
  const [showParsedData, setShowParsedData] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStages, setAnalysisStages] = useState([
    { id: 1, name: 'Preparing Analysis', description: 'Organizing your CV data for analysis', icon: DocumentChartBarIcon, completed: false, active: false },
    { id: 2, name: 'Skills Assessment', description: 'Evaluating your skills and expertise', icon: ChartBarIcon, completed: false, active: false },
    { id: 3, name: 'Content Analysis', description: 'Analyzing CV content and structure', icon: MagnifyingGlassIcon, completed: false, active: false },
    { id: 4, name: 'Generating Insights', description: 'Creating personalized recommendations', icon: LightBulbIcon, completed: false, active: false }
  ]);

  // Initialize service
  const cvParserService = new CVParserService(id, {
    onOperationStart: () => setOperationLoading(true),
    onOperationEnd: () => setOperationLoading(false),
    onError: (message) => toast.error(message),
    navigate
  });

  // Function to update the current analysis stage
  const updateAnalysisStage = createStageUpdater(setAnalysisStages);

  // Fetch CV data on component mount
  useEffect(() => {
    const fetchCV = async () => {
      try {
        setLoading(true);
        
        // Use our enhanced fetchParsedCV function
        const parsedCVData = await fetchParsedCV(id);
        
        // Set the CV data (our function guarantees a status field)
        setParsedCV(parsedCVData);
        
        // Check if parsing is still in progress
        if (parsedCVData.status !== 'completed') {
          setError(`CV parsing is in progress. Status: ${parsedCVData.status}`);
        }
      } catch (error) {
        console.error('Error fetching CV data:', error);
        const errorMessage = error.response?.data?.detail || 
                            error.response?.data?.error || 
                            'Failed to fetch CV data. Please try again later.';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCV();
    }
  }, [id]);

  // Handle delete CV
  const handleDeleteCV = () => cvParserService.deleteCV();

  // Handle analyze CV
  const handleAnalyzeCV = async () => {
    try {
      setAnalysisLoading(true);
      setAnalysisError(null);
      setAnalysisData(null);
      setAnalysisDialogOpen(true);
      setAnalysisProgress(0);
      
      // Reset stages
      setAnalysisStages([
        { 
          id: 'parsing', 
          name: 'Parsing CV Document', 
          description: 'Extracting structured data from your CV document', 
          active: true, 
          completed: false, 
          icon: DocumentChartBarIcon 
        },
        { 
          id: 'analyzing', 
          name: 'Analyzing Content', 
          description: 'Evaluating your CV content quality and completeness', 
          active: false, 
          completed: false, 
          icon: MagnifyingGlassIcon 
        },
        { 
          id: 'skills', 
          name: 'Evaluating Skills', 
          description: 'Assessing technical and soft skills relevance and presentation', 
          active: false, 
          completed: false, 
          icon: ChartBarIcon 
        },
        { 
          id: 'career', 
          name: 'Career Path Assessment', 
          description: 'Identifying suitable career paths and progression opportunities', 
          active: false, 
          completed: false, 
          icon: BriefcaseIcon 
        },
        { 
          id: 'recommendations', 
          name: 'Generating Recommendations', 
          description: 'Creating personalized improvement suggestions for your CV', 
          active: false, 
          completed: false, 
          icon: LightBulbIcon 
        },
      ]);
      
      // Simulated progress for better UX
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 1;
        });
      }, 300);
      
      // Simulated stages for better UX
      const stageIntervals = [];
      
      // Stage 1 -> 2
      stageIntervals.push(setTimeout(() => {
        setAnalysisStages(prev => {
          const updated = [...prev];
          updated[0].active = false;
          updated[0].completed = true;
          updated[1].active = true;
          return updated;
        });
      }, 3000));
      
      // Stage 2 -> 3
      stageIntervals.push(setTimeout(() => {
        setAnalysisStages(prev => {
          const updated = [...prev];
          updated[1].active = false;
          updated[1].completed = true;
          updated[2].active = true;
          return updated;
        });
      }, 7000));
      
      // Stage 3 -> 4
      stageIntervals.push(setTimeout(() => {
        setAnalysisStages(prev => {
          const updated = [...prev];
          updated[2].active = false;
          updated[2].completed = true;
          updated[3].active = true;
          return updated;
        });
      }, 11000));
      
      // Stage 4 -> 5
      stageIntervals.push(setTimeout(() => {
        setAnalysisStages(prev => {
          const updated = [...prev];
          updated[3].active = false;
          updated[3].completed = true;
          updated[4].active = true;
          return updated;
        });
      }, 15000));
      
      // Try to get CV ID from various sources
      let analysisId = id || parsedCV?.id || parsedCV?.parsed_cv?.id;
      
      // Fallback for older parsers
      if (!analysisId && location?.state?.parsedCvId) {
        analysisId = location.state.parsedCvId;
      }
      
      if (!analysisId) {
        throw new Error('Cannot analyze CV: No CV ID found');
      }
      
      // Make the API call to analyze the CV
      const analysisResponse = await axiosInstance.post('/api/ai_cv_parser/parser/analyze/', {
        cv_id: analysisId,
        parser_type: 'parsed_cv'
      });
      
      // Import employment gaps mock data if needed for development
      // Only used when API doesn't return employment gaps data
      let employmentGapsData = null;
      if (process.env.NODE_ENV === 'development' && !analysisResponse.data?.employment_gaps) {
        try {
          const { employmentGapsMock } = await import('../../../../api/mockData/employmentGapsMock');
          employmentGapsData = employmentGapsMock;
        } catch (err) {
          console.log('Employment gaps mock data not available');
        }
      }
      
      // Clear all intervals for stages
      stageIntervals.forEach(interval => clearTimeout(interval));
      clearInterval(progressInterval);
      
      // Complete all stages
      setAnalysisStages(prev => {
        return prev.map(stage => ({ ...stage, active: false, completed: true }));
      });
      
      // Set progress to 100%
      setAnalysisProgress(100);
      
      // Check for any of these fields that should exist in a valid analysis
      if (analysisResponse.data && (
          analysisResponse.data.overall_score || 
          analysisResponse.data.strengths || 
          analysisResponse.data.experience_level
      )) {
        // Add employment gaps data if available from mock or API
        const enhancedAnalysisData = {
          ...analysisResponse.data,
          // Use API data if available, otherwise use mock data
          employment_gaps: analysisResponse.data.employment_gaps || employmentGapsData
        };
        
        // Store the analysis data
        setAnalysisData(enhancedAnalysisData);
      } else {
        throw new Error('Invalid analysis data received from server');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      setAnalysisError(error.message || 'An error occurred during analysis');
      setAnalysisProgress(0);
      
      // Reset stages on error
      setAnalysisStages(prev => {
        return prev.map(stage => ({ ...stage, active: false, completed: false }));
      });
    } finally {
      setAnalysisLoading(false);
    }
  };

  // Handle rewrite CV
  const handleRewriteCV = () => cvParserService.rewriteCV(parsedCV);

  // Handle save PDF
  const handleSaveCV = () => cvParserService.saveCVAsPDF();

  // Handle transfer to editor
  const handleTransferToEditor = () => cvParserService.transferToEditor();

  // Render loading state
  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          minHeight: '50vh',
          p: 4
        }}
      >
        <Box sx={{ mb: 2 }}>
          <DocumentChartBarIcon style={{ width: '3rem', height: '3rem', color: isDark ? '#10b981' : '#10b981' }} />
        </Box>
        <Typography variant="h6" gutterBottom color={isDark ? '#f1f5f9' : 'inherit'}>
          Loading CV data...
        </Typography>
        <Typography variant="body2" color={isDark ? '#cbd5e1' : 'text.secondary'} textAlign="center">
          Please wait while we retrieve your CV information
        </Typography>
      </Box>
    );
  }

  // Render error state
  if (error) {
    const is404Error = error.includes('CV data not found') || error.includes('404');
    
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          p: 4,
          maxWidth: '800px',
          mx: 'auto',
          textAlign: 'center'
        }}
      >
        <Typography variant="h5" gutterBottom color={isDark ? '#f1f5f9' : 'inherit'}>
          {is404Error ? 'CV Not Found' : 'Error Loading CV'}
        </Typography>
        <Typography variant="body1" paragraph color={isDark ? '#cbd5e1' : 'text.secondary'}>
          {error}
        </Typography>
        
        {is404Error && (
          <Box sx={{ mt: 2, mb: 4, p: 3, borderRadius: 2, bgcolor: isDark ? 'rgba(59, 130, 246, 0.1)' : '#e0f2fe' }}>
            <Typography variant="body1" paragraph color={isDark ? '#93c5fd' : '#0369a1'}>
              <strong>Possible reasons:</strong>
            </Typography>
            <ul style={{ textAlign: 'left', color: isDark ? '#cbd5e1' : 'text.secondary' }}>
              <li>The CV ID in the URL doesn't exist in your database</li>
              <li>The CV was previously deleted</li>
              <li>You might need to upload a CV first</li>
            </ul>
          </Box>
        )}
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button 
            variant="contained" 
            onClick={() => navigate('/cv-writer')}
            sx={{ 
              mt: 2,
              backgroundColor: isDark ? '#0284c7' : '#0ea5e9',
              '&:hover': {
                backgroundColor: isDark ? '#0369a1' : '#0284c7'
              }
            }}
          >
            Return to CV Writer
          </Button>
          
          {is404Error && (
            <Button 
              variant="outlined"
              onClick={() => navigate('/cv-writer/upload')}
              sx={{ 
                mt: 2,
                color: isDark ? '#e2e8f0' : 'inherit',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                '&:hover': {
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
                }
              }}
            >
              Upload a CV
            </Button>
          )}
        </Box>
      </Box>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Helmet>
        <style>
          {`
            .animate-spin {
              animation: spin 1s linear infinite;
            }
            @keyframes spin {
              0% {
                transform: rotate(0deg);
              }
              100% {
                transform: rotate(360deg);
              }
            }
            @keyframes flyingDocument {
              0% { transform: translate(-120%, -50%); opacity: 0; }
              20% { transform: translate(-50%, -50%); opacity: 1; }
              80% { transform: translate(-50%, -50%); opacity: 1; }
              100% { transform: translate(120%, -50%); opacity: 0; }
            }
          `}
        </style>
      </Helmet>
      <Box className={`${isDark ? 'bg-gray-800' : 'bg-white'} shadow-xl rounded-xl overflow-hidden border ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
        <Box className={`${isDark ? 'bg-gray-900' : 'bg-blue-600'} p-6 ${isDark ? 'text-gray-100' : 'text-white'}`}>
          <Typography variant="h4" fontWeight="700">Your CV is Ready!</Typography>
          <Typography variant="body1" sx={{ opacity: 0.9, mt: 1 }}>
            We've successfully parsed your CV. Choose your next step below.
          </Typography>
        </Box>
        <Box sx={{ p: 0 }}>
          {/* Action Cards */}
          <Grid container spacing={3} sx={{ p: 3 }}>
            {/* Create CV Card */}
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                borderRadius: '0.5rem',
                border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                backgroundColor: isDark ? '#1e293b' : 'white',
                boxShadow: isDark ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: isDark ? '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)' : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                }
              }}>
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box sx={{ mb: 2, color: isDark ? '#10b981' : '#10b981' }}>
                    <EditIcon sx={{ fontSize: '2.5rem' }} />
                  </Box>
                  <Typography variant="h5" component="h2" gutterBottom fontWeight="600" color={isDark ? '#f1f5f9' : 'inherit'}>
                    Create CV in Editor
                  </Typography>
                  <Typography variant="body2" color={isDark ? '#cbd5e1' : 'text.secondary'}>
                    Transfer the parsed data to our CV editor to customize and fine-tune your CV with our professional templates.
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 3, pt: 0 }}>
                  <Button 
                    size="large" 
                    variant="contained" 
                    fullWidth 
                    disabled={operationLoading}
                    onClick={handleTransferToEditor}
                    sx={{ 
                      py: 1.5, 
                      backgroundColor: isDark ? '#10b981' : '#10b981',
                      '&:hover': {
                        backgroundColor: isDark ? '#059669' : '#059669'
                      }
                    }}
                  >
                    Open in Editor
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            
            {/* Analyze CV Card */}
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                borderRadius: '0.5rem',
                border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                backgroundColor: isDark ? '#1e293b' : 'white',
                boxShadow: isDark ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: isDark ? '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)' : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                }
              }}>
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box sx={{ mb: 2, color: isDark ? '#3b82f6' : '#3b82f6' }}>
                    <AnalyticsIcon sx={{ fontSize: '2.5rem' }} />
                  </Box>
                  <Typography variant="h5" component="h2" gutterBottom fontWeight="600" color={isDark ? '#f1f5f9' : 'inherit'}>
                    Analyze CV
                  </Typography>
                  <Typography variant="body2" color={isDark ? '#cbd5e1' : 'text.secondary'}>
                    Get AI-powered insights on your CV's strengths and weaknesses, with suggestions for improvement and potential job matches.
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 3, pt: 0 }}>
                  <Button 
                    size="large" 
                    variant="contained" 
                    fullWidth 
                    disabled={operationLoading}
                    onClick={handleAnalyzeCV}
                    sx={{ 
                      py: 1.5, 
                      backgroundColor: isDark ? '#3b82f6' : '#3b82f6',
                      '&:hover': {
                        backgroundColor: isDark ? '#2563eb' : '#2563eb'
                      }
                    }}
                  >
                    Analyze My CV
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            
            {/* Rewrite CV Card */}
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                borderRadius: '0.5rem',
                border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                backgroundColor: isDark ? '#1e293b' : 'white',
                boxShadow: isDark ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: isDark ? '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)' : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                }
              }}>
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box sx={{ mb: 2, color: isDark ? '#8b5cf6' : '#8b5cf6' }}>
                    <BriefcaseIcon style={{ width: '2.5rem', height: '2.5rem' }} />
                  </Box>
                  <Typography variant="h5" component="h2" gutterBottom fontWeight="600" color={isDark ? '#f1f5f9' : 'inherit'}>
                    Rewrite CV
                  </Typography>
                  <Typography variant="body2" color={isDark ? '#cbd5e1' : 'text.secondary'}>
                    Use our AI to automatically enhance your CV's content, making it more professional and impactful.
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 3, pt: 0 }}>
                  <Button 
                    size="large" 
                    variant="contained" 
                    fullWidth 
                    disabled={operationLoading}
                    onClick={handleRewriteCV}
                    sx={{ 
                      py: 1.5, 
                      backgroundColor: isDark ? '#8b5cf6' : '#8b5cf6',
                      '&:hover': {
                        backgroundColor: isDark ? '#7c3aed' : '#7c3aed'
                      }
                    }}
                  >
                    Rewrite CV
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
          
          {/* Collapsible Parsed CV Data Section */}
          <Box sx={{ px: 3, pb: 3 }}>
            <Button 
              variant="text"
              onClick={() => setShowParsedData(!showParsedData)}
              sx={{ 
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: isDark ? '#e2e8f0' : 'inherit',
                '&:hover': {
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
                }
              }}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                style={{ 
                  transition: 'transform 0.2s',
                  transform: showParsedData ? 'rotate(180deg)' : 'rotate(0deg)'
                }}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
              {showParsedData ? 'Hide Parsed CV Data' : 'Show Parsed CV Data'}
            </Button>
            
            {showParsedData && parsedCV?.parsed_data && (
              <Box 
                sx={{ 
                  mt: 2, 
                  p: 3, 
                  borderRadius: '0.5rem',
                  backgroundColor: isDark ? '#1e293b' : '#f8fafc',
                  border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                  maxHeight: '500px',
                  overflowY: 'auto'
                }}
              >
                {Object.entries(parsedCV.parsed_data).map(([sectionKey, sectionData]) => (
                  <Box key={sectionKey} sx={{ mb: 3 }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        mb: 1, 
                        pb: 1, 
                        borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                        color: isDark ? '#f1f5f9' : 'inherit',
                        textTransform: 'capitalize',
                        fontWeight: 600
                      }}
                    >
                      {sectionKey.replace(/_/g, ' ')}
                    </Typography>
                    
                    {/* Contact Info Section */}
                    {sectionKey === 'contact_info' && (
                      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 2 }}>
                        {Object.entries(sectionData).map(([contactKey, contactValue]) => (
                          contactValue && (
                            <Typography 
                              key={contactKey} 
                              variant="body2" 
                              sx={{ color: isDark ? '#cbd5e1' : 'text.secondary' }}
                            >
                              <strong>{contactKey.replace(/_/g, ' ')}:</strong> {contactValue}
                            </Typography>
                          )
                        ))}
                      </Box>
                    )}
                    
                    {/* Professional Summary */}
                    {sectionKey === 'professional_summary' && typeof sectionData === 'string' && (
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          whiteSpace: 'pre-wrap',
                          color: isDark ? '#cbd5e1' : 'text.secondary',
                          lineHeight: 1.6
                        }}
                      >
                        {sectionData}
                      </Typography>
                    )}
                    
                    {/* Experience Section */}
                    {sectionKey === 'experience' && Array.isArray(sectionData) && (
                      <Box sx={{ mt: 1 }}>
                        {sectionData.map((job, index) => (
                          <Box 
                            key={index} 
                            sx={{ 
                              mb: 2, 
                              p: 2, 
                              borderRadius: '0.375rem',
                              backgroundColor: isDark ? 'rgba(30, 41, 59, 0.5)' : 'rgba(248, 250, 252, 0.8)',
                              border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
                            }}
                          >
                            <Typography variant="subtitle1" fontWeight="600" color={isDark ? '#f1f5f9' : 'inherit'}>
                              {job.title || 'Position'} {job.company && `at ${job.company}`}
                            </Typography>
                            
                            {(job.start_date || job.end_date) && (
                              <Typography variant="body2" color={isDark ? '#94a3b8' : 'text.secondary'} sx={{ mb: 1 }}>
                                {job.start_date || 'N/A'} — {job.end_date || 'Present'}
                              </Typography>
                            )}
                            
                            {job.location && (
                              <Typography variant="body2" color={isDark ? '#94a3b8' : 'text.secondary'} sx={{ mb: 1 }}>
                                Location: {job.location}
                              </Typography>
                            )}
                            
                            {job.description && (
                              <Typography 
                                variant="body2" 
                                color={isDark ? '#cbd5e1' : 'text.secondary'}
                                sx={{ whiteSpace: 'pre-wrap', mt: 1, lineHeight: 1.5 }}
                              >
                                {job.description}
                              </Typography>
                            )}
                          </Box>
                        ))}
                      </Box>
                    )}
                    
                    {/* Education Section */}
                    {sectionKey === 'education' && Array.isArray(sectionData) && (
                      <Box sx={{ mt: 1 }}>
                        {sectionData.map((edu, index) => (
                          <Box 
                            key={index} 
                            sx={{ 
                              mb: 2, 
                              p: 2, 
                              borderRadius: '0.375rem',
                              backgroundColor: isDark ? 'rgba(30, 41, 59, 0.5)' : 'rgba(248, 250, 252, 0.8)',
                              border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
                            }}
                          >
                            {edu.degree && (
                              <Typography variant="subtitle1" fontWeight="600" color={isDark ? '#f1f5f9' : 'inherit'}>
                                {edu.degree}
                              </Typography>
                            )}
                            
                            {edu.institution && (
                              <Typography variant="body2" color={isDark ? '#94a3b8' : 'text.secondary'}>
                                {edu.institution}
                              </Typography>
                            )}
                            
                            {edu.field && (
                              <Typography variant="body2" color={isDark ? '#94a3b8' : 'text.secondary'}>
                                Field: {edu.field}
                              </Typography>
                            )}
                            
                            {edu.graduation_date && (
                              <Typography variant="body2" color={isDark ? '#94a3b8' : 'text.secondary'}>
                                Graduated: {edu.graduation_date}
                              </Typography>
                            )}
                          </Box>
                        ))}
                      </Box>
                    )}
                    
                    {/* Skills Section */}
                    {sectionKey === 'skills' && Array.isArray(sectionData) && (
                      <Box sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
                        gap: 2,
                        mt: 1
                      }}>
                        {sectionData.map((skill, index) => (
                          <Box 
                            key={index}
                            sx={{ 
                              p: 1.5,
                              borderRadius: '0.375rem',
                              backgroundColor: skill.level 
                                ? isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)'
                                : isDark ? 'rgba(30, 41, 59, 0.5)' : 'rgba(248, 250, 252, 0.8)',
                              border: `1px solid ${
                                skill.level 
                                  ? isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.1)'
                                  : isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
                              }`,
                            }}
                          >
                            <Typography 
                              variant="body2"
                              sx={{ 
                                color: isDark ? '#f1f5f9' : 'inherit',
                                fontWeight: 500
                              }}
                            >
                              {skill.name}
                            </Typography>
                            {skill.level && (
                              <Typography 
                                variant="caption"
                                sx={{ 
                                  display: 'block',
                                  mt: 0.5,
                                  color: isDark ? '#94a3b8' : 'text.secondary'
                                }}
                              >
                                Level: {skill.level}
                              </Typography>
                            )}
                          </Box>
                        ))}
                      </Box>
                    )}
                    
                    {/* Certifications Section */}
                    {sectionKey === 'certifications' && Array.isArray(sectionData) && (
                      <Box sx={{ mt: 1 }}>
                        {sectionData.length > 0 ? (
                          sectionData.map((cert, index) => (
                            <Box 
                              key={index} 
                              sx={{ 
                                mb: 2, 
                                p: 2, 
                                borderRadius: '0.375rem',
                                backgroundColor: isDark ? 'rgba(30, 41, 59, 0.5)' : 'rgba(248, 250, 252, 0.8)',
                                border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
                              }}
                            >
                              <Typography variant="subtitle1" fontWeight="600" color={isDark ? '#f1f5f9' : 'inherit'}>
                                {cert.name}
                              </Typography>
                              
                              {cert.issuer && (
                                <Typography variant="body2" color={isDark ? '#94a3b8' : 'text.secondary'}>
                                  Issuer: {cert.issuer}
                                </Typography>
                              )}
                              
                              {cert.date && (
                                <Typography variant="body2" color={isDark ? '#94a3b8' : 'text.secondary'}>
                                  Date: {cert.date}
                                </Typography>
                              )}
                            </Box>
                          ))
                        ) : (
                          <Typography variant="body2" color={isDark ? '#94a3b8' : 'text.secondary'}>
                            No certifications found
                          </Typography>
                        )}
                      </Box>
                    )}
                    
                    {/* Languages Section */}
                    {sectionKey === 'languages' && Array.isArray(sectionData) && (
                      <Box sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
                        gap: 2,
                        mt: 1
                      }}>
                        {sectionData.length > 0 ? (
                          sectionData.map((lang, index) => (
                            <Box 
                              key={index}
                              sx={{ 
                                p: 1.5,
                                borderRadius: '0.375rem',
                                backgroundColor: isDark ? 'rgba(30, 41, 59, 0.5)' : 'rgba(248, 250, 252, 0.8)',
                                border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
                              }}
                            >
                              <Typography 
                                variant="body2"
                                sx={{ 
                                  color: isDark ? '#f1f5f9' : 'inherit',
                                  fontWeight: 500
                                }}
                              >
                                {typeof lang === 'string' ? lang : lang.name}
                              </Typography>
                              {typeof lang !== 'string' && lang.proficiency && (
                                <Typography 
                                  variant="caption"
                                  sx={{ 
                                    display: 'block',
                                    mt: 0.5,
                                    color: isDark ? '#94a3b8' : 'text.secondary'
                                  }}
                                >
                                  Proficiency: {lang.proficiency}
                                </Typography>
                              )}
                            </Box>
                          ))
                        ) : (
                          <Typography variant="body2" color={isDark ? '#94a3b8' : 'text.secondary'}>
                            No languages found
                          </Typography>
                        )}
                      </Box>
                    )}
                    
                    {/* Generic string section */}
                    {sectionKey !== 'professional_summary' && 
                     sectionKey !== 'contact_info' && 
                     sectionKey !== 'experience' && 
                     sectionKey !== 'education' && 
                     sectionKey !== 'skills' && 
                     sectionKey !== 'certifications' &&
                     sectionKey !== 'languages' && 
                     typeof sectionData === 'string' && (
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          whiteSpace: 'pre-wrap',
                          color: isDark ? '#cbd5e1' : 'text.secondary'
                        }}
                      >
                        {sectionData}
                      </Typography>
                    )}
                    
                    {/* Generic array/object fallback for any other sections */}
                    {sectionKey !== 'contact_info' && 
                     sectionKey !== 'experience' && 
                     sectionKey !== 'education' && 
                     sectionKey !== 'skills' &&
                     sectionKey !== 'certifications' &&
                     sectionKey !== 'languages' &&
                     typeof sectionData !== 'string' && (
                      <>
                        {Array.isArray(sectionData) ? (
                          <Box component="ul" sx={{ pl: 3, mt: 1 }}>
                            {sectionData.map((item, index) => (
                              <Box component="li" key={index} sx={{ mb: 1 }}>
                                {typeof item === 'string' ? (
                                  <Typography 
                                    variant="body2"
                                    sx={{ color: isDark ? '#cbd5e1' : 'text.secondary' }}
                                  >
                                    {item}
                                  </Typography>
                                ) : (
                                  <Box>
                                    {Object.entries(item).map(([itemKey, itemValue]) => (
                                      <Typography 
                                        key={itemKey} 
                                        variant="body2"
                                        sx={{ color: isDark ? '#cbd5e1' : 'text.secondary' }}
                                      >
                                        <strong>{itemKey.replace(/_/g, ' ')}:</strong> {
                                          typeof itemValue === 'string' ? itemValue : 
                                          itemValue === null ? '—' : // Use em dash for null values
                                          JSON.stringify(itemValue)
                                        }
                                      </Typography>
                                    ))}
                                  </Box>
                                )}
                              </Box>
                            ))}
                          </Box>
                        ) : (
                          <Box sx={{ pl: 2 }}>
                            {Object.entries(sectionData).map(([subKey, subValue]) => (
                              <Typography 
                                key={subKey} 
                                variant="body2" 
                                sx={{ 
                                  mb: 0.5,
                                  color: isDark ? '#cbd5e1' : 'text.secondary'
                                }}
                              >
                                <strong>{subKey.replace(/_/g, ' ')}:</strong> {
                                  typeof subValue === 'string' ? subValue : 
                                  subValue === null ? '—' : // Use em dash for null values
                                  JSON.stringify(subValue)
                                }
                              </Typography>
                            ))}
                          </Box>
                        )}
                      </>
                    )}
                  </Box>
                ))}
              </Box>
            )}
          </Box>
          
          {/* Secondary Actions */}
          <Box sx={{ px: 3, pb: 3, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button 
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={handleSaveCV}
                disabled={operationLoading}
                sx={{
                  color: isDark ? '#e2e8f0' : 'inherit',
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                  '&:hover': {
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
                  }
                }}
              >
                Download PDF
              </Button>
              <Button 
                variant="outlined" 
                startIcon={<HistoryIcon />}
                onClick={() => navigate('/cv-writer')}
                disabled={operationLoading}
                sx={{
                  color: isDark ? '#e2e8f0' : 'inherit',
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                  '&:hover': {
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
                  }
                }}
              >
                Back to CV Writer
              </Button>
            </Box>
            <Button 
              variant="outlined" 
              color="error" 
              startIcon={<DeleteIcon />}
              onClick={handleDeleteCV}
              disabled={operationLoading}
              sx={{
                borderColor: isDark ? 'rgba(239, 68, 68, 0.5)' : 'rgba(239, 68, 68, 0.5)',
                '&:hover': {
                  backgroundColor: isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)',
                  borderColor: isDark ? 'rgba(239, 68, 68, 0.7)' : 'rgba(239, 68, 68, 0.7)'
                }
              }}
            >
              Delete CV
            </Button>
          </Box>
        </Box>
      </Box>
      
      {/* CV Analysis Dialog */}
      <AnalysisDialog 
        open={analysisDialogOpen}
        onClose={() => setAnalysisDialogOpen(false)}
        analysisData={analysisData}
        analysisLoading={analysisLoading}
        analysisError={analysisError}
        analysisProgress={analysisProgress}
        analysisStages={analysisStages}
        isMobile={isMobile}
        getLevelColor={getLevelColor}
        getSkillLevel={getSkillLevel}
      />
    </div>
  );
};

export default CVParserPreview;
