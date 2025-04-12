import React from 'react';
import { Box, Paper, Typography, Chip } from '@mui/material';

const PotentialRoles = ({ potentialRoles, isDark }) => {
  return (
    <Paper elevation={0} variant="outlined" sx={{ 
      padding: '1.5rem', 
      backgroundColor: isDark ? '#0f172a' : '#f9fafb',
      borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
    }}>
      <Typography variant="h6" gutterBottom color={isDark ? '#f1f5f9' : 'inherit'}>Potential Matching Roles</Typography>
      
      {/* Best Matches */}
      {potentialRoles.best_matches?.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" color={isDark ? '#f1f5f9' : 'inherit'}>
            Best Job Matches
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', mt: 1 }}>
            {potentialRoles.best_matches.map((role, i) => (
              <Chip
                key={i}
                label={role}
                variant="outlined"
                sx={{ 
                  backgroundColor: isDark ? 'rgba(14, 116, 144, 0.2)' : '#e0f2fe', 
                  borderColor: isDark ? 'rgba(14, 116, 144, 0.5)' : '#7dd3fc',
                  color: isDark ? '#22d3ee' : '#0369a1'
                }}
              />
            ))}
          </Box>
        </Box>
      )}
      
      {/* Match Reasons */}
      {potentialRoles.match_reasons?.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" color={isDark ? '#f1f5f9' : 'inherit'}>
            Why These Roles Match Your Profile
          </Typography>
          <Box component="ul" sx={{ 
            margin: 0,
            marginTop: 1,
            paddingLeft: '1.5rem',
            color: isDark ? '#cbd5e1' : 'inherit'
          }}>
            {potentialRoles.match_reasons.map((reason, i) => (
              <Box component="li" key={i} sx={{ mb: 1 }}>
                {reason}
              </Box>
            ))}
          </Box>
        </Box>
      )}
      
      {/* Suggested Industries */}
      {potentialRoles.suggested_industries?.length > 0 && (
        <Box>
          <Typography variant="subtitle1" color={isDark ? '#f1f5f9' : 'inherit'}>
            Recommended Industries
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', mt: 1 }}>
            {potentialRoles.suggested_industries.map((industry, i) => (
              <Chip
                key={i}
                label={industry}
                variant="outlined"
                sx={{ 
                  backgroundColor: isDark ? 'rgba(124, 58, 237, 0.2)' : '#ede9fe', 
                  borderColor: isDark ? 'rgba(124, 58, 237, 0.5)' : '#c4b5fd',
                  color: isDark ? '#a78bfa' : '#6d28d9'
                }}
              />
            ))}
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default PotentialRoles;
