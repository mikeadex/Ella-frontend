import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import DOMPurify from 'dompurify';
import { useAuth } from '../../context/AuthContext';

// Services
import blogService from '../../services/blogService';

// Components
import LoadingSpinner from '../../components/LoadingSpinner';
import BlogFeaturedSection from './components/BlogFeaturedSection';
import BlogPagination from './components/BlogPagination';
import BlogSearchBar from './components/BlogSearchBar';
import BlogCategorySidebar from './components/BlogCategorySidebar';
import BlogSubscriptionBox from './components/BlogSubscriptionBox';
import BlogImage from '../../components/Blog/BlogImage';

// Utils
import { truncateText } from '../../utils/textUtils';
import { getPostImageUrl } from '../../utils/imageUtils';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const BlogHome = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Refs for animation elements
  const gradientRef = useRef(null);
  const headerRef = useRef(null);
  
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    const fetchBlogData = async () => {
      setIsLoading(true);
      try {
        // Fetch regular posts with proper parameters
        const postsData = await blogService.getPosts({
          page: currentPage,
          pageSize: 6
        });
        setPosts(postsData.results);
        setTotalPages(Math.ceil(postsData.count / 6));
        
        // Fetch featured posts
        const featuredData = await blogService.getFeaturedPosts(3);
        
        // Verify we have actual posts, not promises
        if (featuredData.results && Array.isArray(featuredData.results)) {
          console.log('Featured posts data:', featuredData.results.slice(0, 3));
          
          // Ensure all posts have an id for keying in React components
          const validFeaturedPosts = featuredData.results
            .filter(post => post && typeof post === 'object')
            .map((post, index) => ({ ...post, id: post.id || `featured-${index}` }));
            
          setFeaturedPosts(validFeaturedPosts);
        }
        
        // Fetch categories
        const categoriesData = await blogService.getCategories();
        setCategories(categoriesData.results || categoriesData);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching blog data:', err);
        setError('Failed to load blog posts. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBlogData();
  }, [currentPage]);
  
  // Set up animations
  useEffect(() => {
    if (!headerRef.current || !gradientRef.current) return;

    // Initialize gradient
    const updateGradient = (progress = 0, x = 50, y = 50) => {
      const colors = {
        start: {
          c1: '14, 165, 233', // sky-500
          c2: '139, 92, 246', // violet-500
          c3: '99, 102, 241'  // indigo-500
        },
        end: {
          c1: '59, 130, 246', // blue-500
          c2: '168, 85, 247',  // purple-500 
          c3: '236, 72, 153'   // pink-500
        }
      };
      
      // Interpolate between colors based on scroll progress
      const interpolateColor = (c1, c2, progress) => {
        const [r1, g1, b1] = c1.split(',').map(Number);
        const [r2, g2, b2] = c2.split(',').map(Number);
        
        const r = Math.round(r1 + (r2 - r1) * progress);
        const g = Math.round(g1 + (g2 - g1) * progress);
        const b = Math.round(b1 + (b2 - b1) * progress);
        
        return `${r}, ${g}, ${b}`;
      };
      
      // Calculate interpolated colors
      const currentC1 = interpolateColor(colors.start.c1, colors.end.c1, progress);
      const currentC2 = interpolateColor(colors.start.c2, colors.end.c2, progress);
      const currentC3 = interpolateColor(colors.start.c3, colors.end.c3, progress);
      
      const opacity = document.documentElement.classList.contains('dark') ? '0.25' : '0.15';
      
      gradientRef.current.style.background = `
        radial-gradient(circle at ${x}% ${y}%, 
          rgba(${currentC1}, ${opacity}) 0%, 
          rgba(${currentC2}, ${opacity}) 15%, 
          rgba(${currentC3}, ${opacity}) 30%, 
          transparent 45%
        )
      `;
    };
    
    // Initial update
    updateGradient();
    
    // Set up GSAP scroll trigger
    const trigger = ScrollTrigger.create({
      trigger: headerRef.current,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        updateGradient(self.progress);
      },
    });
    
    // Handle mouse movement for interactive gradient
    const handleMouseMove = (e) => {
      if (!headerRef.current) return;
      
      const rect = headerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      updateGradient(ScrollTrigger.getById('header')?.progress || 0, x, y);
    };
    
    headerRef.current.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      trigger.kill();
      headerRef.current?.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
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
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
      {/* Interactive Gradient Background */}
      <div 
        ref={gradientRef} 
        className="absolute inset-0 pointer-events-none z-0"
      />
      
      {/* Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-5 dark:opacity-10 z-0" />
      
      <div className="relative z-10">
        {/* Hero Section */}
        <section 
          ref={headerRef}
          className="relative pt-20 pb-24 overflow-hidden"
        >
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-12">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl sm:text-5xl font-bold text-gray-800 dark:text-white mb-4"
              >
                Ella Blog
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl text-slate-600 dark:text-gray-300 max-w-3xl mx-auto"
              >
                Insights, advice, and latest trends in CV writing, career development, and job search strategies.
              </motion.p>

              {/* Categories Pills */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap justify-center gap-2 mt-8"
              >
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/blog/category/${category.slug}`}
                    className="px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
                  >
                    {category.name}
                  </Link>
                ))}
              </motion.div>
            </div>
            
            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="max-w-xl mx-auto mt-8"
            >
              <BlogSearchBar />
            </motion.div>
          </div>
        </section>

        {/* Featured Posts Section */}
        <section className="py-16 bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-800/50">
          <div className="container mx-auto px-4">
            <BlogFeaturedSection featuredPosts={featuredPosts} />
          </div>
        </section>
        
        {/* Main Content */}
        <main className="container mx-auto px-4 py-16">
          {/* New Post Button */}
          {isAuthenticated && (
            <div className="mb-12 text-center">
              <Link 
                to="/blog/create" 
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create New Post
              </Link>
            </div>
          )}

          {error ? (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg border border-red-200 mb-6">
              {error}
            </div>
          ) : (
            <>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  Latest Articles
                </h2>
              </div>
              
              {posts.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-10 text-center shadow-sm">
                  <p className="text-gray-600 dark:text-gray-300">No articles found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {posts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-gray-700"
                    >
                      {/* Always show image container, with or without featured image */}
                      <div className="relative h-48 w-full overflow-hidden">
                        <BlogImage
                          src={getPostImageUrl(post)}
                          alt={post.title}
                          className="absolute inset-0"
                        />
                      </div>
                      
                      <div className="p-6 flex flex-col flex-grow">
                        <div className="mb-3 flex items-center">
                          <Link 
                            to={`/blog/category/${post.category?.slug}`}
                            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                          >
                            {post.category?.name || 'Uncategorized'}
                          </Link>
                          <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {post.published_at 
                              ? format(new Date(post.published_at), 'MMM d, yyyy') 
                              : 'Draft'}
                          </span>
                        </div>
                        
                        <Link 
                          to={`/blog/${post.slug}`}
                          className="group"
                        >
                          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {post.title}
                          </h3>
                        </Link>
                        
                        <div 
                          className="text-gray-600 dark:text-gray-300 mb-4 flex-grow"
                          dangerouslySetInnerHTML={{ 
                            __html: DOMPurify.sanitize(truncateText(post.excerpt || '', 120)) 
                          }}
                        />
                        
                        {/* Tags Section */}
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.map(tag => (
                              <Link 
                                key={tag.id || tag}
                                to={`/blog/tag/${typeof tag === 'object' ? tag.slug : tag}`}
                                className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                              >
                                #{typeof tag === 'object' ? tag.name : tag}
                              </Link>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium">
                              {post.author?.first_name?.charAt(0) || post.author?.username?.charAt(0) || 'A'}
                            </div>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {post.author?.first_name 
                                ? `${post.author.first_name} ${post.author.last_name || ''}` 
                                : post.author?.username || 'Anonymous'}
                            </p>
                            <div className="flex space-x-1 text-sm text-gray-500 dark:text-gray-400">
                              <span>{post.comment_count || 0} comments</span>
                              <span>•</span>
                              <span>{post.view_count || 0} views</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
              
              {/* Pagination */}
              <div className="mt-12">
                <BlogPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </>
          )}
        </main>

        {/* Newsletter Subscription */}
        <section className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900">
          <div className="container mx-auto px-4">
            <BlogSubscriptionBox />
          </div>
        </section>
      </div>
    </div>
  );
};

export default BlogHome;
