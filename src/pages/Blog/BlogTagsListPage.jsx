import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import blogService from '../../services/blogService';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatNumber } from '../../utils/textUtils';

const BlogTagsListPage = () => {
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchTags = async () => {
      try {
        setIsLoading(true);
        const data = await blogService.getTags();
        setTags(data.results || data);
        setError(null);
      } catch (err) {
        console.error('Error fetching tags:', err);
        setError('Failed to load tags. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTags();
  }, []);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Group tags into categories by first letter
  const groupTagsByFirstLetter = (tags) => {
    return tags.reduce((acc, tag) => {
      const firstLetter = tag.name.charAt(0).toUpperCase();
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push(tag);
      return acc;
    }, {});
  };

  const tagGroups = groupTagsByFirstLetter(tags);
  const sortedLetters = Object.keys(tagGroups).sort();

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Blog Tags
          </h1>
          <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
            Browse all topics and find the content that interests you most
          </p>
          <div className="mt-6 text-sm text-white">
            <Link to="/blog" className="hover:text-indigo-200 transition-colors">
              Blog
            </Link>
            <span className="mx-2">›</span>
            <span>All Tags</span>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Try Again
            </button>
          </div>
        ) : tags.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-600 mb-4">
              No tags found.
            </p>
            <Link
              to="/blog"
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              Return to Blog
            </Link>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">
                All Tags ({tags.length})
              </h2>
              <Link
                to="/blog"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Blog
              </Link>
            </div>
            
            {/* Alphabetical Navigation */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-8 overflow-x-auto">
              <div className="flex space-x-2 justify-center">
                {sortedLetters.map(letter => (
                  <a
                    key={letter}
                    href={`#section-${letter}`}
                    className="px-3 py-1 rounded-md text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 font-medium transition-colors"
                  >
                    {letter}
                  </a>
                ))}
              </div>
            </div>
            
            {/* Tags by section */}
            <div className="space-y-8">
              {sortedLetters.map(letter => (
                <motion.div
                  key={letter}
                  id={`section-${letter}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                    {letter}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {tagGroups[letter].map(tag => (
                      <Link
                        key={tag.id}
                        to={`/blog/tag/${tag.slug}`}
                        className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:border-indigo-300 hover:shadow-md transition-all"
                      >
                        <span className="font-medium text-gray-800 group-hover:text-indigo-700">
                          {tag.name}
                        </span>
                        {tag.post_count !== undefined && (
                          <span className="bg-gray-100 text-gray-600 rounded-full px-2 py-1 text-xs">
                            {formatNumber(tag.post_count)}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default BlogTagsListPage;
