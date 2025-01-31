import React from 'react';
import { Box, Typography, Paper, Divider, Grid, Chip, List, ListItem, ListItemText, CircularProgress, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';
import DOMPurify from 'dompurify';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import {ModernHeader} from '../modern/Header/ModernHeader';

const PreviewSection = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const PreviewPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  fontWeight: 600,
}));

const CVPreview = ({ cvData, loading, error }) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!cvData) {
    return (
      <Box p={3}>
        <Alert severity="info">No CV data available</Alert>
      </Box>
    );
  }

  const { profile, contacts, education, skills, professionalSummary, workExperience } = cvData;

  return (
    <PreviewPaper>
      <ModernHeader 
        name={profile.name}
        profession={profile.profession}
        contacts={contacts}
      />

      {/* Professional Summary */}
      {professionalSummary && (
        <PreviewSection>
          <SectionTitle variant="h6">Professional Summary</SectionTitle>
          <Typography 
            dangerouslySetInnerHTML={{ 
              __html: DOMPurify.sanitize(professionalSummary) 
            }} 
          />
        </PreviewSection>
      )}

      {/* Work Experience */}
      {workExperience && workExperience.length > 0 && (
        <PreviewSection>
          <SectionTitle variant="h6">Work Experience</SectionTitle>
          {workExperience.map((exp, index) => (
            <Box key={index} mb={2}>
              <Typography variant="subtitle1" fontWeight="bold">
                {exp.title} at {exp.company}
              </Typography>
              <Typography variant="subtitle2" color="textSecondary">
                {exp.period}
              </Typography>
              {exp.responsibilities && (
                <List dense>
                  {exp.responsibilities.map((resp, idx) => (
                    <ListItem key={idx}>
                      <ListItemText primary={resp} />
                    </ListItem>
                  ))}
                </List>
              )}
              {exp.achievements && exp.achievements.length > 0 && (
                <Box mt={1}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Key Achievements:
                  </Typography>
                  <List dense>
                    {exp.achievements.map((achievement, idx) => (
                      <ListItem key={idx}>
                        <ListItemText primary={achievement} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </Box>
          ))}
        </PreviewSection>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <PreviewSection>
          <SectionTitle variant="h6">Education</SectionTitle>
          {education.map((edu, index) => (
            <Box key={index} mb={2}>
              <Typography variant="subtitle1" fontWeight="bold">
                {edu.degree}
              </Typography>
              <Typography variant="subtitle2">
                {edu.institution}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {edu.year}
              </Typography>
              {edu.details && (
                <Typography variant="body2">{edu.details}</Typography>
              )}
            </Box>
          ))}
        </PreviewSection>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <PreviewSection>
          <SectionTitle variant="h6">Skills</SectionTitle>
          <Grid container spacing={1}>
            {skills.map((skill, index) => (
              <Grid item key={index}>
                <Chip 
                  label={skill.name} 
                  variant="outlined"
                  size="small"
                />
              </Grid>
            ))}
          </Grid>
        </PreviewSection>
      )}
    </PreviewPaper>
  );
};

export default CVPreview;
