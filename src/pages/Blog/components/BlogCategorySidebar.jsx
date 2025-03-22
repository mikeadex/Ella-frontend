import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const BlogCategorySidebar = ({ categories = [] }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700"
    >
      <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">Categories</h3>
      
      {categories.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No categories found.</p>
      ) : (
        <ul className="space-y-1">
          {categories.map((category) => (
            <motion.li 
              key={category.id} 
              className="group"
              whileHover={{ x: 3 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Link 
                to={`/blog/category/${category.slug}`}
                className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
              >
                <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors font-medium">
                  {category.name}
                </span>
                {category.post_count !== undefined && (
                  <motion.span 
                    className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 group-hover:bg-blue-100 dark:group-hover:bg-blue-800/30 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-200 rounded-full px-2.5 py-1 text-xs font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {category.post_count}
                  </motion.span>
                )}
              </Link>
            </motion.li>
          ))}
        </ul>
      )}
      
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Link 
          to="/blog/tags"
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm flex items-center group"
        >
          <span className="group-hover:underline">View all tags</span>
          <motion.svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 ml-1" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            initial={{ x: 0 }}
            animate={{ x: 0 }}
            whileHover={{ x: 3 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </motion.svg>
        </Link>
      </div>
    </motion.div>
  );
};

BlogCategorySidebar.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
      post_count: PropTypes.number
    })
  )
};

export default BlogCategorySidebar;
