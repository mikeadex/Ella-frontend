import React from 'react';
import { Box, Typography, Grid, Divider } from '@mui/material';

const SkillsAssessment = ({ skills, isDark, getLevelColor, getSkillLevel, useFallback = false }) => {
  // Fallback skills data
  const fallbackSkills = {
    technical_skills: [
      { name: "Python", score: 7 },
      { name: "JavaScript", score: 6 },
      { name: "SQL", score: 8 },
      { name: "Django", score: 7 },
      { name: "React", score: 6 }
    ],
    soft_skills: [
      { name: "Communication", score: 8 },
      { name: "Leadership", score: 7 },
      { name: "Problem Solving", score: 9 },
      { name: "Time Management", score: 7 }
    ]
  };

  // Try different approaches to extract skills data
  const processSkills = () => {
    // Case 1: If skills is already in the expected format with technical_skills array, use it
    if (skills && typeof skills === 'object' && !Array.isArray(skills) && Array.isArray(skills.technical_skills)) {
      // Check if there are any technical or soft skills
      const hasSkills = 
        (skills.technical_skills && skills.technical_skills.length > 0) || 
        (skills.soft_skills && skills.soft_skills.length > 0);
      
      // If there are no skills and useFallback is true, use fallback skills
      if (!hasSkills && useFallback) {
        return fallbackSkills;
      }
      
      return skills;
    }
    
    // Case 2: If skills is an array (most likely coming from extractedSkills in AnalysisDialog)
    if (Array.isArray(skills)) {
      // If the array is empty and useFallback is true, use fallback skills
      if (skills.length === 0 && useFallback) {
        return fallbackSkills;
      }
      
      // We need to split the skills into technical and soft skills
      const technicalKeywords = [
        'python', 'javascript', 'java', 'c++', 'c#', 'sql', 'react', 'node', 
        'database', 'aws', 'cloud', 'azure', 'devops', 'git', 'docker', 
        'kubernetes', 'linux', 'windows', 'programming', 'coding', 'development',
        'software', 'hardware', 'network', 'security', 'data', 'analytics',
        'machine learning', 'ai', 'automation', 'riskonnect'
      ];
      
      // Make sure all skills have name and score properties
      const processedSkills = skills.map((skill, index) => {
        if (typeof skill === 'string') {
          return { name: skill, score: 5 };
        } else if (typeof skill === 'object') {
          return {
            name: skill.name || `Skill ${index + 1}`,
            score: skill.score || 5
          };
        }
        return { name: `Skill ${index + 1}`, score: 5 };
      });
      
      return {
        technical_skills: processedSkills.filter(skill => {
          const name = (skill.name || '').toLowerCase();
          return technicalKeywords.some(keyword => name.includes(keyword));
        }),
        soft_skills: processedSkills.filter(skill => {
          const name = (skill.name || '').toLowerCase();
          return !technicalKeywords.some(keyword => name.includes(keyword));
        })
      };
    }
    
    // Default when no valid skills and fallback is requested
    if (useFallback) {
      return fallbackSkills;
    }
    
    // Default empty structure if no fallback
    return {
      technical_skills: [],
      soft_skills: []
    };
  };
  
  // Process the skills data to handle different formats
  const processedSkills = processSkills();
  
  // Check if the processed skills is empty and use fallback if enabled
  const finalSkills = 
    (useFallback && 
     (!processedSkills.technical_skills || processedSkills.technical_skills.length === 0) && 
     (!processedSkills.soft_skills || processedSkills.soft_skills.length === 0)) 
      ? fallbackSkills 
      : processedSkills;
  
  return (
    <Box>
      <Grid container spacing={3}>
        {/* Technical Skills */}
        <Grid item xs={12} md={6}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 700, 
              fontSize: '1rem',
              mb: 2.5,
              color: isDark ? '#e2e8f0' : '#1e293b',
              borderBottom: `2px solid ${isDark ? 'rgba(59, 130, 246, 0.5)' : 'rgba(59, 130, 246, 0.3)'}`,
              paddingBottom: '8px',
              display: 'inline-block'
            }}
          >
            Technical Skills
          </Typography>
          
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}>
            {finalSkills.technical_skills && finalSkills.technical_skills.length > 0 ? (
              finalSkills.technical_skills.map((skill, i) => (
                <Box key={i} sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
                  paddingBottom: '0.75rem'
                }}>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: isDark ? '#e2e8f0' : '#334155',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      flex: '1 1 auto',
                      maxWidth: '60%'
                    }}
                  >
                    {skill.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                      sx={{
                        width: '2.25rem',
                        height: '2.25rem',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: getLevelColor(skill.score),
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '0.875rem',
                        mr: 1.5,
                        boxShadow: `0 0 8px ${getLevelColor(skill.score)}60`
                      }}
                    >
                      {skill.score}
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: getLevelColor(skill.score),
                        fontWeight: 600,
                        minWidth: '80px',
                        fontSize: '0.8rem'
                      }}
                    >
                      {getSkillLevel(skill.score)}
                    </Typography>
                  </Box>
                </Box>
              ))
            ) : (
              <Typography variant="body2" sx={{ color: isDark ? '#94a3b8' : '#64748b', fontStyle: 'italic' }}>
                No technical skills found in the CV
              </Typography>
            )}
          </Box>
        </Grid>

        {/* Soft Skills */}
        <Grid item xs={12} md={6}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 700, 
              fontSize: '1rem',
              mb: 2.5,
              color: isDark ? '#e2e8f0' : '#1e293b',
              borderBottom: `2px solid ${isDark ? 'rgba(59, 130, 246, 0.5)' : 'rgba(59, 130, 246, 0.3)'}`,
              paddingBottom: '8px',
              display: 'inline-block'
            }}
          >
            Soft Skills
          </Typography>
          
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}>
            {finalSkills.soft_skills && finalSkills.soft_skills.length > 0 ? (
              finalSkills.soft_skills.map((skill, i) => (
                <Box key={i} sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
                  paddingBottom: '0.75rem'
                }}>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: isDark ? '#e2e8f0' : '#334155',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      flex: '1 1 auto',
                      maxWidth: '60%'
                    }}
                  >
                    {skill.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                      sx={{
                        width: '2.25rem',
                        height: '2.25rem',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: getLevelColor(skill.score),
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '0.875rem',
                        mr: 1.5,
                        boxShadow: `0 0 8px ${getLevelColor(skill.score)}60`
                      }}
                    >
                      {skill.score}
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: getLevelColor(skill.score),
                        fontWeight: 600,
                        minWidth: '80px',
                        fontSize: '0.8rem'
                      }}
                    >
                      {getSkillLevel(skill.score)}
                    </Typography>
                  </Box>
                </Box>
              ))
            ) : (
              <Typography variant="body2" sx={{ color: isDark ? '#94a3b8' : '#64748b', fontStyle: 'italic' }}>
                No soft skills found in the CV
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SkillsAssessment;
