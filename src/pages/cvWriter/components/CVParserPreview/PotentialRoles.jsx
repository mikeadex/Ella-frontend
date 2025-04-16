import React from 'react';
import { Box, Typography, Chip } from '@mui/material';

const PotentialRoles = ({ roles, isDark }) => {
  if (!roles || (!roles.best_matches && !roles.other_options)) {
    return null;
  }

  return (
    <Box>
      {/* Best Matches */}
      {roles.best_matches?.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
            Best Job Matches
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
            {roles.best_matches.map((role, i) => (
              <Chip
                key={i}
                label={role}
                sx={{ 
                  backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.1)', 
                  borderColor: isDark ? '#3b82f6' : '#2563eb',
                  color: isDark ? '#60a5fa' : '#2563eb',
                  fontWeight: 500,
                  border: '1px solid',
                  borderRadius: '4px',
                  '& .MuiChip-label': {
                    padding: '6px 10px',
                  }
                }}
              />
            ))}
          </Box>
        </Box>
      )}
      
      {/* Match Reasons */}
      {roles.match_reasons?.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
            Why These Roles Match Your Profile
          </Typography>
          <Box component="ul" sx={{ 
            margin: 0,
            paddingLeft: '1.25rem',
            '& li': {
              mb: 1,
              color: isDark ? '#cbd5e1' : '#475569'
            }
          }}>
            {roles.match_reasons.map((reason, i) => (
              <Box component="li" key={i}>
                {reason}
              </Box>
            ))}
          </Box>
        </Box>
      )}
      
      {/* Other Options */}
      {roles.other_options?.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
            Other Career Options
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
            {roles.other_options.map((role, i) => (
              <Chip
                key={i}
                label={role}
                sx={{ 
                  backgroundColor: isDark ? 'rgba(14, 165, 233, 0.1)' : 'rgba(14, 165, 233, 0.1)', 
                  borderColor: isDark ? '#0ea5e9' : '#0284c7',
                  color: isDark ? '#38bdf8' : '#0284c7',
                  fontWeight: 500,
                  border: '1px solid',
                  borderRadius: '4px',
                  '& .MuiChip-label': {
                    padding: '6px 10px',
                  }
                }}
              />
            ))}
          </Box>
        </Box>
      )}
      
      {/* Career Growth Suggestions */}
      {roles.career_growth_suggestions?.length > 0 && (
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
            Career Growth Suggestions
          </Typography>
          <Box component="ul" sx={{ 
            margin: 0,
            paddingLeft: '1.25rem',
            '& li': {
              mb: 1,
              color: isDark ? '#cbd5e1' : '#475569'
            }
          }}>
            {roles.career_growth_suggestions.map((suggestion, i) => (
              <Box component="li" key={i}>
                {suggestion}
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default PotentialRoles;
