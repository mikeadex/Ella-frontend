import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TiptapEditor from './TiptapEditor';
import { toast } from 'react-hot-toast';
import blogService from '../../services/blogService';
import FeaturedImageUploader from './FeaturedImageUploader';
import PropTypes from 'prop-types';

const BlogPostEditor = ({ isEditing = false }) => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const autoSaveTimerRef = useRef(null);
  const lastSavedRef = useRef(Date.now());
  
  const [loading, setLoading] = useState(isEditing);
  const [post, setPost] = useState({
    title: '',
    content: '',
    excerpt: '',
    tldr: '',
    category_id: '',
    tag_ids: [],
    status: 'draft',
    is_featured: false,
    featured_image: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: ''
  });
  
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newTagName, setNewTagName] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [showNewTagInput, setShowNewTagInput] = useState(false);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  
  // Fetch categories and tags on component mount
  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const [categoriesData, tagsData] = await Promise.all([
          blogService.getCategories(),
          blogService.getTags()
        ]);
        
        setCategories(categoriesData.results || []);
        setTags(tagsData.results || []);
        
        // If editing, fetch the post data
        if (isEditing && slug) {
          const postData = await blogService.getPostBySlug(slug);
          setPost({
            ...postData,
            category_id: postData.category?.id || '',
            tag_ids: postData.tags?.map(tag => tag.id) || []
          });
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching form data:', error);
        toast.error('Failed to load form data');
        setLoading(false);
      }
    };
    
    fetchFormData();
    
    // Clean up auto-save timer
    return () => {
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current);
      }
    };
  }, [isEditing, slug]);
  
  // Set up auto-save
  useEffect(() => {
    if (!loading && post.id) {
      autoSaveTimerRef.current = setInterval(() => {
        // Only auto-save if changes were made since last save
        if (Date.now() - lastSavedRef.current > 30000) { // 30 seconds
          handleAutoSave();
        }
      }, 60000); // Check every minute
    }
    
    return () => {
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current);
      }
    };
  }, [loading, post.id]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPost(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    lastSavedRef.current = Date.now();
  };
  
  const handleContentChange = (newContent) => {
    setPost(prev => ({ ...prev, content: newContent }));
    lastSavedRef.current = Date.now();
  };
  
  const handleTLDRChange = (newTLDR) => {
    setPost(prev => ({ ...prev, tldr: newTLDR }));
    lastSavedRef.current = Date.now();
  };
  
  const handleFeaturedImageChange = (imageUrl) => {
    setPost(prev => ({ ...prev, featured_image: imageUrl }));
    lastSavedRef.current = Date.now();
  };
  
  const handleTagChange = (tagId) => {
    setPost(prev => {
      const tagIds = [...prev.tag_ids];
      
      if (tagIds.includes(tagId)) {
        return { ...prev, tag_ids: tagIds.filter(id => id !== tagId) };
      } else {
        return { ...prev, tag_ids: [...tagIds, tagId] };
      }
    });
    lastSavedRef.current = Date.now();
  };
  
  const handleAutoSave = async () => {
    // Only auto-save if we have a title and some content
    if (post.title && post.content && post.id) {
      try {
        const savedPost = await blogService.saveDraft(post);
        setLastSaved(new Date());
        lastSavedRef.current = Date.now();
      } catch (error) {
        console.error('Auto-save failed:', error);
        // Don't show toast for auto-save failures to avoid disrupting the user
      }
    }
  };
  
  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error('Please enter a category name');
      return;
    }
    
    try {
      const category = await blogService.createCategory({ name: newCategoryName.trim() });
      setCategories(prev => [...prev, category]);
      setPost(prev => ({ ...prev, category_id: category.id }));
      setNewCategoryName('');
      setShowNewCategoryInput(false);
      toast.success('Category created successfully');
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('Failed to create category');
    }
  };
  
  const handleCreateTag = async () => {
    if (!newTagName.trim()) {
      toast.error('Please enter a tag name');
      return;
    }
    
    try {
      const tag = await blogService.createTag({ name: newTagName.trim() });
      setTags(prev => [...prev, tag]);
      setPost(prev => ({ ...prev, tag_ids: [...prev.tag_ids, tag.id] }));
      setNewTagName('');
      setShowNewTagInput(false);
      toast.success('Tag created successfully');
    } catch (error) {
      console.error('Error creating tag:', error);
      toast.error('Failed to create tag');
    }
  };
  
  const validatePost = () => {
    if (!post.title.trim()) {
      toast.error('Please enter a title');
      return false;
    }
    
    if (!post.content.trim()) {
      toast.error('Please write some content');
      return false;
    }
    
    if (!post.category_id) {
      toast.error('Please select a category');
      return false;
    }
    
    if (post.excerpt && post.excerpt.length > 500) {
      toast.error('Excerpt must be 500 characters or less');
      return false;
    }
    
    if (post.status === 'published' && !post.excerpt.trim()) {
      toast.error('Please provide an excerpt for your published post');
      return false;
    }
    
    return true;
  };
  
  const handleSaveDraft = async () => {
    try {
      setSaving(true);
      const draft = { ...post, status: 'draft' };
      
      let result;
      if (isEditing && post.id) {
        result = await blogService.updatePost(post.id, draft);
        toast.success('Draft updated successfully');
      } else {
        result = await blogService.createPost(draft);
        toast.success('Draft created successfully');
      }
      
      setPost(prev => ({ ...prev, id: result.id, slug: result.slug }));
      setLastSaved(new Date());
      lastSavedRef.current = Date.now();
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error(error.response?.data?.detail || 'Failed to save draft');
    } finally {
      setSaving(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePost()) {
      return;
    }
    
    // If publishing, make sure we have required fields
    if (post.status === 'published') {
      if (!post.tldr.trim()) {
        toast.error('Please provide a TLDR summary for your published post');
        return;
      }
    }
    
    try {
      setSaving(true);
      
      let result;
      if (isEditing && post.id) {
        // We need to pass the entire post object which contains the slug
        // The updatePost function now uses the slug for lookup, not the ID
        result = await blogService.updatePost(post.slug, post);
        toast.success('Post updated successfully');
      } else {
        result = await blogService.createPost(post);
        toast.success('Post created successfully');
      }
      
      navigate(`/blog/${result.slug}`);
    } catch (error) {
      console.error('Error saving post:', error);
      // Improved error handling to show more specific details
      const errorMessage = error.response?.data?.detail || 
                          (Object.values(error.response?.data || {})[0] || 
                          'Failed to save post');
      toast.error(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
    } finally {
      setSaving(false);
    }
  };
  
  const togglePreview = () => {
    setPreviewMode(!previewMode);
    if (!previewMode) {
      // Save current state as draft before preview
      handleSaveDraft();
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (previewMode) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            Preview: {post.title}
          </h1>
          <button
            type="button"
            onClick={togglePreview}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i className="fas fa-edit mr-2"></i> Back to Editor
          </button>
        </div>
        
        {post.featured_image && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <img 
              src={post.featured_image} 
              alt={post.title} 
              className="w-full h-auto object-cover"
            />
          </div>
        )}
        
        {post.tldr && (
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
            <h2 className="text-xl font-bold mb-3 text-blue-800 dark:text-blue-300">TLDR</h2>
            <div className="prose dark:prose-invert" dangerouslySetInnerHTML={{ __html: post.tldr }} />
          </div>
        )}
        
        <div className="prose dark:prose-invert prose-lg max-w-none">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
          {isEditing ? 'Edit Post' : 'Create New Post'}
        </h1>
        
        {lastSaved && (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Last saved: {lastSaved.toLocaleTimeString()}
          </span>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            Post Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={post.title}
            onChange={handleChange}
            placeholder="Enter a compelling title..."
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xl"
            required
          />
        </div>
        
        {/* Featured Image */}
        <FeaturedImageUploader 
          value={post.featured_image}
          onChange={handleFeaturedImageChange}
          postId={post.id}
        />
        
        {/* Excerpt */}
        <div>
          <label htmlFor="excerpt" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            Short Excerpt
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={post.excerpt}
            onChange={handleChange}
            placeholder="A brief description of your post (displayed in cards and previews)..."
            rows="2"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        {/* TLDR */}
        <div>
          <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            TLDR Summary
          </label>
          <TiptapEditor 
            content={post.tldr}
            onChange={handleTLDRChange}
            placeholder="Write a concise summary of the key points of your article..."
            postId={post.id}
          />
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            This will be displayed at the top of your article as a summary.
          </p>
        </div>
        
        {/* Main Content Editor */}
        <div>
          <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            Content
          </label>
          <TiptapEditor 
            content={post.content}
            onChange={handleContentChange}
            placeholder="Start writing your story..."
            postId={post.id}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Category */}
          <div>
            <label htmlFor="category_id" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            {showNewCategoryInput ? (
              <div className="flex">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="New category name..."
                  className="flex-1 px-4 py-3 rounded-l-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={handleCreateCategory}
                  className="px-4 py-3 bg-green-600 text-white rounded-r-lg hover:bg-green-700 transition-colors"
                >
                  Add
                </button>
              </div>
            ) : (
              <div className="flex">
                <select
                  id="category_id"
                  name="category_id"
                  value={post.category_id}
                  onChange={handleChange}
                  className="flex-1 px-4 py-3 rounded-l-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowNewCategoryInput(true)}
                  className="px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-r-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  <i className="fas fa-plus"></i>
                </button>
              </div>
            )}
          </div>
          
          {/* Status & Featured */}
          <div className="space-y-4">
            <div>
              <label htmlFor="status" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={post.status}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_featured"
                name="is_featured"
                checked={post.is_featured}
                onChange={handleChange}
                className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
              />
              <label htmlFor="is_featured" className="ml-2 text-gray-700 dark:text-gray-300">
                Feature this post
              </label>
            </div>
          </div>
        </div>
        
        {/* Tags */}
        <div>
          <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tags
          </label>
          
          {showNewTagInput ? (
            <div className="flex mb-4">
              <input
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="New tag name..."
                className="flex-1 px-4 py-2 rounded-l-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <button
                type="button"
                onClick={handleCreateTag}
                className="px-4 py-2 bg-green-600 text-white rounded-r-lg hover:bg-green-700 transition-colors"
              >
                Add
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowNewTagInput(true)}
              className="mb-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <i className="fas fa-plus mr-2"></i>
              Add New Tag
            </button>
          )}
          
          <div className="flex flex-wrap gap-2 p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
            {tags.map((tag) => (
              <label key={tag.id} className="inline-flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                <input
                  type="checkbox"
                  checked={post.tag_ids.includes(tag.id)}
                  onChange={() => handleTagChange(tag.id)}
                  className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300 mr-2"
                />
                <span className="text-gray-700 dark:text-gray-300">{tag.name}</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* SEO Section (Collapsible) */}
        <details className="border border-gray-300 dark:border-gray-700 rounded-lg p-4">
          <summary className="text-lg font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
            SEO Options
          </summary>
          <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="meta_title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Meta Title
              </label>
              <input
                type="text"
                id="meta_title"
                name="meta_title"
                value={post.meta_title}
                onChange={handleChange}
                placeholder="Custom SEO title (optional)"
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            
            <div>
              <label htmlFor="meta_description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Meta Description
              </label>
              <textarea
                id="meta_description"
                name="meta_description"
                value={post.meta_description}
                onChange={handleChange}
                placeholder="Custom SEO description (optional)"
                rows="2"
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            
            <div>
              <label htmlFor="meta_keywords" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Meta Keywords
              </label>
              <input
                type="text"
                id="meta_keywords"
                name="meta_keywords"
                value={post.meta_keywords}
                onChange={handleChange}
                placeholder="Comma-separated keywords (optional)"
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </details>
        
        {/* Action Buttons */}
        <div className="flex flex-wrap justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/blog')}
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          
          <button
            type="button"
            onClick={togglePreview}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <i className="fas fa-eye mr-2"></i>
            Preview
          </button>
          
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={saving}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Draft'}
          </button>
          
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {saving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Publishing...
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane mr-2"></i>
                {post.status === 'published' ? 'Publish' : 'Save'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

BlogPostEditor.propTypes = {
  isEditing: PropTypes.bool
};

export default BlogPostEditor;
