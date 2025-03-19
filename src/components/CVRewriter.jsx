import React, { useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Container,
    Grid,
    TextField,
    Typography,
    Alert,
    Snackbar,
    Paper
} from '@mui/material';
import { AutoFixHigh as RewriteIcon } from '@mui/icons-material';
import cvImprovementService from '../services/cvImprovement';

const CVRewriter = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [cvData, setCvData] = useState({
        professional_summary: '',
        experience: [{
            job_title: '',
            company_name: '',
            description: ''
        }],
        skills: ''
    });
    const [rewrittenCV, setRewrittenCV] = useState(null);

    const handleInputChange = (section, value, index = null) => {
        if (section === 'experience' && index !== null) {
            const newExperience = [...cvData.experience];
            newExperience[index] = { ...newExperience[index], ...value };
            setCvData({ ...cvData, experience: newExperience });
        } else {
            setCvData({ ...cvData, [section]: value });
        }
    };

    const addExperience = () => {
        setCvData({
            ...cvData,
            experience: [
                ...cvData.experience,
                { job_title: '', company_name: '', description: '' }
            ]
        });
    };

    const removeExperience = (index) => {
        const newExperience = cvData.experience.filter((_, i) => i !== index);
        setCvData({ ...cvData, experience: newExperience });
    };

    const handleRewriteCV = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await cvImprovementService.rewriteCV(cvData);
            setRewrittenCV(result.rewritten);
            setSuccess(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper
                        sx={{
                            p: 3,
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <Typography variant="h4" gutterBottom>
                            CV Rewriter
                        </Typography>
                        <Typography variant="body1" color="text.secondary" paragraph>
                            Enter your CV content below to improve it with AI assistance.
                            We'll enhance your professional summary, experience descriptions,
                            and skills to make them more impactful.
                        </Typography>

                        {/* Professional Summary */}
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" gutterBottom>
                                Professional Summary
                            </Typography>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                variant="outlined"
                                placeholder="Enter your professional summary..."
                                value={cvData.professional_summary}
                                onChange={(e) => handleInputChange('professional_summary', e.target.value)}
                            />
                        </Box>

                        {/* Experience */}
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" gutterBottom>
                                Experience
                            </Typography>
                            {cvData.experience.map((exp, index) => (
                                <Card key={index} sx={{ mb: 2, p: 2 }}>
                                    <CardContent>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Job Title"
                                                    value={exp.job_title}
                                                    onChange={(e) => handleInputChange('experience', { job_title: e.target.value }, index)}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Company Name"
                                                    value={exp.company_name}
                                                    onChange={(e) => handleInputChange('experience', { company_name: e.target.value }, index)}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    multiline
                                                    rows={4}
                                                    label="Description"
                                                    value={exp.description}
                                                    onChange={(e) => handleInputChange('experience', { description: e.target.value }, index)}
                                                />
                                            </Grid>
                                        </Grid>
                                        {cvData.experience.length > 1 && (
                                            <Button
                                                color="error"
                                                onClick={() => removeExperience(index)}
                                                sx={{ mt: 1 }}
                                            >
                                                Remove Experience
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                            <Button variant="outlined" onClick={addExperience}>
                                Add Experience
                            </Button>
                        </Box>

                        {/* Skills */}
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" gutterBottom>
                                Skills
                            </Typography>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                variant="outlined"
                                placeholder="Enter your skills (comma-separated)..."
                                value={cvData.skills}
                                onChange={(e) => handleInputChange('skills', e.target.value)}
                            />
                        </Box>

                        {/* Submit Button */}
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                onClick={handleRewriteCV}
                                disabled={loading}
                                startIcon={loading ? <CircularProgress size={20} /> : <RewriteIcon />}
                            >
                                {loading ? 'Rewriting...' : 'Rewrite CV'}
                            </Button>
                        </Box>

                        {/* Results Section */}
                        {rewrittenCV && (
                            <Box sx={{ mt: 4 }}>
                                <Typography variant="h5" gutterBottom>
                                    Improved CV Content
                                </Typography>
                                
                                {/* Professional Summary */}
                                {rewrittenCV.professional_summary && (
                                    <Card sx={{ mb: 3, p: 2 }}>
                                        <Typography variant="h6" gutterBottom>
                                            Professional Summary
                                        </Typography>
                                        <Typography variant="body1">
                                            {rewrittenCV.professional_summary}
                                        </Typography>
                                    </Card>
                                )}

                                {/* Experience */}
                                {rewrittenCV.experience && (
                                    <Card sx={{ mb: 3, p: 2 }}>
                                        <Typography variant="h6" gutterBottom>
                                            Experience
                                        </Typography>
                                        {rewrittenCV.experience.map((exp, index) => (
                                            <Box key={index} sx={{ mb: 2 }}>
                                                <Typography variant="subtitle1">
                                                    {exp.job_title} at {exp.company_name}
                                                </Typography>
                                                <Typography variant="body1">
                                                    {exp.description}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Card>
                                )}

                                {/* Skills */}
                                {rewrittenCV.skills && (
                                    <Card sx={{ mb: 3, p: 2 }}>
                                        <Typography variant="h6" gutterBottom>
                                            Skills
                                        </Typography>
                                        <Typography variant="body1" 
                                            sx={{ whiteSpace: 'pre-line' }}>
                                            {rewrittenCV.skills}
                                        </Typography>
                                    </Card>
                                )}
                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>

            {/* Notifications */}
            <Snackbar
                open={!!error}
                autoHideDuration={6000}
                onClose={() => setError(null)}
            >
                <Alert severity="error" onClose={() => setError(null)}>
                    {error}
                </Alert>
            </Snackbar>

            <Snackbar
                open={success}
                autoHideDuration={6000}
                onClose={() => setSuccess(false)}
            >
                <Alert severity="success" onClose={() => setSuccess(false)}>
                    CV has been successfully rewritten!
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default CVRewriter; 