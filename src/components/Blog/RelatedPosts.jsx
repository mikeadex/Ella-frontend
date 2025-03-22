import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import BlogImage from '../Blog/BlogImage';

const RelatedPosts = ({ posts }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {posts.map((post, index) => (
        <motion.div 
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          whileHover={{ y: -4 }}
          className="bg-white dark:bg-gray-800/90 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700/50"
        >
          <Link to={`/blog/${post.slug}`} className="block group">
            {post.featured_image && (
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                <BlogImage 
                  src={post.featured_image} 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            <div className="p-4">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {post.title}
              </h4>
              {post.excerpt && (
                <p className="mt-2 text-gray-600 dark:text-gray-200 text-sm line-clamp-2">
                  {post.excerpt}
                </p>
              )}
              <div className="mt-3 flex items-center justify-between">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {post.published_at && format(new Date(post.published_at), 'MMMM d, yyyy')}
                </div>
                {post.category && (
                  <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                    {post.category.name}
                  </span>
                )}
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};

RelatedPosts.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      excerpt: PropTypes.string,
      featured_image: PropTypes.string,
      published_at: PropTypes.string,
      category: PropTypes.shape({
        name: PropTypes.string.isRequired
      })
    })
  ).isRequired
};

export default RelatedPosts; 