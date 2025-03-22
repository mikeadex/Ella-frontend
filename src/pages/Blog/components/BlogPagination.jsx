import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const BlogPagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) {
    return null;
  }

  const renderPageButton = (pageNumber, label, isDisabled = false) => {
    const isActive = pageNumber === currentPage;
    
    return (
      <motion.button
        key={pageNumber}
        onClick={() => onPageChange(pageNumber)}
        disabled={isDisabled}
        whileHover={!isActive && !isDisabled ? { scale: 1.05 } : {}}
        whileTap={!isDisabled ? { scale: 0.95 } : {}}
        className={`relative inline-flex items-center justify-center w-10 h-10 text-sm font-medium rounded-md
          ${isActive 
            ? 'z-10 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' 
            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'}
          ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900`}
      >
        {label || pageNumber}
      </motion.button>
    );
  };

  // Calculate page numbers to show
  const getPageNumbers = () => {
    // Always show the first and last pages, and up to 3 pages around the current page
    const pageNumbers = [];
    const showEllipsisStart = currentPage > 3;
    const showEllipsisEnd = currentPage < totalPages - 2;
    
    if (totalPages <= 7) {
      // If 7 or fewer pages, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);
      
      // Show ellipsis or additional pages
      if (showEllipsisStart) {
        pageNumbers.push('ellipsis-start');
      } else {
        pageNumbers.push(2);
      }
      
      // Pages around current page
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = startPage; i <= endPage; i++) {
        if (i > 2 && i < totalPages - 1) {
          pageNumbers.push(i);
        }
      }
      
      // Show ellipsis or additional pages
      if (showEllipsisEnd) {
        pageNumbers.push('ellipsis-end');
      } else if (totalPages > 2) {
        pageNumbers.push(totalPages - 1);
      }
      
      // Always show last page
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  return (
    <motion.nav 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center mt-10 mb-6" 
      aria-label="Pagination"
    >
      <div className="flex items-center gap-2 p-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
        <motion.button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          whileHover={currentPage !== 1 ? { scale: 1.05 } : {}}
          whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
          className="relative inline-flex items-center justify-center w-10 h-10 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          <span className="sr-only">Previous</span>
          <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </motion.button>
        
        <div className="flex gap-2 mx-1">
          {getPageNumbers().map((page, index) => {
            if (page === 'ellipsis-start' || page === 'ellipsis-end') {
              return (
                <span
                  key={page}
                  className="relative inline-flex items-center justify-center w-10 h-10 text-sm font-medium text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-800 rounded-md"
                >
                  &hellip;
                </span>
              );
            }
            return renderPageButton(page);
          })}
        </div>
        
        <motion.button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          whileHover={currentPage !== totalPages ? { scale: 1.05 } : {}}
          whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
          className="relative inline-flex items-center justify-center w-10 h-10 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          <span className="sr-only">Next</span>
          <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </motion.button>
      </div>
    </motion.nav>
  );
};

BlogPagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired
};

export default BlogPagination;
