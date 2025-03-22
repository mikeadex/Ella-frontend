import axios from 'axios';
import api from '../api';
import { fixImageUrl, getImageFilename } from '../utils/imageUtils';

const BLOG_API_URL = '/api/blog';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Helper function to format image URLs
const formatImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  
  // Use the new fixImageUrl utility function
  return fixImageUrl(imageUrl);
};

// Helper function to ensure image file exists
const getTrustedImageUrl = async (imageUrl) => {
  if (!imageUrl) return null;
  
  const formattedUrl = formatImageUrl(imageUrl);
  
  try {
    // Try to fetch the image using a HEAD request to see if it exists
    const response = await fetch(formattedUrl, { method: 'HEAD' });
    if (response.ok) {
      return formattedUrl;
    }
    
    // If image doesn't exist, try some common variations of the filename
    // This helps with database mismatches in filenames
    if (formattedUrl.includes('/media/blog/images/')) {
      const urlParts = formattedUrl.split('/');
      const filename = urlParts.pop();
      const basePath = urlParts.join('/');
      
      // Try to fetch actual filenames in the directory
      console.info('Image not found at expected path:', formattedUrl);
      console.info('Consider updating the database record to match actual files on disk');
      
      // Fall back to the placeholder image
      return null;
    }
    
    return null;
  } catch (error) {
    console.error('Error checking image URL:', error);
    return null;
  }
};

/**
 * Attempts to find a valid image URL if the original fails to load
 * @param {string} baseUrl - Base URL for the image
 * @param {string} filename - Original filename
 * @returns {Promise<string|null>} - Resolved with valid URL or null
 */
const findAlternativeImage = async (baseUrl, filename) => {
  if (!baseUrl || !filename) return null;
  
  try {
    // First try with the exact filename
    const originalUrl = `${baseUrl}/${filename}`;
    const response = await fetch(originalUrl, { method: 'HEAD' });
    if (response.ok) return originalUrl;
    
    // If the file doesn't exist, try to extract the pattern from the filename
    // Example: "pexels-ron-lach-9829479.jpg" => look for "pexels-ron-lach-*.jpg"
    const filenameParts = filename.split('.');
    const extension = filenameParts.pop();
    
    // Extract the prefix from the filename (e.g., "pexels-ron-lach")
    const baseNameParts = filenameParts.join('.').split('-');
    // Remove the last part (which is usually the number that might be wrong)
    if (baseNameParts.length > 2) {
      baseNameParts.pop();
      const prefix = baseNameParts.join('-');
      
      console.info(`Original image not found: ${filename}. Looking for alternatives with prefix: ${prefix}`);
      
      // For now, just return null and let the UI fallback to the placeholder
      // In a production app, we could try to query the directory for matching files
      return null;
    }
    
    return null;
  } catch (error) {
    console.error('Error finding alternative image:', error);
    return null;
  }
};

// Helper function to format post data including image URLs
const formatPostData = async (post) => {
  if (!post) return null;
  
  let featuredImage = null;
  
  // Try to get a valid featured image URL
  if (post.featured_image_url && post.featured_image_url.trim() !== '') {
    // The backend should now provide a complete URL
    featuredImage = post.featured_image_url;
  } else if (post.featured_image && typeof post.featured_image === 'string' && post.featured_image.trim() !== '') {
    // For backward compatibility with string URLs
    featuredImage = formatImageUrl(post.featured_image);
  }
  
  // Special case for when post.featured_image is a File object (during creation/update)
  // We'll keep it as is and let the createPost/updatePost functions handle it
  const outputFeaturedImage = 
    post.featured_image instanceof File ? post.featured_image : featuredImage;
  
  // Ensure we have some tags
  const tags = Array.isArray(post.tags) ? post.tags : [];
  
  // Convert tag_ids to an empty array if it doesn't exist
  const tagIds = Array.isArray(post.tag_ids) ? post.tag_ids : [];
  
  return {
    ...post,
    featured_image: outputFeaturedImage,
    // Ensure we always have a featured_image_url property for consistency
    featured_image_url: featuredImage,
    // Ensure tags is always an array
    tags: tags,
    // Ensure tag_ids is always an array
    tag_ids: tagIds
  };
};

