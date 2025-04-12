import React from 'react';
import { Box, Typography } from '@mui/material';

const AnalysisStages = ({ stages, isDark }) => {
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
            borderRadius: '0.5rem',
            backgroundColor: stage.active 
              ? isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)'
              : 'transparent',
            border: stage.active 
              ? `1px solid ${isDark ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.2)'}`
              : 'none',
          }}
          data-active={stage.active ? 'true' : 'false'}
          data-completed={stage.completed ? 'true' : 'false'}
        >
          <Box
            sx={{
              width: '2rem',
              height: '2rem',
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: stage.completed
                ? isDark ? '#10b981' : '#10b981'
                : stage.active
                ? isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.1)'
                : isDark ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb',
              color: stage.completed
                ? 'white'
                : stage.active
                ? isDark ? '#10b981' : '#059669'
                : isDark ? '#94a3b8' : '#6b7280',
              mr: 2,
              flexShrink: 0,
            }}
          >
            {stage.completed ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" style={{ width: '1.25rem', height: '1.25rem' }}>
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <React.Fragment>
                {React.createElement(stage.icon, { style: { width: '1.25rem', height: '1.25rem' } })}
              </React.Fragment>
            )}
          </Box>
          <Box>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: stage.active || stage.completed ? 'bold' : 'medium',
                color: stage.active
                  ? isDark ? '#10b981' : '#059669'
                  : isDark ? '#f1f5f9' : 'inherit',
              }}
            >
              {stage.name}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: stage.active
                  ? isDark ? '#a1e3cb' : '#10b981'
                  : isDark ? '#cbd5e1' : 'text.secondary',
              }}
            >
              {stage.description}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default AnalysisStages;
