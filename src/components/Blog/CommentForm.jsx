import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';
import blogService from '../../services/blogService';

const CommentForm = ({ postId }) => {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      showToast('Please log in to comment', 'warning');
      return;
    }

    if (!comment.trim()) {
      showToast('Please enter a comment', 'warning');
      return;
    }

    try {
      setIsSubmitting(true);
      await blogService.addComment(postId, comment);
      setComment('');
      showToast('Comment added successfully', 'success');
    } catch (error) {
      showToast(error.message || 'Failed to add comment', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-gray-800/90 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700/50"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Your Comment
          </label>
          <textarea
            id="comment"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={isAuthenticated ? "What are your thoughts?" : "Please log in to comment"}
            disabled={!isAuthenticated || isSubmitting}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          />
        </div>

        <div className="flex items-center justify-between">
          {isAuthenticated && user && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Commenting as <span className="font-medium">{user.name || user.email}</span>
            </p>
          )}
          <motion.button
            type="submit"
            disabled={!isAuthenticated || isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`px-6 py-2 rounded-lg bg-blue-600 text-white font-medium 
              ${isAuthenticated ? 'hover:bg-blue-700' : 'opacity-60 cursor-not-allowed'}
              transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Submitting...
              </span>
            ) : (
              'Submit Comment'
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

CommentForm.propTypes = {
  postId: PropTypes.string.isRequired,
};

export default CommentForm; 