import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { FiEye, FiHeart, FiMessageCircle, FiShare2 } from 'react-icons/fi';

const PostAnalytics = ({ data }) => {
  const metrics = [
    {
      icon: <FiEye className="w-5 h-5" />,
      label: 'Views',
      value: data.views,
      color: 'text-blue-500'
    },
    {
      icon: <FiHeart className="w-5 h-5" />,
      label: 'Likes',
      value: data.likes,
      color: 'text-red-500'
    },
    {
      icon: <FiMessageCircle className="w-5 h-5" />,
      label: 'Comments',
      value: data.comments,
      color: 'text-green-500'
    },
    {
      icon: <FiShare2 className="w-5 h-5" />,
      label: 'Shares',
      value: data.shares,
      color: 'text-purple-500'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-gray-800/90 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700/50 mt-8"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Post Analytics
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map(({ icon, label, value, color }) => (
          <motion.div
            key={label}
            whileHover={{ scale: 1.02 }}
            className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <div className={`${color} mb-2`}>{icon}</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {value.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
          </motion.div>
        ))}
      </div>
      
      {data.topReferrers && data.topReferrers.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Top Referrers
          </h4>
          <div className="space-y-2">
            {data.topReferrers.map((referrer, index) => (
              <div
                key={referrer.source}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-gray-600 dark:text-gray-400">
                  {referrer.source}
                </span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {referrer.count} visits
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

PostAnalytics.propTypes = {
  data: PropTypes.shape({
    views: PropTypes.number.isRequired,
    likes: PropTypes.number.isRequired,
    comments: PropTypes.number.isRequired,
    shares: PropTypes.number.isRequired,
    topReferrers: PropTypes.arrayOf(
      PropTypes.shape({
        source: PropTypes.string.isRequired,
        count: PropTypes.number.isRequired
      })
    )
  }).isRequired
};

export default PostAnalytics; 