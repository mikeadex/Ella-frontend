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
   */
  async rewriteCV(parsedCV) {
    if (!this.checkAuthentication()) return;
    
    try {
      this.onOperationStart();
      
      // First, ensure we have the parsed CV data
      if (!parsedCV || !parsedCV.parsed_data) {
        this.onError('CV data not available. Please try reloading the page.');
        return;
      }
      
      // Extract data from the parsed CV in the format expected by the rewrite service
      const parsedData = parsedCV.parsed_data;
      
      // Show loading toast with progress animation
      const loadingToastId = toast.loading('Creating rewrite session...');
      
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
      toast.success('CV rewrite session created successfully!', { id: loadingToastId });
      
      // Create a new processing toast
      const processingToastId = toast.loading('Processing CV rewrite...');
      
      // Process the rewrite session
      try {
        const rewriteResponse = await axiosInstance.post(`/api/ai_cv_parser/rewrite/process/${sessionId}/`, 
          {},
          {
            headers: this.getAuthHeaders(),
            timeout: 60000 // Increase timeout to 60s for this operation
          }
        );
        
        toast.success('CV created successfully!', { id: processingToastId });
        
        // Navigate to the CV Writer with the new CV
        if (rewriteResponse.data && rewriteResponse.data.new_cv_id) {
          this.navigate(`/cv-writer/edit/${rewriteResponse.data.new_cv_id}`);
        } else {
          toast.warning('CV was rewritten but no ID was returned. Please check your CV list.');
        }
      } catch (processError) {
        console.error('Error processing CV rewrite:', processError);
        toast.error('Failed to process CV rewrite. Please try again later.', { id: processingToastId });
        throw processError; // Re-throw to be caught by outer catch block
      }
    } catch (error) {
      console.error('Error rewriting CV:', error);
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.error || 
                          'Failed to rewrite CV. Please try again later.';
      this.onError(errorMessage);
    } finally {
      this.onOperationEnd();
    }
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
