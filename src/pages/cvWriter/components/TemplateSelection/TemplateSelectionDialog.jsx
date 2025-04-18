import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, CircularProgress, Alert } from '@mui/material';
import TemplateSelector from './TemplateSelector';
import { setTemplateForCV } from '../../../../api/cv';

/**
 * Dialog component for selecting a CV template
 */
const TemplateSelectionDialog = ({ open, onClose, cvId, onTemplateSelected }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Handle template selection and API call
  const handleTemplateSelect = async (template) => {
    try {
      setLoading(true);
      setError(null);
      
      // Call API to update the CV with the selected template
      const updatedCv = await setTemplateForCV(cvId, template.id);
      
      // Call callback with updated CV data
      if (onTemplateSelected) {
        onTemplateSelected(updatedCv);
      }
      
      setLoading(false);
      onClose();
    } catch (err) {
      console.error('Error setting template:', err);
      setError('Failed to apply the template. Please try again.');
      setLoading(false);
    }
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
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle>
        <Typography variant="h5" component="div" fontWeight="500">
          Choose a Template for Your CV
        </Typography>
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
