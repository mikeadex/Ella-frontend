import { useState } from 'react';
import PropTypes from 'prop-types';

const BlogCommentForm = ({ onSubmit, parentId = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    content: '',
    parent: parentId
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.content.trim()) {
      setError('All fields are required');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const result = await onSubmit(formData);
      if (result) {
        setSuccess(true);
        // Reset form after successful submission
        setFormData({
          name: '',
          email: '',
          content: '',
          parent: parentId
        });
      } else {
        setError('Unable to submit your comment. Please try again later.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
      console.error('Comment submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {success ? (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
          <p className="font-medium">Thank you for your comment!</p>
          <p className="mt-1">Your comment has been submitted and is now pending review.</p>
          <button 
            onClick={() => setSuccess(false)}
            className="mt-3 text-sm font-medium text-green-700 hover:text-green-900"
          >
            Add another comment
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            {parentId ? 'Leave a Reply' : 'Join the Conversation'}
          </h4>
          
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email * (will not be published)
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Your Comment *
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              All comments are reviewed before publication
            </p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Post Comment'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

BlogCommentForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  parentId: PropTypes.number
};

export default BlogCommentForm;
