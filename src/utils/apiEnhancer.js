/**
 * API Enhancer - Advanced resilience and error handling for enterprise-scale applications
 * 
 * This utility provides robust request handling for high-scale production applications:
 * - Automatic retries with exponential backoff
 * - Circuit breaking for failing endpoints
 * - Request caching for performance
 * - Comprehensive error handling
 */
import axios from 'axios';

class ApiEnhancer {
  constructor(baseApi) {
    this.api = baseApi;
    this.circuitState = {};
    this.cache = {};
    this.retryDelays = [1000, 2000, 4000, 8000]; // Exponential backoff
  }

  /**
   * Makes a resilient API request with automatic retries and circuit breaking
   */
  async request(method, url, data = null, options = {}) {
    const cacheKey = this._getCacheKey(method, url, data);
    const requestOptions = {
      method,
      url,
      ...options,
    };
    
    if (data) {
      requestOptions.data = data;
    }
    
    // Check if circuit is open for this endpoint
    if (this._isCircuitOpen(url)) {
      console.warn(`Circuit open for ${url}, skipping request`);
      throw new Error(`Service temporarily unavailable. Please try again later.`);
    }
    
    // Check cache for GET requests if caching is enabled
    if (method.toLowerCase() === 'get' && options.cache !== false) {
      const cachedResponse = this._getFromCache(cacheKey);
      if (cachedResponse) {
        console.log(`Cache hit for ${url}`);
        return cachedResponse;
      }
    }
    
    // Attempt the request with retries
    let lastError = null;
    let retryCount = 0;
    const maxRetries = options.maxRetries || 3;
    
    while (retryCount <= maxRetries) {
      try {
        console.log(`Attempt ${retryCount + 1} for ${method.toUpperCase()} ${url}`);
        
        const response = await this.api.request(requestOptions);
        
        // Cache successful GET response if caching is enabled
        if (method.toLowerCase() === 'get' && options.cache !== false) {
          this._saveToCache(cacheKey, response, options.cacheTime);
        }
        
        // Reset circuit breaker on success
        this._closeCircuit(url);
        
        return response;
      } catch (error) {
        lastError = error;
        retryCount++;
        
        // Don't retry certain errors
        if (this._isFatalError(error) || retryCount > maxRetries) {
          break;
        }
        
        // Log the retry
        console.warn(`Request failed, retrying (${retryCount}/${maxRetries}):`, error.message);
        
        // Wait before retrying with exponential backoff
        await this._delay(this.retryDelays[Math.min(retryCount - 1, this.retryDelays.length - 1)]);
      }
    }
    
    // Record failure for circuit breaker
    this._recordFailure(url);
    
    // Format error for better UX
    const enhancedError = this._enhanceError(lastError, url);
    throw enhancedError;
  }
  
  /**
   * Enhanced GET request with resilience features
   */
  async get(url, options = {}) {
    return this.request('get', url, null, options);
  }
  
  /**
   * Enhanced POST request with resilience features
   */
  async post(url, data, options = {}) {
    return this.request('post', url, data, options);
  }
  
  /**
   * Enhanced PUT request with resilience features
   */
  async put(url, data, options = {}) {
    return this.request('put', url, data, options);
  }
  
  /**
   * Enhanced PATCH request with resilience features
   */
  async patch(url, data, options = {}) {
    return this.request('patch', url, data, options);
  }
  
  /**
   * Enhanced DELETE request with resilience features
   */
  async delete(url, options = {}) {
    return this.request('delete', url, null, options);
  }
  
  /**
   * Upload file with progress tracking and resilience
   */
  async uploadFile(url, file, onProgress = null, additionalData = {}, options = {}) {
    const formData = new FormData();
    formData.append('file', file);
    
    // Add any additional fields
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, value);
    });
    
    const uploadOptions = {
      ...options,
      headers: {
        ...options.headers,
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: onProgress ? 
        progressEvent => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted, progressEvent);
        } : undefined,
    };
    
    return this.post(url, formData, uploadOptions);
  }
  
  // ---- Private helper methods ----
  
  _getCacheKey(method, url, data) {
    return `${method}:${url}:${data ? JSON.stringify(data) : ''}`;
  }
  
  _getFromCache(key) {
    const cached = this.cache[key];
    if (!cached) return null;
    
    // Check if cache is expired
    if (cached.expiresAt && cached.expiresAt < Date.now()) {
      delete this.cache[key];
      return null;
    }
    
    return cached.data;
  }
  
  _saveToCache(key, data, cacheTime = 60000) { // Default 1 minute cache
    this.cache[key] = {
      data,
      expiresAt: Date.now() + cacheTime
    };
  }
  
  _isCircuitOpen(url) {
    const circuit = this.circuitState[url];
    if (!circuit) return false;
    
    // Circuit is open and not ready to try again
    return circuit.status === 'open' && circuit.nextTry > Date.now();
  }
  
  _recordFailure(url) {
    if (!this.circuitState[url]) {
      this.circuitState[url] = {
        status: 'closed',
        failures: 0,
        lastFailure: Date.now(),
        nextTry: null
      };
    }
    
    const circuit = this.circuitState[url];
    circuit.failures += 1;
    circuit.lastFailure = Date.now();
    
    // Open circuit after 5 consecutive failures
    if (circuit.failures >= 5) {
      circuit.status = 'open';
      // Try again after 30 seconds
      circuit.nextTry = Date.now() + 30000;
      console.warn(`Circuit opened for ${url} - too many failures`);
    }
  }
  
  _closeCircuit(url) {
    if (this.circuitState[url]) {
      this.circuitState[url] = {
        status: 'closed',
        failures: 0,
        lastFailure: null,
        nextTry: null
      };
    }
  }
  
  _isFatalError(error) {
    // Don't retry authentication or permission errors
    return error.response && (error.response.status === 401 || 
                             error.response.status === 403 ||
                             error.response.status === 422);
  }
  
  _enhanceError(error, url) {
    // Create a more user-friendly error
    const enhancedError = new Error(
      error.response?.data?.detail || 
      error.message || 
      'An unknown error occurred'
    );
    
    // Add useful debugging information
    enhancedError.originalError = error;
    enhancedError.url = url;
    enhancedError.status = error.response?.status;
    enhancedError.timestamp = new Date().toISOString();
    
    // Add user-friendly message based on error type
    if (error.response?.status === 502 || error.response?.status === 504) {
      enhancedError.userMessage = "The server is currently busy. Please try again in a few moments.";
    } else if (error.code === 'ECONNABORTED') {
      enhancedError.userMessage = "The request took too long to complete. Please try again.";
    } else if (error.message && error.message.includes('Network Error')) {
      enhancedError.userMessage = "We're having trouble connecting to our servers. Please check your connection.";
    }
    
    return enhancedError;
  }
  
  _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Create an enhanced version of the base API
export const createEnhancedApi = (baseApi) => {
  const enhancedApi = new ApiEnhancer(baseApi);
  
  // Return an object with all the request methods
  return {
    get: enhancedApi.get.bind(enhancedApi),
    post: enhancedApi.post.bind(enhancedApi),
    put: enhancedApi.put.bind(enhancedApi),
    patch: enhancedApi.patch.bind(enhancedApi),
    delete: enhancedApi.delete.bind(enhancedApi),
    uploadFile: enhancedApi.uploadFile.bind(enhancedApi),
    request: enhancedApi.request.bind(enhancedApi),
  };
};

export default createEnhancedApi;
