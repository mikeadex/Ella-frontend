import React from 'react';
import { Box, Typography } from '@mui/material';
import { DocumentTextIcon, PencilIcon, DocumentChartBarIcon, SparklesIcon } from '@heroicons/react/24/outline';

const RewriteStages = ({ stages, isDark }) => {
  const getStageIcon = (stage) => {
    if (stage.completed) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: '1.5rem', height: '1.5rem' }}>
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      );
    }
    
    switch (stage.id) {
      case 1:
        return <DocumentChartBarIcon style={{ width: '1.5rem', height: '1.5rem' }} />;
      case 2:
        return <PencilIcon style={{ width: '1.5rem', height: '1.5rem' }} />;
      case 3:
        return <DocumentTextIcon style={{ width: '1.5rem', height: '1.5rem' }} />;
      case 4:
        return <SparklesIcon style={{ width: '1.5rem', height: '1.5rem' }} />;
      default:
        return (
          <Typography variant="body1" component="span" sx={{ fontWeight: stage.active ? 700 : 600, fontSize: '1rem' }}>
            {stage.id}
          </Typography>
        );
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto' }}>
      {stages.map((stage) => (
        <Box
          key={stage.id}
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            mb: 2,
            p: 2,
            borderRadius: '0.75rem',
            backgroundColor: stage.active 
              ? isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.05)'
              : isDark ? 'rgba(15, 23, 42, 0.3)' : 'rgba(255, 255, 255, 0.6)',
            border: stage.active 
              ? `1px solid ${isDark ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`
              : `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)'}`,
            boxShadow: stage.active
              ? isDark ? '0 2px 5px rgba(0, 0, 0, 0.2)' : '0 2px 5px rgba(0, 0, 0, 0.05)'
              : 'none',
            transition: 'all 0.3s ease',
          }}
          data-active={stage.active ? 'true' : 'false'}
          data-completed={stage.completed ? 'true' : 'false'}
        >
          <Box
            sx={{
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: stage.completed
                ? isDark ? '#3b82f6' : '#2563eb'
                : stage.active
                ? isDark ? 'rgba(59, 130, 246, 0.25)' : 'rgba(59, 130, 246, 0.15)'
                : isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
              color: stage.completed
                ? 'white'
                : stage.active
                ? isDark ? '#60a5fa' : '#3b82f6'
                : isDark ? '#94a3b8' : '#64748b',
              mr: 2.5,
              flexShrink: 0,
              boxShadow: stage.completed || stage.active
                ? isDark ? '0 0 10px rgba(59, 130, 246, 0.3)' : '0 0 10px rgba(37, 99, 235, 0.2)'
                : 'none',
              transition: 'all 0.3s ease',
            }}
          >
            {getStageIcon(stage)}
          </Box>
          
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            pt: 0.25
          }}>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontWeight: stage.active || stage.completed ? 700 : 600,
                fontSize: '0.95rem',
                color: stage.active 
                  ? isDark ? '#60a5fa' : '#3b82f6'
                  : stage.completed
                  ? isDark ? '#93c5fd' : '#2563eb'
                  : isDark ? '#cbd5e1' : '#334155'
              }}
            >
              {stage.name}
            </Typography>
            
            <Typography 
              variant="body2" 
              sx={{ 
                color: isDark ? '#94a3b8' : '#64748b',
                fontSize: '0.85rem',
                lineHeight: 1.5,
                mt: 0.5
              }}
            >
              {stage.description}
            </Typography>

            {stage.active && stage.progressContent && (
              <Box sx={{ mt: 2, opacity: 0.9 }}>
                {stage.progressContent}
              </Box>
            )}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default RewriteStages;
