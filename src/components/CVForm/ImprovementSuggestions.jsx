import React, { useState } from 'react';
import { Box, Typography, Button, CircularProgress, Alert } from '@mui/material';
import { cvImprovementService } from '../../services/cvImprovement';

const ImprovementSuggestions = ({ cvData, section, onImprove }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [improvements, setImprovements] = useState({});

    // Analyze current section
    const analyzeSection = async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await cvImprovementService.analyzeCv({
                [section]: cvData[section]
            });
            setAnalysis(result.data.sections[section]);
        } catch (err) {
            setError('Failed to analyze section');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Improve section
    const improveSection = async (level) => {
        try {
            setLoading(true);
            setError(null);
            const result = await cvImprovementService.improveSection(
                section,
                cvData[section],
                level
            );
            setImprovements(result.data);
            if (onImprove) {
                onImprove(section, result.data);
            }
        } catch (err) {
            setError('Failed to improve section');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ mt: 2, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {!analysis && !loading && (
                <Button
                    variant="outlined"
                    onClick={analyzeSection}
                    sx={{ mb: 2 }}
                >
                    Analyze Section
                </Button>
            )}

            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                    <CircularProgress size={24} />
                </Box>
            )}

            {analysis && !loading && (
                <Box>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                        Analysis Score: {analysis.score}/10
                    </Typography>

                    {analysis.suggestions.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                Suggestions for Improvement:
                            </Typography>
                            <ul>
                                {analysis.suggestions.map((suggestion, index) => (
                                    <li key={index}>
                                        <Typography variant="body2">
                                            {suggestion}
                                        </Typography>
                                    </li>
                                ))}
                            </ul>
                        </Box>
                    )}

                    {analysis.needs_improvement && (
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                variant="contained"
                                onClick={() => improveSection('minimal')}
                                disabled={loading}
                            >
                                Quick Improve
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => improveSection('full')}
                                disabled={loading}
                            >
                                Deep Improve
                            </Button>
                        </Box>
                    )}
                </Box>
            )}

            {Object.keys(improvements).length > 0 && !loading && (
                <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" color="success.main">
                        Improvements Applied!
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default ImprovementSuggestions;