// Helper to build query params string
const buildQueryParams = (params) => {
  const searchParams = new URLSearchParams();
  
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value);
    }
  }
  
  return searchParams.toString();
};

/**
 * Get blog posts with optional filtering and pagination
 */
const getPosts = async ({ page = 1, pageSize = 10, category, tag, search, author, status, ordering } = {}) => {
  try {
    const queryParams = buildQueryParams({ 
      page, 
      page_size: pageSize, 
      category, 
      tag, 
      search, 
      author, 
      status,
      ordering 
    });
    
    const response = await api.get(`${BLOG_API_URL}/posts/?${queryParams}`);
    
    // Process each post to format image URLs properly
    const data = response.data;
    
    // Format the image URLs in the results
    if (data.results && Array.isArray(data.results)) {
      // Use Promise.all to wait for all formatPostData operations to complete
      const formattedResults = await Promise.all(
        data.results.map(post => formatPostData(post))
      );
      data.results = formattedResults;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    throw error;
  }
};

// Get featured blog posts
const getFeaturedPosts = async (limit = 3) => {
  try {
    const response = await api.get(`${BLOG_API_URL}/posts/featured/?page_size=${limit}`);
    const data = response.data;
    
    // Format the image URLs in the results
    if (data.results && Array.isArray(data.results)) {
      // Use Promise.all to wait for all formatPostData operations to complete
      const formattedResults = await Promise.all(
        data.results.map(post => formatPostData(post))
      );
      data.results = formattedResults;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching featured posts:', error);
    throw error;
  }
};

// Get a single blog post by slug
const getPostBySlug = async (slug) => {
  try {
    const response = await api.get(`${BLOG_API_URL}/posts/${slug}/`);
    return await formatPostData(response.data);
  } catch (error) {
    console.error(`Error fetching post with slug ${slug}:`, error);
    throw error;
  }
};

// Get blog categories
const getCategories = async () => {
  try {
    const response = await api.get(`${BLOG_API_URL}/categories/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching blog categories:', error);
    throw error;
  }
};

// Get posts by category
const getPostsByCategory = async (categorySlug, page = 1, pageSize = 10) => {
  try {
    const response = await api.get(
      `${BLOG_API_URL}/categories/${categorySlug}/posts/?page=${page}&page_size=${pageSize}`
    );
    const data = response.data;
    
    // Format the image URLs in the results
    if (data.results && Array.isArray(data.results)) {
      data.results = data.results.map(formatPostData);
    }
    
    return data;
  } catch (error) {
    console.error(`Error fetching posts for category ${categorySlug}:`, error);
    throw error;
  }
};

// Get blog tags
const getTags = async () => {
  try {
    const response = await api.get(`${BLOG_API_URL}/tags/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching blog tags:', error);
    throw error;
  }
};

// Get posts by tag
const getPostsByTag = async (tagSlug, page = 1, pageSize = 10) => {
  try {
    const response = await api.get(
      `${BLOG_API_URL}/tags/${tagSlug}/posts/?page=${page}&page_size=${pageSize}`
    );
    const data = response.data;
    
    // Format the image URLs in the results
    if (data.results && Array.isArray(data.results)) {
      data.results = data.results.map(formatPostData);
    }
    
    return data;
  } catch (error) {
    console.error(`Error fetching posts for tag ${tagSlug}:`, error);
    throw error;
  }
};

// Add a comment to a post
const addComment = async (postSlug, commentData) => {
  try {
    const response = await api.post(`${BLOG_API_URL}/comments/`, {
      ...commentData,
      post_slug: postSlug
    });
    return response.data;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

// Search blog posts
const searchPosts = async (query, page = 1, pageSize = 10) => {
  try {
    const response = await api.get(
      `${BLOG_API_URL}/posts/?search=${encodeURIComponent(query)}&page=${page}&page_size=${pageSize}`
    );
    const data = response.data;
    
    // Format the image URLs in the results
    if (data.results && Array.isArray(data.results)) {
      data.results = data.results.map(formatPostData);
    }
    
    return data;
  } catch (error) {
    console.error('Error searching posts:', error);
    throw error;
  }
};

/**
 * Create a new blog post
 */
const createPost = async (postData) => {
  try {
    // Log the data being sent to help with debugging
    console.log('Creating post with data:', postData);
    
    const formattedData = await formatPostData(postData);
    
    // Handle featured image if it's a File object
    if (formattedData.featured_image && formattedData.featured_image instanceof File) {
      const formData = new FormData();
      formData.append('image', formattedData.featured_image);
      
      const imageResponse = await api.post(`${BLOG_API_URL}/images/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Save the image URL and remove the file field to prevent validation errors
      formattedData.featured_image_url = imageResponse.data.image_url;
      delete formattedData.featured_image;
    } else if (formattedData.featured_image && typeof formattedData.featured_image === 'string') {
      // If featured_image is already a string URL, move it to featured_image_url
      formattedData.featured_image_url = formattedData.featured_image;
      delete formattedData.featured_image;
    }
    
    console.log('Sending formatted data to server:', formattedData);
    
    const response = await api.post(`${BLOG_API_URL}/posts/`, formattedData);
    return await formatPostData(response.data);
  } catch (error) {
    console.error('Error creating post:', error);
    
    // Enhanced error logging to show the exact validation errors
    if (error.response && error.response.data) {
      console.error('Validation errors:', error.response.data);
    }
    
    throw error;
  }
};

/**
 * Update an existing blog post
 */
const updatePost = async (postId, postData) => {
  try {
    // Log the data being sent to help with debugging
    console.log('Updating post with data:', postData);
    
    const formattedData = await formatPostData(postData);
    
    // Handle featured image if it's a File object
    if (formattedData.featured_image && formattedData.featured_image instanceof File) {
      const formData = new FormData();
      formData.append('image', formattedData.featured_image);
      
      const imageResponse = await api.post(`${BLOG_API_URL}/images/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Save the image URL and remove the file field to prevent validation errors
      formattedData.featured_image_url = imageResponse.data.image_url;
      delete formattedData.featured_image;
    } else if (formattedData.featured_image && typeof formattedData.featured_image === 'string') {
      // If featured_image is already a string URL, move it to featured_image_url
      formattedData.featured_image_url = formattedData.featured_image;
      delete formattedData.featured_image;
    }
    
    console.log('Sending formatted data to server:', formattedData);
    
    // IMPORTANT: The API uses the 'slug' as the lookup field, not 'id'
    // We need to use the slug to identify the post when updating
    const slug = formattedData.slug;
    if (!slug) {
      throw new Error('Post slug is required for updating posts');
    }
    
    const response = await api.put(`${BLOG_API_URL}/posts/${slug}/`, formattedData);
    return await formatPostData(response.data);
  } catch (error) {
    console.error('Error updating post:', error);
    
    // Enhanced error logging to show the exact validation errors
    if (error.response && error.response.data) {
      console.error('Validation errors:', error.response.data);
    }
    
    throw error;
  }
};

/**
 * Delete a blog post
 */
const deletePost = async (postId) => {
  try {
    await api.delete(`${BLOG_API_URL}/posts/${postId}/`);
    return true;
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};

/**
 * Upload a featured image for a blog post
 * @param {File} imageFile - The image file to upload
 * @param {number|null} postId - Optional post ID to associate with the image
 * @returns {Promise<string>} - Promise resolving to the image URL
 */
const uploadImage = async (imageFile, postId = null) => {
  try {
    // Create form data for multipart/form-data upload
    const formData = new FormData();
    formData.append('image', imageFile);
    
    if (postId) {
      formData.append('post', postId);
    }
    
    // Make the upload request to the correct API endpoint
    const response = await api.post(`${BLOG_API_URL}/images/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    // Return the image URL from the response
    return response.data.image_url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

/**
 * Save a blog post as a draft
 * @param {Object} postData - The blog post data
 * @param {Object} draft - Optional existing draft to update
 */
const saveDraft = async (postData, draft = null) => {
  try {
    const formattedData = await formatPostData({
      ...postData,
      status: 'draft'
    });
    
    let response;
    if (draft?.id) {
      response = await api.put(`${BLOG_API_URL}/posts/${draft.id}/`, draft);
    } else {
      response = await api.post(`${BLOG_API_URL}/posts/`, draft);
    }
    return await formatPostData(response.data);
  } catch (error) {
    console.error('Error saving draft:', error);
    throw error;
  }
};

// Create a new category
const createCategory = async (categoryData) => {
  try {
    // Ensure category name is provided
    if (!categoryData || !categoryData.name) {
      throw new Error('Category name is required');
    }
    
    // Check if the name contains only valid characters
    const validNameRegex = /^[a-zA-Z0-9\s\-_]+$/;
    if (!validNameRegex.test(categoryData.name)) {
      throw new Error('Category name can only contain letters, numbers, spaces, hyphens, and underscores');
    }
    
    // Add a description if not provided
    if (!categoryData.description) {
      categoryData.description = `Posts related to ${categoryData.name}`;
    }
    
    console.log('Creating category with data:', categoryData);
    
    const response = await api.post(`${BLOG_API_URL}/categories/`, categoryData);
    return response.data;
  } catch (error) {
    console.error('Error creating category:', error);
    
    // Check for validation errors from the API
    if (error.response && error.response.data) {
      console.error('API error details:', error.response.data);
      
      // Extract specific error messages if available
      if (typeof error.response.data === 'object') {
        const errorMessage = Object.entries(error.response.data)
          .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
          .join('; ');
        throw new Error(errorMessage);
      }
    }
    
    throw error;
  }
};

// Create a new tag
const createTag = async (tagData) => {
  try {
    // Ensure tag name is provided
    if (!tagData || !tagData.name) {
      throw new Error('Tag name is required');
    }
    
    // Check if the name contains only valid characters
    const validNameRegex = /^[a-zA-Z0-9\s\-_]+$/;
    if (!validNameRegex.test(tagData.name)) {
      throw new Error('Tag name can only contain letters, numbers, spaces, hyphens, and underscores');
    }
    
    console.log('Creating tag with data:', tagData);
    
    const response = await api.post(`${BLOG_API_URL}/tags/`, tagData);
    return response.data;
  } catch (error) {
    console.error('Error creating tag:', error);
    
    // Check for validation errors from the API
    if (error.response && error.response.data) {
      console.error('API error details:', error.response.data);
      
      // Extract specific error messages if available
      if (typeof error.response.data === 'object') {
        const errorMessage = Object.entries(error.response.data)
          .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
          .join('; ');
        throw new Error(errorMessage);
      }
    }
    
    throw error;
  }
};

/**
 * Get related posts for a specific post
 */
const getRelatedPosts = async (slug, limit = 3) => {
  try {
    const response = await api.get(`${BLOG_API_URL}/posts/${slug}/related/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching related posts:', error);
    throw error;
  }
};

/**
 * Share a post to a social platform
 */
const sharePost = async (slug, platform = 'twitter') => {
  try {
    const response = await api.post(`${BLOG_API_URL}/posts/${slug}/share/`, {
      platform
    });
    return response.data;
  } catch (error) {
    console.error('Error sharing post:', error);
    throw error;
  }
};

/**
 * Get analytics for a post (staff only)
 */
const getPostAnalytics = async (slug) => {
  try {
    const response = await api.get(`${BLOG_API_URL}/posts/${slug}/analytics/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching post analytics:', error);
    throw error;
  }
};

const blogService = {
  getPosts,
  getFeaturedPosts,
  getPostBySlug,
  getCategories,
  getPostsByCategory,
  getTags,
  getPostsByTag,
  addComment,
  searchPosts,
  createPost,
  updatePost,
  deletePost,
  uploadImage,
  saveDraft,
  createCategory,
  createTag,
  getRelatedPosts,
  sharePost,
  getPostAnalytics,
  findAlternativeImage
};

// Export both as named exports and as default for backward compatibility
export {
  getPosts,
  getFeaturedPosts,
  getPostBySlug,
  getCategories,
  getPostsByCategory,
  getTags,
  getPostsByTag,
  addComment,
  searchPosts,
  createPost,
  updatePost,
  deletePost,
  uploadImage,
  saveDraft,
  createCategory,
  createTag,
  getRelatedPosts,
  sharePost,
  getPostAnalytics,
  findAlternativeImage
};

export default blogService;
