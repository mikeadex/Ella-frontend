import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import blogService from '../../services/blogService';
import LoadingSpinner from '../../components/LoadingSpinner';
import BlogPagination from './components/BlogPagination';
import { truncateText } from '../../utils/textUtils';
import BlogImage from '../../components/Blog/BlogImage';
import { getPostImageUrl } from '../../utils/imageUtils';

const BlogSearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query.trim()) {
        setPosts([]);
        setTotalResults(0);
        setTotalPages(1);
        return;
      }
      
      setIsLoading(true);
      try {
        const data = await blogService.searchPosts(query, currentPage, 9);
        setPosts(data.results);
        setTotalResults(data.count);
        setTotalPages(Math.ceil(data.count / 9));
        setError(null);
      } catch (err) {
        console.error('Error searching posts:', err);
        setError('Failed to perform search. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSearchResults();
    // Reset to page 1 when query changes
    if (searchParams.get('page') !== currentPage.toString()) {
      setCurrentPage(1);
    }
  }, [query]);
  
  // Update search results when page changes
  useEffect(() => {
    if (query.trim()) {
      const fetchPageResults = async () => {
        setIsLoading(true);
        try {
          const data = await blogService.searchPosts(query, currentPage, 9);
          setPosts(data.results);
          setTotalResults(data.count);
          setTotalPages(Math.ceil(data.count / 9));
          
          // Update URL with current page
          searchParams.set('page', currentPage.toString());
          setSearchParams(searchParams);
        } catch (err) {
          console.error('Error fetching search page results:', err);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchPageResults();
    }
  }, [currentPage]);
  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newQuery = formData.get('search');
    
    if (newQuery.trim()) {
      searchParams.set('q', newQuery);
      searchParams.delete('page');
      setSearchParams(searchParams);
    }
  };
  
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Search Hero Section */}
      <div className="bg-gradient-to-r from-gray-700 to-gray-900 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {query ? `Search Results for "${query}"` : 'Blog Search'}
          </h1>
          
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto">
            <div className="flex shadow-lg rounded-lg overflow-hidden">
              <input
                type="search"
                name="search"
                defaultValue={query}
                placeholder="Search for articles..."
                className="w-full px-5 py-3 text-gray-700 focus:outline-none"
              />
              <button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 transition-colors"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <LoadingSpinner size="large" />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center">
            <p className="text-red-600">{error}</p>
          </div>
        ) : query && posts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No Results Found</h2>
            <p className="text-gray-600 mb-6">
              We couldn't find any articles matching "{query}". Try using different keywords or browse our categories.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/blog"
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                Browse All Posts
              </Link>
              <Link
                to="/blog/tags"
                className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
              >
                View Tags
              </Link>
            </div>
          </div>
        ) : query ? (
          <>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Found {totalResults} {totalResults === 1 ? 'result' : 'results'} for "{query}"
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col h-full"
                >
                  <div className="relative h-48 w-full overflow-hidden rounded-lg">
                    <BlogImage
                      src={getPostImageUrl(post)}
                      alt={post.title}
                      className="absolute inset-0"
                    />
                  </div>
                  
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="mb-3 flex items-center">
                      {post.category && (
                        <Link 
                          to={`/blog/category/${post.category.slug}`}
                          className="text-sm text-blue-600 font-medium hover:text-blue-800"
                        >
                          {post.category.name}
                        </Link>
                      )}
                      {post.category && post.published_at && (
                        <span className="mx-2 text-gray-300">•</span>
                      )}
                      {post.published_at && (
                        <span className="text-sm text-gray-500">
                          {format(new Date(post.published_at), 'MMM d, yyyy')}
                        </span>
                      )}
                    </div>
                    
                    <Link 
                      to={`/blog/${post.slug}`}
                      className="text-xl font-bold text-gray-800 mb-2 hover:text-blue-600 transition-colors"
                    >
                      {post.title}
                    </Link>
                    
                    <p className="text-gray-600 mb-4 flex-grow">
                      {truncateText(post.excerpt || '', 120)}
                    </p>
                    
                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="mb-4 flex flex-wrap gap-2">
                        {post.tags.slice(0, 3).map(tag => (
                          <Link 
                            key={tag.id} 
                            to={`/blog/tag/${tag.slug}`}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200"
                          >
                            {tag.name}
                          </Link>
                        ))}
                        {post.tags.length > 3 && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            +{post.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                    
                    <div className="mt-auto pt-4 flex justify-between items-center">
                      <div className="flex items-center text-sm text-gray-500">
                        <span>{post.view_count || 0} views</span>
                        <span className="mx-2">•</span>
                        <span>{post.comment_count || 0} comments</span>
                      </div>
                      
                      <Link 
                        to={`/blog/${post.slug}`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        Read More →
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Pagination */}
            <BlogPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Search Our Blog</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Enter a search term above to find articles, tips, and insights from our blog.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/blog"
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                Browse All Posts
              </Link>
              <Link
                to="/blog/tags"
                className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
              >
                View Tags
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default BlogSearchPage;
