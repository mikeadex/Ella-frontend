import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { FiEye, FiHeart, FiMessageCircle, FiShare2 } from 'react-icons/fi';

const PostAnalytics = ({ data }) => {
  // Ensure data exists and has expected shape
  if (!data) {
    return null;
  }

  const metrics = [
    {
      icon: <FiEye className="w-5 h-5" />,
      label: 'Views',
      value: data.views || 0,
      color: 'text-blue-500'
    },
    {
      icon: <FiHeart className="w-5 h-5" />,
      label: 'Likes',
      value: data.likes || 0,
      color: 'text-red-500'
    },
    {
      icon: <FiMessageCircle className="w-5 h-5" />,
      label: 'Comments',
      value: data.comments || 0,
      color: 'text-green-500'
    },
    {
      icon: <FiShare2 className="w-5 h-5" />,
      label: 'Shares',
      value: data.shares || 0,
      color: 'text-purple-500'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map(({ icon, label, value, color }) => (
          <motion.div
            key={label}
            whileHover={{ scale: 1.02 }}
            className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <div className={`${color} mb-2`}>{icon}</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {typeof value === 'number' ? value.toLocaleString() : '0'}
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
                key={`${referrer.source || 'unknown'}-${index}`}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-gray-600 dark:text-gray-400">
                  {referrer.source || 'Direct'}
                </span>
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2 overflow-hidden">
                    <div
                      className="bg-blue-500 h-full rounded-full"
                      style={{
                        width: `${referrer.percentage || 0}%`
                      }}
                    />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {referrer.count || 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {data.popularDays && data.popularDays.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Popular Days
          </h4>
          <div className="flex justify-between h-24 items-end">
            {data.popularDays.map((day, index) => (
              <div key={`${day.date || 'unknown'}-${index}`} className="flex flex-col items-center">
                <div
                  className="w-8 bg-indigo-500 rounded-t-sm"
                  style={{
                    height: `${Math.max((day.count || 0) / (data.maxDayCount || 1) * 100, 10)}%`,
                    opacity: day.isWeekend ? 0.7 : 1
                  }}
                />
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {day.label || '?'}
                </div>
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
    views: PropTypes.number,
    likes: PropTypes.number,
    comments: PropTypes.number,
    shares: PropTypes.number,
    topReferrers: PropTypes.arrayOf(
      PropTypes.shape({
        source: PropTypes.string,
        count: PropTypes.number,
        percentage: PropTypes.number
      })
    ),
    popularDays: PropTypes.arrayOf(
      PropTypes.shape({
        date: PropTypes.string,
        label: PropTypes.string,
        count: PropTypes.number,
        isWeekend: PropTypes.bool
      })
    ),
    maxDayCount: PropTypes.number
  }).isRequired
};

export default PostAnalytics;