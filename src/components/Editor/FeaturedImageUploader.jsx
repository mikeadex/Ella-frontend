import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';
import * as blogService from '../../services/blogService';
import { fixImageUrl, getFallbackImageUrl } from '../../utils/imageUtils';
import BlogImage from '../Blog/BlogImage';

/**
 * Featured Image uploader component for blog posts
 */
const FeaturedImageUploader = ({ value, onChange, postId = null }) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef(null);
  
  // Update preview URL when value changes
  useEffect(() => {
    if (value) {
      if (typeof value === 'string') {
        // Fix any URL issues for the preview
        setPreviewUrl(fixImageUrl(value));
      } else if (value instanceof File) {
        // Create a local preview URL for File objects
        setPreviewUrl(URL.createObjectURL(value));
        // Clean up the URL when the component unmounts
        return () => URL.revokeObjectURL(previewUrl);
      }
    } else {
      setPreviewUrl('');
    }
  }, [value]);
  
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
      
      // For new posts or draft mode, we'll keep the file object
      // and let the createPost/updatePost functions handle the upload
      if (!postId) {
        // Just pass the File object directly to the parent
        onChange(file);
        toast.success('Image selected and ready for upload');
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        // For existing posts, upload immediately
        const imageUrl = await blogService.uploadImage(file, postId);
        onChange(imageUrl);
        toast.success('Featured image uploaded successfully');
      }
    } catch (error) {
      console.error('Error handling featured image:', error);
      toast.error('Failed to process image. Please try again.');
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  // Remove featured image
  const removeImage = () => {
    if (onChange) {
      onChange('');
    }
    setPreviewUrl('');
    toast.success('Featured image removed');
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="block text-lg font-medium text-gray-700 dark:text-gray-300">
          Featured Image
        </label>
        
        <div className="flex space-x-2">
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
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Uploading...' : value ? 'Change Image' : 'Upload Image'}
          </button>
          
          {value && (
            <button
              type="button"
              onClick={removeImage}
              disabled={uploading}
              className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Remove
            </button>
          )}
        </div>
      </div>
      
      {previewUrl ? (
        <div className="relative mt-2 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 aspect-[16/9]">
          <BlogImage
            src={previewUrl}
            alt="Featured image preview"
            className="w-full h-full object-cover"
          />
          {uploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="text-white">Uploading...</div>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-md h-48">
          <div className="space-y-1 text-center flex flex-col items-center justify-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
              >
                <span onClick={() => fileInputRef.current?.click()}>Upload a file</span>
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              PNG, JPG, GIF up to 5MB
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

FeaturedImageUploader.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(File)
  ]),
  onChange: PropTypes.func.isRequired,
  postId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

export default FeaturedImageUploader;
