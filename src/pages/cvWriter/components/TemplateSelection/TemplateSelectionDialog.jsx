import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, CircularProgress, Alert, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import TemplateSelector from './TemplateSelector';
import { setTemplateForCV } from '../../../../api/cv';

/**
 * Dialog component for selecting a CV template
 */
const TemplateSelectionDialog = ({ open, onClose, cvId, onTemplateSelected }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  // Handle template selection and API call
  const handleTemplateSelect = async (template) => {
    try {
      setLoading(true);
      setError(null);
      
      // Call API to update the CV with the selected template
      console.log("Setting template for CV:", cvId, "Template ID:", template.id);
      const updatedCv = await setTemplateForCV(cvId, template.id);
      
      // Call callback with updated CV data
      if (onTemplateSelected) {
        onTemplateSelected(updatedCv);
      }
      
      setLoading(false);
      
      // Navigate back to the dashboard with refresh flags
      navigate('/dashboard', { 
        state: { 
          fromCVCreation: true,
          refreshData: true,
          successMessage: 'CV created successfully! You can now view it in your dashboard.' 
        }
      });
    } catch (err) {
      console.error('Error setting template:', err);
      setError('Failed to apply the template. Please try again.');
      setLoading(false);
    }
  };
  
  const handleFinish = () => {
    // Navigate back to the dashboard with refresh flags
    navigate('/dashboard', { 
      state: { 
        fromCVCreation: true,
        refreshData: true,
        successMessage: 'CV created successfully! You can now view it in your dashboard.' 
      }
    });
  };
  
  return (
    <Dialog 
      open={open} 
      onClose={loading ? null : onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { 
          minHeight: '70vh',
          maxHeight: '90vh',
          backgroundColor: 'white',
          color: 'black'
        }
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" component="div" fontWeight="500">
            Choose a Template for Your CV
          </Typography>
          <IconButton 
            onClick={onClose}
            disabled={loading}
            sx={{ color: 'rgba(0, 0, 0, 0.54)' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="400px">
            <CircularProgress />
            <Typography variant="body1" ml={2}>
              Applying template...
            </Typography>
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ my: 2 }}>
            {error}
          </Alert>
        ) : (
          <TemplateSelector 
            onSelect={handleTemplateSelect}
            showPreview={true}
          />
        )}
      </DialogContent>
      
      <DialogActions>
        <Button 
          onClick={handleFinish}
          disabled={loading}
        >
          Finish
        </Button>
        <Button 
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TemplateSelectionDialog;
