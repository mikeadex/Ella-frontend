import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Grid,
  Divider,
  InputAdornment,
  CircularProgress,
  useMediaQuery,
  FormHelperText
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import LanguageIcon from '@mui/icons-material/Language';
import TwitterIcon from '@mui/icons-material/Twitter';
import { useTheme as useMuiTheme } from '@mui/material/styles';

const PersonalInfoDialog = ({ 
  open, 
  handleClose, 
  onSubmit, 
  isDark,
  loading,
  parsedData
}) => {
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  
  // Initialize form with parsed data if available
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    linkedin: '',
    github: '',
    portfolio: '',
    twitter: ''
  });
  
  const [errors, setErrors] = useState({});
  
  // Pre-fill form with parsed data if available
  useEffect(() => {
    if (parsedData) {
      const { parsed_data } = parsedData;
      
      if (parsed_data && parsed_data.personal_information) {
        const { personal_information } = parsed_data;
        
        setFormData(prev => ({
          ...prev,
          firstName: personal_information.first_name || '',
          lastName: personal_information.last_name || '',
          email: personal_information.email || '',
          phone: personal_information.phone || personal_information.contact_number || '',
          address: personal_information.address || '',
          city: personal_information.city || '',
          country: personal_information.country || '',
          // Social links might be in different formats
          linkedin: personal_information.linkedin || 
                  (personal_information.social_links?.find(link => 
                    link.platform?.toLowerCase() === 'linkedin')?.url || ''),
          github: personal_information.github || 
                (personal_information.social_links?.find(link => 
                  link.platform?.toLowerCase() === 'github')?.url || ''),
          portfolio: personal_information.portfolio || 
                   (personal_information.social_links?.find(link => 
                     link.platform?.toLowerCase() === 'portfolio')?.url || ''),
          twitter: personal_information.twitter || 
                 (personal_information.social_links?.find(link => 
                   link.platform?.toLowerCase() === 'twitter')?.url || '')
        }));
      }
    }
  }, [parsedData]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields validation
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    
    // Email format validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    // URL format validation for social links (if provided)
    const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/;
    
    if (formData.linkedin && !urlRegex.test(formData.linkedin)) {
      newErrors.linkedin = 'Invalid URL format';
    }
    
    if (formData.github && !urlRegex.test(formData.github)) {
      newErrors.github = 'Invalid URL format';
    }
    
    if (formData.portfolio && !urlRegex.test(formData.portfolio)) {
      newErrors.portfolio = 'Invalid URL format';
    }
    
    if (formData.twitter && !urlRegex.test(formData.twitter)) {
      newErrors.twitter = 'Invalid URL format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };
  
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          backgroundColor: isDark ? '#1e293b' : 'white',
          backgroundImage: 'none',
          borderRadius: isMobile ? 0 : '0.5rem',
        }
      }}
    >
      <DialogTitle sx={{ 
        backgroundColor: isDark ? '#1e293b' : 'white',
        color: isDark ? '#e2e8f0' : 'inherit',
        p: 2,
        borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
      }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
            Complete Your Personal Information
          </Typography>
          <IconButton 
            edge="end" 
            color="inherit" 
            onClick={handleClose} 
            aria-label="close"
            sx={{ color: isDark ? '#e2e8f0' : 'rgba(0, 0, 0, 0.54)' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ 
        backgroundColor: isDark ? '#1e293b' : 'white',
        color: isDark ? '#e2e8f0' : 'inherit',
        p: 3,
      }}>
        <Typography variant="body2" sx={{ mb: 3, color: isDark ? '#94a3b8' : '#64748b' }}>
          Please provide your personal information to enhance your CV rewrite. This information will help create a more accurate and personalized CV.
        </Typography>
        
        <Box component="form" noValidate>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: isDark ? '#e2e8f0' : 'inherit' }}>
            Personal Details
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
                required
                variant="outlined"
                margin="normal"
                InputLabelProps={{
                  style: { color: isDark ? '#94a3b8' : undefined }
                }}
                InputProps={{
                  style: { color: isDark ? '#e2e8f0' : undefined }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : undefined,
                    },
                    '&:hover fieldset': {
                      borderColor: isDark ? 'rgba(255, 255, 255, 0.3)' : undefined,
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
                required
                variant="outlined"
                margin="normal"
                InputLabelProps={{
                  style: { color: isDark ? '#94a3b8' : undefined }
                }}
                InputProps={{
                  style: { color: isDark ? '#e2e8f0' : undefined }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : undefined,
                    },
                    '&:hover fieldset': {
                      borderColor: isDark ? 'rgba(255, 255, 255, 0.3)' : undefined,
                    },
                  },
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                required
                variant="outlined"
                margin="normal"
                InputLabelProps={{
                  style: { color: isDark ? '#94a3b8' : undefined }
                }}
                InputProps={{
                  style: { color: isDark ? '#e2e8f0' : undefined }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : undefined,
                    },
                    '&:hover fieldset': {
                      borderColor: isDark ? 'rgba(255, 255, 255, 0.3)' : undefined,
                    },
                  },
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
                InputLabelProps={{
                  style: { color: isDark ? '#94a3b8' : undefined }
                }}
                InputProps={{
                  style: { color: isDark ? '#e2e8f0' : undefined }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : undefined,
                    },
                    '&:hover fieldset': {
                      borderColor: isDark ? 'rgba(255, 255, 255, 0.3)' : undefined,
                    },
                  },
                }}
              />
            </Grid>
          </Grid>
          
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: isDark ? '#e2e8f0' : 'inherit' }}>
            Address Information
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
                InputLabelProps={{
                  style: { color: isDark ? '#94a3b8' : undefined }
                }}
                InputProps={{
                  style: { color: isDark ? '#e2e8f0' : undefined }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : undefined,
                    },
                    '&:hover fieldset': {
                      borderColor: isDark ? 'rgba(255, 255, 255, 0.3)' : undefined,
                    },
                  },
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
                InputLabelProps={{
                  style: { color: isDark ? '#94a3b8' : undefined }
                }}
                InputProps={{
                  style: { color: isDark ? '#e2e8f0' : undefined }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : undefined,
                    },
                    '&:hover fieldset': {
                      borderColor: isDark ? 'rgba(255, 255, 255, 0.3)' : undefined,
                    },
                  },
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
                InputLabelProps={{
                  style: { color: isDark ? '#94a3b8' : undefined }
                }}
                InputProps={{
                  style: { color: isDark ? '#e2e8f0' : undefined }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : undefined,
                    },
                    '&:hover fieldset': {
                      borderColor: isDark ? 'rgba(255, 255, 255, 0.3)' : undefined,
                    },
                  },
                }}
              />
            </Grid>
          </Grid>
          
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: isDark ? '#e2e8f0' : 'inherit' }}>
            Social Media & Professional Links
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="LinkedIn"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                error={!!errors.linkedin}
                helperText={errors.linkedin}
                variant="outlined"
                margin="normal"
                InputLabelProps={{
                  style: { color: isDark ? '#94a3b8' : undefined }
                }}
                InputProps={{
                  style: { color: isDark ? '#e2e8f0' : undefined },
                  startAdornment: (
                    <InputAdornment position="start">
                      <LinkedInIcon sx={{ color: isDark ? '#60a5fa' : '#3b82f6' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : undefined,
                    },
                    '&:hover fieldset': {
                      borderColor: isDark ? 'rgba(255, 255, 255, 0.3)' : undefined,
                    },
                  },
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="GitHub"
                name="github"
                value={formData.github}
                onChange={handleChange}
                error={!!errors.github}
                helperText={errors.github}
                variant="outlined"
                margin="normal"
                InputLabelProps={{
                  style: { color: isDark ? '#94a3b8' : undefined }
                }}
                InputProps={{
                  style: { color: isDark ? '#e2e8f0' : undefined },
                  startAdornment: (
                    <InputAdornment position="start">
                      <GitHubIcon sx={{ color: isDark ? '#94a3b8' : '#475569' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : undefined,
                    },
                    '&:hover fieldset': {
                      borderColor: isDark ? 'rgba(255, 255, 255, 0.3)' : undefined,
                    },
                  },
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Portfolio Website"
                name="portfolio"
                value={formData.portfolio}
                onChange={handleChange}
                error={!!errors.portfolio}
                helperText={errors.portfolio}
                variant="outlined"
                margin="normal"
                InputLabelProps={{
                  style: { color: isDark ? '#94a3b8' : undefined }
                }}
                InputProps={{
                  style: { color: isDark ? '#e2e8f0' : undefined },
                  startAdornment: (
                    <InputAdornment position="start">
                      <LanguageIcon sx={{ color: isDark ? '#a5b4fc' : '#6366f1' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : undefined,
                    },
                    '&:hover fieldset': {
                      borderColor: isDark ? 'rgba(255, 255, 255, 0.3)' : undefined,
                    },
                  },
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Twitter"
                name="twitter"
                value={formData.twitter}
                onChange={handleChange}
                error={!!errors.twitter}
                helperText={errors.twitter}
                variant="outlined"
                margin="normal"
                InputLabelProps={{
                  style: { color: isDark ? '#94a3b8' : undefined }
                }}
                InputProps={{
                  style: { color: isDark ? '#e2e8f0' : undefined },
                  startAdornment: (
                    <InputAdornment position="start">
                      <TwitterIcon sx={{ color: isDark ? '#7dd3fc' : '#0ea5e9' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : undefined,
                    },
                    '&:hover fieldset': {
                      borderColor: isDark ? 'rgba(255, 255, 255, 0.3)' : undefined,
                    },
                  },
                }}
              />
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 3, color: isDark ? '#94a3b8' : '#64748b' }}>
            <Typography variant="caption">
              * Required fields
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ 
        p: 2, 
        backgroundColor: isDark ? '#1e293b' : 'white',
        borderTop: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
      }}>
        <Button 
          onClick={handleClose}
          sx={{ 
            color: isDark ? '#94a3b8' : '#64748b',
            textTransform: 'none',
            mr: 1
          }}
        >
          Cancel
        </Button>
        <Button 
          variant="contained" 
          onClick={handleSubmit}
          disabled={loading}
          sx={{ 
            bgcolor: isDark ? '#3b82f6' : '#2563eb',
            '&:hover': {
              bgcolor: isDark ? '#2563eb' : '#1d4ed8',
            },
            textTransform: 'none',
            px: 3
          }}
        >
          {loading ? (
            <CircularProgress size={24} sx={{ color: 'white' }} />
          ) : 'Continue to Rewrite'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PersonalInfoDialog;
