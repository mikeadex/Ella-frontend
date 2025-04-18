import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardMedia, CardActionArea, Tabs, Tab, Chip, Button, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { fetchTemplates } from '../../../../api/cv';

const TemplateCard = styled(Card)(({ theme, selected }) => ({
  maxWidth: 240,
  height: 340,
  position: 'relative',
  transition: 'all 0.3s ease',
  border: selected ? `2px solid ${theme.palette.primary.main}` : '1px solid rgba(0, 0, 0, 0.12)',
  boxShadow: selected ? theme.shadows[4] : theme.shadows[1],
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const TemplateMedia = styled(CardMedia)({
  height: 200,
  backgroundSize: 'cover',
  backgroundPosition: 'top',
});

const SelectedBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 10,
  right: 10,
  color: theme.palette.primary.main,
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  padding: '4px',
  borderRadius: '50%',
  zIndex: 1,
}));

const CategoryTabs = styled(Tabs)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& .MuiTab-root': {
    textTransform: 'none',
    minWidth: 'auto',
    fontWeight: 500,
  },
}));

const TemplateSelector = ({ onSelect, currentTemplateId, onClose, showPreview = true }) => {
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  
  // Fetch templates
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setLoading(true);
        const templatesData = await fetchTemplates();
        setTemplates(templatesData);
        
        // Extract unique categories
        const uniqueCategories = ['all', ...new Set(templatesData.map(template => template.category))];
        setCategories(uniqueCategories);
        
        // Set initial filtered templates
        setFilteredTemplates(templatesData);
        
        // Set selected template if currentTemplateId is provided
        if (currentTemplateId) {
          const current = templatesData.find(template => template.id === currentTemplateId);
          if (current) {
            setSelectedTemplate(current);
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching templates:', err);
        setError('Failed to load CV templates. Please try again later.');
        setLoading(false);
      }
    };
    
    loadTemplates();
  }, [currentTemplateId]);
  
  // Filter templates by category
  const handleCategoryChange = (event, newCategory) => {
    setActiveCategory(newCategory);
    if (newCategory === 'all') {
      setFilteredTemplates(templates);
    } else {
      setFilteredTemplates(templates.filter(template => template.category === newCategory));
    }
  };
  
  // Handle template selection
  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    if (!showPreview) {
      onSelect(template);
    }
  };
  
  // Handle preview
  const handleOpenPreview = () => {
    setPreviewOpen(true);
  };
  
  const handleClosePreview = () => {
    setPreviewOpen(false);
  };
  
  // Confirm template selection
  const handleConfirmSelection = () => {
    if (selectedTemplate) {
      onSelect(selectedTemplate);
    }
  };
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Alert severity="error" icon={<ErrorIcon />}>
          {error}
        </Alert>
      </Box>
    );
  }
  
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h2" fontWeight="500">
          Choose a Template
        </Typography>
        {onClose && (
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={onClose}
            variant="outlined"
            size="small"
          >
            Back
          </Button>
        )}
      </Box>
      
      {/* Category tabs */}
      <CategoryTabs
        value={activeCategory}
        onChange={handleCategoryChange}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
      >
        {categories.map((category) => (
          <Tab 
            key={category} 
            label={category === 'all' ? 'All Templates' : category.charAt(0).toUpperCase() + category.slice(1)} 
            value={category} 
          />
        ))}
      </CategoryTabs>
      
      {/* Templates grid */}
      <Grid container spacing={3}>
        {filteredTemplates.map((template) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={template.id}>
            <TemplateCard 
              selected={selectedTemplate?.id === template.id}
              onClick={() => handleTemplateSelect(template)}
            >
              {selectedTemplate?.id === template.id && (
                <SelectedBadge>
                  <CheckCircleIcon color="primary" />
                </SelectedBadge>
              )}
              <CardActionArea>
                <TemplateMedia
                  image={template.preview_image || '/images/template-placeholder.png'}
                  title={template.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {template.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {template.description}
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={0.5} mt={1}>
                    <Chip 
                      label={template.category.charAt(0).toUpperCase() + template.category.slice(1)} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                    {template.has_color_options && (
                      <Chip label="Color options" size="small" />
                    )}
                    {template.has_font_options && (
                      <Chip label="Font options" size="small" />
                    )}
                  </Box>
                </CardContent>
              </CardActionArea>
            </TemplateCard>
          </Grid>
        ))}
      </Grid>
      
      {/* Selection button */}
      {showPreview && selectedTemplate && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            onClick={handleConfirmSelection}
          >
            Select this Template
          </Button>
        </Box>
      )}
      
      {/* Template preview dialog */}
      <Dialog
        open={previewOpen}
        onClose={handleClosePreview}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedTemplate?.name} Preview
        </DialogTitle>
        <DialogContent>
          {selectedTemplate && (
            <Box display="flex" justifyContent="center">
              <img 
                src={selectedTemplate.preview_image || '/images/template-placeholder.png'} 
                alt={selectedTemplate.name}
                style={{ maxWidth: '100%', maxHeight: '70vh' }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePreview}>
            Close
          </Button>
          <Button 
            onClick={handleConfirmSelection} 
            variant="contained" 
            color="primary"
          >
            Select Template
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TemplateSelector;
