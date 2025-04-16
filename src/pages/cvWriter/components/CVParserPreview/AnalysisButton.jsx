import React from 'react';
import { Button, Tooltip, Typography, CircularProgress } from '@mui/material';
import { DocumentChartBarIcon, ClockIcon } from '@heroicons/react/24/outline';
import { format, parseISO } from 'date-fns';

/**
 * Analysis Button component for CV Parser Preview
 * Handles different states: loading, has existing analysis, no analysis
 */
const AnalysisButton = ({ 
  onClick, 
  loading = false, 
  hasExistingAnalysis = false, 
  analysisDate = null,
  isMobile = false,
  isDark = false 
}) => {
  // Format the analysis date if provided
  const formattedDate = analysisDate ? format(parseISO(analysisDate), 'MMM d, yyyy') : null;
  
  // If there's an existing analysis, show when it was done
  if (hasExistingAnalysis && !loading) {
    return (
      <Tooltip 
        title={`Last analyzed on ${formattedDate}`} 
        arrow
        placement="top"
      >
        <Button
          variant="text"
          onClick={onClick}
          startIcon={<DocumentChartBarIcon style={{ width: '1.25rem', height: '1.25rem' }} />}
          sx={{
            color: isDark ? '#e2e8f0' : 'inherit',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
            },
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <span>View Analysis</span>
          {formattedDate && !isMobile && (
            <Typography 
              component="span" 
              variant="caption" 
              sx={{ 
                ml: 1, 
                display: 'flex', 
                alignItems: 'center',
                color: isDark ? '#94a3b8' : '#64748b',
                backgroundColor: isDark ? 'rgba(15, 23, 42, 0.5)' : 'rgba(241, 245, 249, 0.8)',
                px: 1,
                py: 0.25,
                borderRadius: '0.25rem'
              }}
            >
              <ClockIcon style={{ width: '0.75rem', height: '0.75rem', marginRight: '0.25rem' }} />
              {formattedDate}
            </Typography>
          )}
        </Button>
      </Tooltip>
    );
  }
  
  // Otherwise show a loading or analyze button
  return (
    <Button
      variant="text"
      onClick={onClick}
      disabled={loading}
      startIcon={loading ? <CircularProgress size={16} /> : <DocumentChartBarIcon style={{ width: '1.25rem', height: '1.25rem' }} />}
      sx={{
        color: isDark ? '#e2e8f0' : 'inherit',
        textTransform: 'none',
        '&:hover': {
          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
        }
      }}
    >
      {loading ? 'Analyzing...' : 'Analyze CV'}
    </Button>
  );
};

export default AnalysisButton;
