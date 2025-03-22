import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';
import * as blogService from '../../services/blogService';

/**
 * Image uploader component for the Tiptap editor
 */
const ImageUploader = ({ onImageUploaded, postId = null }) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  
  // Handle file selection
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file is an image
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }
    
    try {
      setUploading(true);
      
      // Upload image
      const imageUrl = await blogService.uploadImage(file, postId);
      
      // Notify parent component
      if (onImageUploaded) {
        onImageUploaded(imageUrl);
      }
      
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  // Trigger file selection
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
        disabled={uploading}
      />
      <button
        type="button"
        onClick={handleButtonClick}
        disabled={uploading}
        className="flex items-center justify-center px-3 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="Upload Image"
      >
        {uploading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Uploading...
          </>
        ) : (
          <>
            <i className="fas fa-image mr-1"></i>
            Image
          </>
        )}
      </button>
    </div>
  );
};

ImageUploader.propTypes = {
  onImageUploaded: PropTypes.func.isRequired,
  postId: PropTypes.number
};

export default ImageUploader;
