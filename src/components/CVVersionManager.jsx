import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  CardActions, 
  Grid, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField,
  CircularProgress,
  Chip,
  Alert
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styled from 'styled-components';

// Transient props for styled-components
const StyledBox = styled(Box).attrs({ 
  sx: (props) => ({
    ...props.sx,
    marginBottom: props.$mb || 0
  })
})``;

const CVVersionCard = ({ version, onSetPrimary, onClone, onDelete, onEdit }) => {
  const isPrimary = version.is_primary;

  return (
    <Card 
      variant="outlined" 
      sx={{ 
        mb: 2, 
        borderColor: isPrimary ? 'primary.main' : 'grey.300',
        borderWidth: isPrimary ? 2 : 1
      }}
    >
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={8}>
            <Typography variant="h6">
              {version.version_name || `Version ${version.id}`}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Purpose: {version.version_purpose || 'Not specified'}
            </Typography>
            <Typography variant="caption">
              Created: {new Date(version.created_at).toLocaleDateString()}
            </Typography>
          </Grid>
          <Grid item xs={4} sx={{ textAlign: 'right' }}>
            {isPrimary ? (
              <Typography color="primary" variant="body2">
                Primary Version
              </Typography>
            ) : null}
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        {!isPrimary && (
          <Button 
            size="small" 
            color="primary" 
            onClick={() => onSetPrimary(version.id)}
          >
            Set as Primary
          </Button>
        )}
        <Button 
          size="small" 
          color="secondary" 
          onClick={() => onClone(version.id)}
        >
          Clone
        </Button>
        <Button 
          size="small" 
          color="warning" 
          onClick={() => onEdit(version)}
        >
          Edit
        </Button>
        {!isPrimary && (
          <Button 
            size="small" 
            color="error" 
            onClick={() => onDelete(version.id)}
          >
            Delete
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const CVVersionManager = () => {
  const [versions, setVersions] = useState([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newVersionName, setNewVersionName] = useState('');
  const [newVersionPurpose, setNewVersionPurpose] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingVersion, setEditingVersion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const fetchVersions = async () => {
    try {
      setLoading(true);
      if (!isAuthenticated) {
        navigate('/login', { 
          state: { from: '/cv/versions' },
          replace: true 
        });
        return;
      }

      const response = await axiosInstance.get('/cv_writer/cv/versions/');
      console.log('CV Versions Response:', response.data);
      
      // Validate response data
      if (!Array.isArray(response.data)) {
        throw new Error('Invalid response format');
      }

      // Sort versions, with primary version first
      const sortedVersions = response.data.sort((a, b) => {
        if (a.is_primary) return -1;
        if (b.is_primary) return 1;
        return new Date(b.created_at) - new Date(a.created_at);
      });

      setVersions(sortedVersions);
      setError(null);
    } catch (error) {
      console.error('Error fetching CV versions:', error);
      
      const errorMessage = error.response?.data?.detail || 
                           error.response?.data?.error || 
                           error.message || 
                           'Failed to fetch CV versions. Please try again.';
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVersion = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.post('/cv_writer/cv/versions/', {
        version_name: newVersionName || undefined,
        version_purpose: newVersionPurpose || undefined,
        title: `Professional CV - ${newVersionName || 'New Version'}`
      });
      
      console.log('Create Version Response:', response.data);
      
      // Refresh versions list
      fetchVersions();
      
      // Close dialog and reset fields
      setIsCreateDialogOpen(false);
      setNewVersionName('');
      setNewVersionPurpose('');
      setError(null);
    } catch (error) {
      console.error('Error creating CV version:', error);
      
      const errorMessage = error.response?.data?.detail || 
                           error.response?.data?.error || 
                           error.message || 
                           'Failed to create CV version. Please try again.';
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSetPrimaryVersion = async (versionId) => {
    try {
      setLoading(true);
      await axiosInstance.patch(`/cv_writer/cv/versions/${versionId}/`, {
        is_primary: true
      });
      
      // Refresh versions list to reflect changes
      fetchVersions();
    } catch (error) {
      console.error('Error setting primary version:', error);
      
      const errorMessage = error.response?.data?.detail || 
                           error.response?.data?.error || 
                           error.message || 
                           'Failed to set primary version. Please try again.';
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCloneVersion = async (versionId) => {
    try {
      await axiosInstance.post(`/cv_writer/cv/versions/${versionId}/clone/`);
      fetchVersions();
    } catch (error) {
      console.error('Error cloning version:', error);
      setError('Failed to clone version. Please try again.');
    }
  };

  const handleDeleteVersion = async (versionId) => {
    try {
      await axiosInstance.delete(`/cv_writer/cv/versions/${versionId}/`);
      fetchVersions();
    } catch (error) {
      console.error('Error deleting version:', error);
      setError('Failed to delete version. Please try again.');
    }
  };

  const handleEditVersion = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.patch(`/cv_writer/cv/versions/${editingVersion.id}/edit/`, {
        version_name: editingVersion.version_name,
        version_purpose: editingVersion.version_purpose,
        visibility: editingVersion.visibility || 'private'
      });
      
      console.log('Edit Version Response:', response.data);
      
      // Refresh versions list
      fetchVersions();
      
      // Close dialog and reset fields
      setIsEditDialogOpen(false);
      setEditingVersion(null);
      setError(null);
    } catch (error) {
      console.error('Error editing CV version:', error);
      
      const errorMessage = error.response?.data?.detail || 
                           error.response?.data?.error || 
                           error.message || 
                           'Failed to edit CV version. Please try again.';
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = (version) => {
    // Ensure a valid version object is passed
    if (!version || !version.id) {
      console.error('Invalid version object', version);
      return;
    }

    // Create a new object with default values
    setEditingVersion({
      id: version.id,
      version_name: version.version_name || '',
      version_purpose: version.version_purpose || '',
      visibility: version.visibility || 'private'
    });
    setIsEditDialogOpen(true);
  };

  // Render method with version details
  const renderVersions = () => {
    return versions.map((version) => (
      <CVVersionCard 
        key={version.id} 
        version={version} 
        onSetPrimary={handleSetPrimaryVersion} 
        onClone={handleCloneVersion} 
        onDelete={handleDeleteVersion} 
        onEdit={openEditDialog} 
      />
    ));
  };

  // Dialog for creating a new version
  const renderCreateVersionDialog = () => (
    <Dialog 
      open={isCreateDialogOpen} 
      onClose={() => setIsCreateDialogOpen(false)}
    >
      <DialogTitle>Create New CV Version</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Version Name"
          fullWidth
          value={newVersionName}
          onChange={(e) => setNewVersionName(e.target.value)}
          placeholder="e.g., Tech Startup Version"
        />
        <TextField
          margin="dense"
          label="Version Purpose"
          fullWidth
          multiline
          rows={3}
          value={newVersionPurpose}
          onChange={(e) => setNewVersionPurpose(e.target.value)}
          placeholder="Describe the specific purpose of this CV version"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
        <Button 
          onClick={handleCreateVersion} 
          color="primary" 
          variant="contained"
        >
          Create Version
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Dialog for editing a version
  const renderEditVersionDialog = () => {
    // Ensure editingVersion is not null
    if (!editingVersion) return null;

    return (
      <Dialog 
        open={isEditDialogOpen} 
        onClose={() => {
          setIsEditDialogOpen(false);
          setEditingVersion(null);
        }}
      >
        <DialogTitle>Edit CV Version</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Version Name"
            fullWidth
            value={editingVersion.version_name || ''}
            onChange={(e) => setEditingVersion(prev => ({
              ...prev, 
              version_name: e.target.value
            }))}
            placeholder="e.g., Tech Startup Version"
          />
          <TextField
            margin="dense"
            label="Version Purpose"
            fullWidth
            multiline
            rows={3}
            value={editingVersion.version_purpose || ''}
            onChange={(e) => setEditingVersion(prev => ({
              ...prev, 
              version_purpose: e.target.value
            }))}
            placeholder="Describe the specific purpose of this CV version"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setIsEditDialogOpen(false);
            setEditingVersion(null);
          }}>Cancel</Button>
          <Button 
            onClick={handleEditVersion} 
            color="primary" 
            variant="contained"
            disabled={!editingVersion.version_name}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  useEffect(() => {
    // Only fetch versions if authentication is complete and user is authenticated
    if (!authLoading && isAuthenticated) {
      fetchVersions();
    }
  }, [authLoading, isAuthenticated]);

  if (authLoading) {
    return (
      <StyledBox sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </StyledBox>
    );
  }

  if (loading) {
    return (
      <StyledBox sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </StyledBox>
    );
  }

  if (error) {
    return (
      <StyledBox sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          Error
        </Typography>
        <Typography variant="body1" color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={fetchVersions} 
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </StyledBox>
    );
  }

  return (
    <StyledBox sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        CV Versions
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : versions.length === 0 ? (
        <Typography variant="body1" sx={{ mb: 2 }}>
          You have no CV versions yet. Create your first version!
        </Typography>
      ) : (
        renderVersions()
      )}

      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => setIsCreateDialogOpen(true)}
        sx={{ mt: 2 }}
      >
        Create New Version
      </Button>

      {renderCreateVersionDialog()}
      {renderEditVersionDialog()}
    </StyledBox>
  );
};

export default CVVersionManager;
