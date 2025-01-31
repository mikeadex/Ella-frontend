import React, { useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  Paper,
  Snackbar,
  Alert,
} from '@mui/material';
import { AutoFixHigh } from '@mui/icons-material';
import axios from 'axios';

const SummaryEditor = ({ initialSummary = '', onSave }) => {
  const [summary, setSummary] = useState(initialSummary);
  const [improvedSummary, setImprovedSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleImprove = async () => {
    if (!summary.trim()) {
      setError('Please enter a summary first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        '/api/cv/improve_summary/',
        { summary },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.data.improved) {
        setImprovedSummary(response.data.improved);
        setShowSuccess(true);
      }
    } catch (err) {
      setError(
        err.response?.data?.error || 
        'Failed to improve summary. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = () => {
    setSummary(improvedSummary);
    setImprovedSummary('');
    if (onSave) {
      onSave(improvedSummary);
    }
  };

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Professional Summary
      </Typography>
      
      <TextField
        fullWidth
        multiline
        rows={4}
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        placeholder="Enter your professional summary..."
        variant="outlined"
        sx={{ mb: 2 }}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleImprove}
        disabled={loading}
        startIcon={loading ? <CircularProgress size={20} /> : <AutoFixHigh />}
        sx={{ mb: 2 }}
      >
        {loading ? 'Improving...' : 'Improve Summary'}
      </Button>

      {improvedSummary && (
        <Paper sx={{ p: 2, mt: 2, bgcolor: '#f5f5f5' }}>
          <Typography variant="subtitle1" gutterBottom>
            Improved Version:
          </Typography>
          <Typography paragraph>{improvedSummary}</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="success"
              onClick={handleAccept}
            >
              Accept Improvement
            </Button>
            <Button
              variant="outlined"
              onClick={() => setImprovedSummary('')}
            >
              Discard
            </Button>
          </Box>
        </Paper>
      )}

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
      >
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
      >
        <Alert severity="success" onClose={() => setShowSuccess(false)}>
          Summary improved successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SummaryEditor;
