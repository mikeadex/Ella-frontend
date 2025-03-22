import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import DOMPurify from 'dompurify';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';
import * as blogService from '../../services/blogService';
import BlogImage from '../../components/Blog/BlogImage';
import BlogCommentForm from './components/BlogCommentForm';
import BlogCommentList from './components/BlogCommentList';
import CommentForm from '../../components/Blog/CommentForm';
import ShareButtons from '../../components/Blog/ShareButtons';
import RelatedPosts from '../../components/Blog/RelatedPosts';
import PostAnalytics from '../../components/Blog/PostAnalytics';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getPostImageUrl } from '../../utils/imageUtils';

// Register GSAP plugins
// gsap.registerPlugin(ScrollTrigger);

const BlogDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const gradientRef = useRef(null);
  const { isAuthenticated } = useAuth();
  
  // Refs for animation elements
  
  useEffect(() => {
    const fetchPostData = async () => {
      setIsLoading(true);
      try {
        const postData = await blogService.getPostBySlug(slug);
        setPost(postData);
        
        // Fetch related posts by the same category
        if (postData.category) {
          const relatedData = await blogService.getPostsByCategory(postData.category.slug, 1, 3);
          // Filter out the current post
          if (relatedData && relatedData.results && Array.isArray(relatedData.results)) {
            setRelatedPosts(relatedData.results.filter(p => p.id !== postData.id));
          } else {
            setRelatedPosts([]);
          }
        }
        
        // Fetch analytics
        const analyticsData = await blogService.getPostAnalytics(slug);
        setAnalytics(analyticsData);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching post data:', err);
        setError('Failed to load the article. It may not exist or has been removed.');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (slug) {
      fetchPostData();
      // Scroll to top when navigating to a new post
      window.scrollTo(0, 0);
    }
  }, [slug]);
  
  // Set up gradient animation
  useEffect(() => {
    if (!gradientRef.current) return;

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
      
      // Apply the gradient
      gradientRef.current.style.background = `
        radial-gradient(circle at ${x}% ${y}%, 
          rgba(${currentC1}, 0.05) 0%, 
          rgba(${currentC2}, 0.05) 25%, 
          rgba(${currentC3}, 0.05) 50%, 
          rgba(0, 0, 0, 0) 75%
        )
      `;
    };

    // Initial call
    updateGradient();

    // Update on mouse move
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      updateGradient(window.scrollY / (document.body.scrollHeight - window.innerHeight), x, y);
    };

    // Update on scroll
    const handleScroll = () => {
      updateGradient(window.scrollY / (document.body.scrollHeight - window.innerHeight));
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const handleCommentSubmit = async (commentData) => {
    try {
      await blogService.addComment(slug, commentData);
      // Refresh post data to show the new comment
      const updatedPost = await blogService.getPostBySlug(slug);
      setPost(updatedPost);
      return true;
    } catch (error) {
      console.error('Error submitting comment:', error);
      return false;
    }
  };
  
  const handleShare = async (platform) => {
    try {
      await blogService.sharePost(slug, platform);
      toast.success('Post shared successfully!');
    } catch (err) {
      toast.error('Failed to share post');
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <LoadingSpinner size="large" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center dark:bg-red-900/20 dark:border-red-800">
          <h2 className="text-2xl font-bold text-red-700 mb-3 dark:text-red-400">Article Not Found</h2>
          <p className="text-red-600 mb-6 dark:text-red-300">{error}</p>
          <button
            onClick={() => navigate('/blog')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-600"
          >
            Return to Blog
          </button>
        </div>
      </div>
    );
  }
  
  if (!post) return null;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
      {/* Interactive Gradient Background */}
      <div 
        ref={gradientRef} 
        className="absolute inset-0 pointer-events-none z-0"
        aria-hidden="true"
      />
      
      {/* Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-5 dark:opacity-10 z-0" />
      
      {/* Hero Section with Featured Image */}
      <section className="relative">
        {post.featured_image || post.featured_image_url ? (
          <div className="relative h-[400px] w-full overflow-hidden rounded-xl mb-8">
            <BlogImage
              src={getPostImageUrl(post)}
              alt={post.title}
              className="absolute inset-0"
            />
          </div>
        ) : (
          <div className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 py-16">
            <div className="container mx-auto px-4 text-center max-w-3xl">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4"
              >
                {post.title}
              </motion.h1>
              {post.category && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Link 
                    to={`/blog/category/${post.category.slug}`} 
                    className="inline-block bg-white text-blue-600 px-3 py-1 rounded-full text-sm font-medium mb-4"
                  >
                    {post.category.name}
                  </Link>
                </motion.div>
              )}
              <motion.div 
                className="flex items-center justify-center text-white mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <span className="text-sm">
                  {post.published_at && format(new Date(post.published_at), 'MMMM d, yyyy')}
                </span>
                {post.view_count && (
                  <>
                    <span className="mx-2">•</span>
                    <span className="text-sm">{post.view_count} views</span>
                  </>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </section>
      
      {/* Main Content - Centered Layout */}
      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white dark:bg-gray-800/90 rounded-xl shadow-sm p-6 md:p-8 border border-gray-100 dark:border-gray-700/50"
          >
            {/* Author Info */}
            {post.author && (
              <div className="flex items-center mb-8 pb-6 border-b border-gray-200 dark:border-gray-700/50">
                <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-white font-bold text-lg">
                  {post.author.first_name?.charAt(0) || post.author.username?.charAt(0) || 'A'}
                </div>
                <div className="ml-4">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {post.author.first_name 
                      ? `${post.author.first_name} ${post.author.last_name || ''}` 
                      : post.author.username || 'Anonymous'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {post.published_at && format(new Date(post.published_at), 'MMMM d, yyyy')}
                    {post.view_count > 0 && ` • ${post.view_count} ${post.view_count === 1 ? 'view' : 'views'}`}
                  </p>
                </div>
                {isAuthenticated && (
                  <Link 
                    to={`/blog/edit/${post.slug}`} 
                    className="ml-auto px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-sm"
                  >
                    <i className="fas fa-edit mr-1"></i> Edit
                  </Link>
                )}
              </div>
            )}
            
            {/* TLDR Section */}
            {post.tldr && (
              <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border-l-4 border-blue-500 dark:border-blue-400">
                <h4 className="text-lg font-semibold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                  TLDR Summary
                </h4>
                <p className="text-gray-700 dark:text-gray-300">{post.tldr}</p>
              </div>
            )}
            
            <div 
              className="prose prose-lg max-w-none prose-blue dark:prose-invert prose-img:rounded-lg prose-img:mx-auto prose-headings:text-gray-800 dark:prose-headings:text-white prose-p:text-gray-600 dark:prose-p:text-gray-200 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-strong:text-gray-800 dark:prose-strong:text-white prose-li:text-gray-600 dark:prose-li:text-gray-200
              prose-headings:font-semibold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
              prose-h1:mt-8 prose-h2:mt-6 prose-h3:mt-4 prose-p:leading-relaxed
              prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:rounded prose-code:px-1
              prose-blockquote:border-l-4 prose-blockquote:border-blue-500 dark:prose-blockquote:border-blue-400 prose-blockquote:pl-4 prose-blockquote:italic
              prose-img:shadow-md"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
            />
            
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700/50">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <Link 
                      key={tag.id}
                      to={`/blog/tag/${tag.slug}`}
                      className="inline-block bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full px-3 py-1 text-sm transition-colors"
                    >
                      #{tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
            {/* Social Sharing */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700/50">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Share this article</h3>
              <ShareButtons onShare={handleShare} />
            </div>
          </motion.div>
          
          {/* Analytics */}
          {analytics && <PostAnalytics data={analytics} />}
          
          {/* Comments Section */}
          <div className="mt-8">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">Comments</h3>
            
            <CommentForm postId={post.id} />
            
            <div className="mt-8">
              <BlogCommentList comments={post.comments || []} />
            </div>
          </div>
          
          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">Related Articles</h3>
              <RelatedPosts posts={relatedPosts} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BlogDetailPage;
