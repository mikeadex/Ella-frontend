import toast from 'react-hot-toast';
import axiosInstance from '../../../../api/axios';

/**
 * Service class for CV Parser Preview operations
 */
class CVParserService {
  /**
   * Constructor for the service
   * 
   * @param {string} cvId - The ID of the CV
   * @param {Object} options - Options for the service
   * @param {Function} options.onOperationStart - Callback for operation start
   * @param {Function} options.onOperationEnd - Callback for operation end
   * @param {Function} options.onError - Callback for error handling
   * @param {Function} options.navigate - Navigation function
   */
  constructor(cvId, { onOperationStart, onOperationEnd, onError, navigate }) {
    this.cvId = cvId;
    this.onOperationStart = onOperationStart || (() => {});
    this.onOperationEnd = onOperationEnd || (() => {});
    this.onError = onError || ((msg) => toast.error(msg));
    this.navigate = navigate;
    this.token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
  }

  /**
   * Get authorization headers
   * 
   * @returns {Object} Headers with authorization token
   */
  getAuthHeaders() {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Check if user is authenticated
   * 
   * @returns {boolean} Whether the user is authenticated
   */
  checkAuthentication() {
    if (!this.token) {
      this.onError('Authentication required. Please log in.');
      setTimeout(() => this.navigate('/login', { state: { returnUrl: `/cv-parser-preview/${this.cvId}` } }), 1500);
      return false;
    }
    return true;
  }

  /**
   * Delete the CV
   */
  async deleteCV() {
    if (!this.checkAuthentication()) return;
    
    if (!window.confirm('Are you sure you want to delete this CV? This action cannot be undone.')) {
      return;
    }
    
    try {
      this.onOperationStart();
      await axiosInstance.delete(`/api/cv_parser/parser/${this.cvId}/`, {
        headers: this.getAuthHeaders()
      });
      
      toast.success('CV deleted successfully!');
      this.navigate('/cv-writer');
    } catch (error) {
      console.error('Error deleting CV:', error);
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.error || 
                          'Failed to delete CV. Please try again later.';
      this.onError(errorMessage);
    } finally {
      this.onOperationEnd();
    }
  }

  /**
   * Rewrite the CV using AI
   * 
   * @param {Object} parsedCV - The parsed CV data
   * @param {Function} setRewriteStages - Function to update rewrite stages
   * @param {Function} setRewriteProgress - Function to update rewrite progress
   * @param {Function} setRewriteDialogOpen - Function to control dialog visibility
   * @param {Function} setRewriteData - Function to set rewrite result data
   * @param {Function} setRewriteError - Function to set rewrite error
   * @param {Function} setRewriteLoading - Function to set rewrite loading state
   */
  async rewriteCV(parsedCV, { 
    setRewriteStages, 
    setRewriteProgress, 
    setRewriteDialogOpen, 
    setRewriteData,
    setRewriteError,
    setRewriteLoading
  }) {
    if (!this.checkAuthentication()) return;
    
    try {
      // Set loading state
      setRewriteLoading(true);
      setRewriteError(null);
      setRewriteProgress(0);
      setRewriteDialogOpen(true);
      
      // Update the first stage
      this.updateRewriteStage(setRewriteStages, 1, true, false);
      setRewriteProgress(10);
      
      // First, ensure we have the parsed CV data
      if (!parsedCV || !parsedCV.parsed_data) {
        setRewriteError('CV data not available. Please try reloading the page.');
        return;
      }
      
      // Extract data from the parsed CV in the format expected by the rewrite service
      const parsedData = parsedCV.parsed_data;
      
      // Show progress for session creation
      await new Promise(resolve => setTimeout(resolve, 500)); // Small delay for UI
      setRewriteProgress(20);
      
      try {
        // Use the existing AI CV rewrite session creation endpoint
        const sessionResponse = await axiosInstance.post('/api/ai_cv_parser/rewrite/create_session/', 
          { 
            data: {
              parsed_cv_id: this.cvId,
              source_type: 'parsed_cv',
              professional_summary: parsedData.summary || parsedData.professional_summary || '',
              experience: parsedData.experience || [],
              skills: Array.isArray(parsedData.skills) 
                ? parsedData.skills 
                : typeof parsedData.skills === 'string' 
                  ? parsedData.skills 
                  : '',
              industry: parsedData.industry || 'technology'
            }
          },
          {
            headers: this.getAuthHeaders()
          }
        );
        
        const sessionId = sessionResponse.data.session_id;
        
        // Mark first stage complete and start second stage
        this.updateRewriteStage(setRewriteStages, 1, false, true);
        this.updateRewriteStage(setRewriteStages, 2, true, false);
        setRewriteProgress(40);
        
        // Process the rewrite session
        await new Promise(resolve => setTimeout(resolve, 500)); // Small delay for UI
        
        try {
          // Start content improvement stage
          this.updateRewriteStage(setRewriteStages, 2, false, true);
          this.updateRewriteStage(setRewriteStages, 3, true, false);
          setRewriteProgress(60);
          
          const rewriteResponse = await axiosInstance.post(`/api/ai_cv_parser/rewrite/process/${sessionId}/`, 
            {},
            {
              headers: this.getAuthHeaders(),
              timeout: 60000 // Increase timeout to 60s for this operation
            }
          );
          
          // Complete third stage and start final stage
          this.updateRewriteStage(setRewriteStages, 3, false, true);
          this.updateRewriteStage(setRewriteStages, 4, true, false);
          setRewriteProgress(80);
          
          // Complete processing
          await new Promise(resolve => setTimeout(resolve, 500)); // Small delay for UI
          this.updateRewriteStage(setRewriteStages, 4, false, true);
          setRewriteProgress(100);
          
          // Store the rewrite data
          setRewriteData(rewriteResponse.data);
          
          // Navigate to the CV Writer with the new CV after a short delay
          if (rewriteResponse.data && rewriteResponse.data.new_cv_id) {
            const newCvId = rewriteResponse.data.new_cv_id;
            
            // Set up polling to verify the CV exists before redirecting
            let pollAttempts = 0;
            const maxPollAttempts = 3; // Reduced poll attempts before trying alternative approach
            const pollInterval = 2000; // 2 seconds between polls
            
            const pollForCV = async () => {
              try {
                console.log(`Poll attempt ${pollAttempts + 1} for CV ${newCvId}`);
                
                // Check if the CV exists in the backend
                const cvCheckResponse = await axiosInstance.get(`/api/cv_writer/cv/${newCvId}/`, {
                  headers: this.getAuthHeaders(),
                  validateStatus: status => status < 500 // Consider 404 as valid response
                });
                
                if (cvCheckResponse.status === 200) {
                  // CV exists, proceed with navigation
                  console.log(`CV with ID ${newCvId} found, navigating to editor`);
                  setRewriteProgress(100);
                  
                  // Add a small additional delay before navigation for better user experience
                  setTimeout(() => {
                    this.navigate(`/cv-writer/edit/${newCvId}`);
                  }, 1500);
                  
                  return true; // Successfully found CV
                } else {
                  // CV doesn't exist yet, continue polling if attempts remain
                  pollAttempts++;
                  
                  if (pollAttempts >= maxPollAttempts) {
                    // Max attempts reached, but let's try to create a CV directly from the rewrite data
                    console.log(`CV with ID ${newCvId} not found after ${maxPollAttempts} attempts. Creating CV directly from rewrite data.`);
                    
                    // Show a message to the user
                    setRewriteError('CV creation is taking longer than expected. Trying an alternative approach...');
                    setRewriteProgress(85);
                    
                    // Try to create a CV directly from the rewrite data
                    const createdCvId = await this.createCVFromRewriteData(rewriteResponse.data);
                    
                    if (createdCvId) {
                      // Successfully created CV using our fallback approach
                      console.log(`Successfully created CV with ID ${createdCvId} using fallback approach`);
                      setRewriteError(null);
                      setRewriteProgress(100);
                      
                      setTimeout(() => {
                        this.navigate(`/cv-writer/edit/${createdCvId}`);
                      }, 1500);
                      
                      return true;
                    } else {
                      // Fallback approach also failed, redirect to dashboard
                      console.error('Fallback CV creation also failed');
                      setRewriteError('Unable to create CV. Redirecting to dashboard.');
                      
                      setTimeout(() => {
                        this.navigate('/dashboard');
                      }, 3000);
                      
                      return false;
                    }
                  } else {
                    // Continue polling
                    console.log(`CV not found yet, retry in ${pollInterval/1000}s (attempt ${pollAttempts}/${maxPollAttempts})`);
                    setTimeout(pollForCV, pollInterval);
                    setRewriteProgress(80 + (pollAttempts * 4)); // Increment progress during polling
                    return null; // Still polling
                  }
                }
              } catch (error) {
                console.error('Error verifying CV existence:', error);
                
                pollAttempts++;
                if (pollAttempts >= maxPollAttempts) {
                  // Try fallback approach on error too
                  console.log('Error during polling, trying direct CV creation');
                  
                  setRewriteError('Connection issue detected. Trying an alternative approach...');
                  setRewriteProgress(85);
                  
                  // Try to create a CV directly from the rewrite data
                  const createdCvId = await this.createCVFromRewriteData(rewriteResponse.data);
                  
                  if (createdCvId) {
                    // Successfully created CV using our fallback approach
                    console.log(`Successfully created CV with ID ${createdCvId} using fallback approach`);
                    setRewriteError(null);
                    setRewriteProgress(100);
                    
                    setTimeout(() => {
                      this.navigate(`/cv-writer/edit/${createdCvId}`);
                    }, 1500);
                    
                    return true;
                  } else {
                    setRewriteError('Unable to create CV. Redirecting to dashboard.');
                    setTimeout(() => {
                      this.navigate('/dashboard');
                    }, 3000);
                    return false;
                  }
                } else {
                  // Continue polling on error
                  setTimeout(pollForCV, pollInterval);
                  return null; // Still polling
                }
              }
            };
            
            // Start the polling after a small initial delay (allow backend to complete operations)
            setTimeout(() => {
              pollForCV();
            }, 2000); // Reduced initial wait time
            
          } else {
            // Handle the case where no new_cv_id was returned but we have rewritten content
            if (rewriteResponse.data && (rewriteResponse.data.rewritten || rewriteResponse.data.improved_sections)) {
              console.log('No CV ID returned, but rewrite data exists. Creating CV directly.');
              setRewriteError('Creating your CV directly from the rewritten content...');
              setRewriteProgress(85);
              
              // Try to create a CV directly with the rewritten content
              const createdCvId = await this.createCVFromRewriteData(rewriteResponse.data);
              
              if (createdCvId) {
                console.log(`Successfully created CV with ID ${createdCvId} from rewrite data`);
                setRewriteError(null);
                setRewriteProgress(100);
                
                setTimeout(() => {
                  this.navigate(`/cv-writer/edit/${createdCvId}`);
                }, 1500);
              } else {
                setRewriteError('Could not create CV. Redirecting to dashboard.');
                setTimeout(() => {
                  this.navigate('/dashboard');
                }, 3000);
              }
            } else {
              setRewriteError('CV was rewritten but no ID was returned. Please check your CV list.');
              setTimeout(() => {
                this.navigate('/dashboard');
              }, 3000);
            }
          }
        } catch (processError) {
          console.error('Error processing CV rewrite:', processError);
          const errorMessage = processError.response?.data?.detail || 
                             processError.response?.data?.error || 
                             'Failed to process CV rewrite. Please try again later.';
          setRewriteError(errorMessage);
          this.resetRewriteStages(setRewriteStages);
          setRewriteProgress(0);
        }
      } catch (sessionError) {
        console.error('Error creating CV rewrite session:', sessionError);
        const errorMessage = sessionError.response?.data?.detail || 
                          sessionError.response?.data?.error || 
                          'Failed to create CV rewrite session. Please try again later.';
        setRewriteError(errorMessage);
        this.resetRewriteStages(setRewriteStages);
        setRewriteProgress(0);
      }
    } finally {
      setRewriteLoading(false);
    }
  }
  
  /**
   * Create a new CV directly from rewrite data
   * This serves as a fallback when the backend CV creation fails
   */
  async createCVFromRewriteData(rewriteData) {
    if (!this.checkAuthentication()) return null;
    
    try {
      console.log('Creating CV directly from rewrite data:', rewriteData);
      
      // Extract the improved sections
      const improvedSections = rewriteData.rewritten || rewriteData.improved_sections || {};
      
      // Extract personal info if available in the rewrite data
      const personalInfo = rewriteData.personal_info || rewriteData.cv_data || {};
      
      // Prepare CV data structure with all required fields
      const cvData = {
        // Required personal information fields - use data if available or defaults
        first_name: personalInfo.first_name || 'First',
        last_name: personalInfo.last_name || 'Last',
        address: personalInfo.address || 'Address',
        city: personalInfo.city || 'City',
        country: personalInfo.country || 'Country',
        contact_number: personalInfo.contact_number || 'Contact Number',
        
        // Metadata fields
        title: personalInfo.title || 'CV from Rewrite',
        description: 'Created from AI-improved content',
        status: 'draft',
        visibility: 'private',
        additional_information: improvedSections.professional_summary || personalInfo.additional_information || ''
      };
      
      console.log('Sending CV create request with data:', cvData);
      
      // Create a new CV
      const cvResponse = await axiosInstance.post('/api/cv_writer/cv/', cvData, {
        headers: this.getAuthHeaders()
      });
      
      if (!cvResponse.data || !cvResponse.data.id) {
        throw new Error('Failed to create CV - no ID returned');
      }
      
      const cvId = cvResponse.data.id;
      console.log(`Created new CV with ID: ${cvId}`);
      
      // Add professional summary if available
      if (improvedSections.professional_summary) {
        try {
          await axiosInstance.post('/api/cv_writer/professional-summary/', {
            cv: cvId,
            summary: improvedSections.professional_summary
          }, {
            headers: this.getAuthHeaders()
          });
          console.log('Added professional summary');
        } catch (err) {
          console.error('Error adding professional summary:', err);
          // Continue even if this fails
        }
      }
      
      // Add experiences if available
      if (improvedSections.experience && Array.isArray(improvedSections.experience)) {
        for (const exp of improvedSections.experience) {
          try {
            const expData = {
              cv: cvId,
              user: null, // This will be filled by the backend based on authenticated user
              job_title: exp.job_title || 'Job Title',
              company_name: exp.company_name || 'Company',
              job_description: exp.description || exp.job_description || '',
              achievements: exp.achievements || '',
              start_date: exp.start_date || null,
              end_date: exp.end_date || null,
              current: exp.current || !exp.end_date || false,
              employment_type: exp.employment_type || 'Full-time'
            };
            
            await axiosInstance.post('/api/cv_writer/experience/', expData, {
              headers: this.getAuthHeaders()
            });
          } catch (err) {
            console.error('Error adding experience:', err);
            // Continue with other experiences even if one fails
          }
        }
        console.log(`Added ${improvedSections.experience.length} experiences`);
      }
      
      // Add skills if available
      if (improvedSections.skills) {
        try {
          // Parse skills from text if needed
          const skillsText = improvedSections.skills;
          const skillLines = skillsText.split('\n').filter(line => line.trim());
          
          for (const line of skillLines) {
            // Skip headers and formatting
            if (line.startsWith('#') || line.startsWith('*') || line.length < 3) continue;
            
            // Extract skill name and level
            let skillName = line.trim();
            let skillLevel = 'Intermediate';
            
            // Try to parse skill level if formatted as "Name - Level" or "Name (Level)"
            if (line.includes(' - ')) {
              const parts = line.split(' - ');
              skillName = parts[0].trim();
              if (parts.length > 1) skillLevel = parts[1].trim();
            } else if (line.includes('(') && line.includes(')')) {
              const parts = line.split('(');
              skillName = parts[0].trim();
              skillLevel = parts[1].replace(')', '').trim();
            }
            
            // Limit number of skills to avoid overload
            if (skillName && skillName.length > 2) {
              try {
                await axiosInstance.post('/api/cv_writer/skill/', {
                  cv: cvId,
                  skill_name: skillName.substring(0, 100),
                  skill_level: skillLevel.substring(0, 100)
                }, {
                  headers: this.getAuthHeaders()
                });
              } catch (e) {
                console.error(`Error adding skill ${skillName}:`, e);
                // Continue with other skills even if one fails
              }
            }
          }
          console.log('Added skills from rewrite data');
        } catch (err) {
          console.error('Error processing skills:', err);
        }
      }
      
      return cvId;
    } catch (error) {
      console.error('Error creating CV from rewrite data:', error);
      // If we have response details, log them for debugging
      if (error.response && error.response.data) {
        console.error('Error details:', error.response.data);
      }
      return null;
    }
  }
  
  /**
   * Helper method to update a specific rewrite stage
   * 
   * @param {Function} setRewriteStages - Function to update stages
   * @param {number} stageId - ID of the stage to update
   * @param {boolean} active - Whether the stage is active
   * @param {boolean} completed - Whether the stage is completed
   */
  updateRewriteStage(setRewriteStages, stageId, active, completed) {
    setRewriteStages(prevStages => {
      return prevStages.map(stage => {
        if (stage.id === stageId) {
          return { ...stage, active, completed };
        }
        return stage;
      });
    });
  }
  
  /**
   * Reset all rewrite stages
   * 
   * @param {Function} setRewriteStages - Function to update stages
   */
  resetRewriteStages(setRewriteStages) {
    setRewriteStages(prevStages => {
      return prevStages.map(stage => ({ ...stage, active: false, completed: false }));
    });
  }

  /**
   * Save the CV as PDF
   */
  async saveCVAsPDF() {
    if (!this.checkAuthentication()) return;
    
    try {
      this.onOperationStart();
      
      const response = await axiosInstance.get(`/api/cv_parser/parser/${this.cvId}/download/`, {
        headers: this.getAuthHeaders(),
        responseType: 'blob'
      });
      
      // Create a blob URL from the PDF data
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      // Create a link element and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `cv_${this.cvId}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      
      toast.success('CV downloaded successfully!');
    } catch (error) {
      console.error('Error downloading CV:', error);
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.error || 
                          'Failed to download CV. Please try again later.';
      this.onError(errorMessage);
    } finally {
      this.onOperationEnd();
    }
  }

  /**
   * Transfer the CV to the editor
   */
  async transferToEditor() {
    if (!this.checkAuthentication()) return;
    
    try {
      this.onOperationStart();
      
      const response = await axiosInstance.post(`/api/cv_parser/parser/${this.cvId}/transfer-to-writer/`, {}, {
        headers: this.getAuthHeaders()
      });
      
      if (response.data && response.data.cv_id) {
        toast.success('CV transferred to editor successfully!');
        this.navigate(`/cv-writer/edit/${response.data.cv_id}`);
      } else {
        throw new Error('Invalid response from transfer endpoint');
      }
    } catch (error) {
      console.error('Error transferring CV to editor:', error);
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.error || 
                          'Failed to transfer CV to editor. Please try again later.';
      this.onError(errorMessage);
    } finally {
      this.onOperationEnd();
    }
  }
}

export default CVParserService;
