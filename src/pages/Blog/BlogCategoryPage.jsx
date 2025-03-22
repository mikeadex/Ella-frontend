import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import blogService from '../../services/blogService';
import LoadingSpinner from '../../components/LoadingSpinner';
import { truncateText } from '../../utils/textUtils';
import { getPostImageUrl } from '../../utils/imageUtils';
import BlogCategorySidebar from './components/BlogCategorySidebar';
import BlogPagination from './components/BlogPagination';
import BlogImage from '../../components/Blog/BlogImage';

const BlogCategoryPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  useEffect(() => {
    const fetchCategoryData = async () => {
      setIsLoading(true);
      try {
        // Fetch all categories first to populate the sidebar
        const categoriesData = await blogService.getCategories();
        setCategories(categoriesData.results || categoriesData);
        
        // Find the current category from the list
        const currentCategory = (categoriesData.results || categoriesData).find(
          cat => cat.slug === slug
        );
        
        if (!currentCategory) {
          throw new Error('Category not found');
        }
        
        setCategory(currentCategory);
        
        // Fetch posts for this category
        const postsData = await blogService.getPostsByCategory(slug, currentPage, 9);
        setPosts(postsData.results);
        setTotalPages(Math.ceil(postsData.count / 9));
        
        setError(null);
      } catch (err) {
        console.error('Error fetching category data:', err);
        setError('Failed to load category. It may not exist or has been removed.');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (slug) {
      fetchCategoryData();
      // Scroll to top when navigating to a new category
      window.scrollTo(0, 0);
    }
  }, [slug, currentPage]);
  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <LoadingSpinner size="large" />
      </div>
    );
  }
  
  if (error || !category) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center">
          <h2 className="text-2xl font-bold text-red-700 mb-3">Category Not Found</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/blog')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Return to Blog
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Category Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              {category.description}
            </p>
          )}
          <div className="mt-6 text-sm text-white">
            <Link to="/blog" className="hover:text-blue-200 transition-colors">
              Blog
            </Link>
            <span className="mx-2">›</span>
            <span>Category</span>
            <span className="mx-2">›</span>
            <span>{category.name}</span>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Posts Grid */}
          <div className="lg:w-2/3">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {posts.length > 0 
                ? `${category.name} Articles (${category.post_count || posts.length})` 
                : `No articles found in ${category.name}`}
            </h2>
            
            {posts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <p className="text-gray-600 mb-4">
                  There are no articles in this category yet.
                </p>
                <Link
                  to="/blog"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                >
                  Browse all articles
                </Link>
              </div>
            ) : (
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
                      
                      <div className="mt-auto pt-4 flex justify-between items-center">
                        <div className="flex items-center text-sm text-gray-500">
                          <span>{post.view_count} views</span>
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
            )}
            
            {/* Pagination */}
            <BlogPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
          
          {/* Sidebar */}
          <div className="lg:w-1/3 space-y-8">
            <BlogCategorySidebar categories={categories} />
            
            {/* Back to Blog Button */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">Back to Blog</h3>
              <Link 
                to="/blog"
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                View all articles
              </Link>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BlogCategoryPage;
