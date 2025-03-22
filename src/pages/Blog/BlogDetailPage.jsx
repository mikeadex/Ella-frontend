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
import { calculateReadingTime } from '../../utils/textUtils';

const processContent = (content) => {
  if (!content) return '';

  // Start with sanitizing content for security
  let sanitizedContent = DOMPurify.sanitize(content);
  
  // **FIRST PRIORITY**: Fix the specific issue with HTML tags showing as text in summaries
  // Look for the exact pattern in the screenshot: raw HTML tags shown as text
  sanitizedContent = sanitizedContent.replace(/<h2>Summary<\/h2>\s*<p>&lt;h2&gt;TLDR Summary&lt;\/h2&gt;([\s\S]*?)(?=<\/p>|<h|$)/g, (match, content) => {
    // Extract the actual content, clean up all the HTML entities
    const cleanContent = content
      .replace(/&lt;[^&]*?&gt;/g, '') // Remove all HTML tags shown as text
      .replace(/&nbsp;/g, ' ')       // Replace &nbsp; with spaces
      .trim();
      
    // Split by paragraphs if they exist (they'll now be clean text)
    const paragraphs = cleanContent.split(/\n+/).filter(p => p.trim().length > 0);
    
    // Format as a clean summary box
    return `
      <div class="summary-box">
        <h4>Summary</h4>
        ${paragraphs.length > 0 
          ? `<ul>${paragraphs.map(p => `<li>${p.trim()}</li>`).join('')}</ul>`
          : '<p>Key summary points for this article.</p>'
        }
      </div>
    `;
  });
  
  // General case for any summary with HTML tags displayed as text
  sanitizedContent = sanitizedContent.replace(/<h\d>Summary<\/h\d>\s*<p>(&lt;[^&]*?&gt;)([\s\S]*?)(?=<\/p>|<h|$)/g, (match, htmlTag, content) => {
    // Clean the content
    const cleanContent = content
      .replace(/&lt;[^&]*?&gt;/g, '') // Remove any HTML tags shown as text
      .replace(/&nbsp;/g, ' ')       // Replace &nbsp; with spaces
      .trim();
      
    // If there are colon-separated sections, format as list items
    if (cleanContent.includes(':')) {
      const items = cleanContent.split(/\s*(?:&nbsp;)*[•·]|\n+/).filter(item => item.trim().length > 0);
      
      return `
        <div class="summary-box">
          <h4>Summary</h4>
          <ul>
            ${items.map(item => `<li>${item.trim()}</li>`).join('')}
          </ul>
        </div>
      `;
    }
    
    // Otherwise just use paragraphs
    return `
      <div class="summary-box">
        <h4>Summary</h4>
        <p>${cleanContent}</p>
      </div>
    `;
  });
  
  // Handle any remaining raw HTML tags in any other element
  const tagRegex = /<([^>]+)>(&lt;[^&]*?&gt;)([\s\S]*?)(?=<\/\1>)/g;
  sanitizedContent = sanitizedContent.replace(tagRegex, (match, tag, htmlTag, content) => {
    // Clean the content
    const cleanContent = content
      .replace(/&lt;[^&]*?&gt;/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ')       // Replace &nbsp;
      .trim();
      
    return `<${tag}>${cleanContent}`;
  });
  
  // Rest of the processing (from previous implementations)
  // Continued support for other formats...
  
  // Process any remaining HTML entities that shouldn't be displayed as text
  sanitizedContent = sanitizedContent
    .replace(/&lt;/g, "")
    .replace(/&gt;/g, "")
    .replace(/&nbsp;/g, " ");
  
  return sanitizedContent;
};

const getSafeExcerpt = (text) => {
  if (!text) return '';
  // Create a temporary div to render and extract text content
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = text;
  return tempDiv.textContent || tempDiv.innerText || '';
};

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
  const [computedContent, setComputedContent] = useState('');
  const contentRef = useRef(null);

  const cleanupSummaryContent = () => {
    if (!contentRef.current) return;
    
    // Find all summary boxes in the content
    const summaryBoxes = contentRef.current.querySelectorAll('.summary-box, .summary');
    
    summaryBoxes.forEach(box => {
      // Get paragraphs that might contain raw HTML tags
      const paragraphs = box.querySelectorAll('p');
      
      paragraphs.forEach(p => {
        // Check if paragraph contains HTML entities
        const text = p.innerHTML;
        if (text.includes('&lt;') || text.includes('&gt;') || text.includes('&nbsp;')) {
          // Create a temp div to decode entities
          const temp = document.createElement('div');
          temp.innerHTML = text;
          
          // Get the raw text without HTML
          const plainText = temp.textContent
            .replace(/^<\/?[^>]+(>|$)/g, '') // Remove any leading HTML tags
            .replace(/<\/?[^>]+(>|$)/g, '')  // Remove any remaining HTML tags
            .trim();
            
          // Replace the paragraph content with clean text
          p.innerHTML = plainText;
        }
      });
      
      // If box has h2 elements with raw HTML, fix those too
      const headings = box.querySelectorAll('h1, h2, h3, h4, h5, h6');
      headings.forEach(heading => {
        if (heading.innerHTML.includes('&lt;') || heading.innerHTML.includes('&gt;')) {
          const temp = document.createElement('div');
          temp.innerHTML = heading.innerHTML;
          const plainText = temp.textContent
            .replace(/^<\/?[^>]+(>|$)/g, '')
            .replace(/<\/?[^>]+(>|$)/g, '')
            .trim();
          heading.innerHTML = plainText;
        }
      });
      
      // Ensure proper structure: if this is just text without structure, format it
      if (box.textContent.trim() && !box.querySelector('ul') && box.querySelectorAll('p').length <= 1) {
        // Create a single paragraph if no structure exists
        const text = box.textContent.replace('Summary', '').trim();
        
        // Clear the box and rebuild it properly
        box.innerHTML = `
          <h4>Summary</h4>
          <p>${text}</p>
        `;
      }
    });
  };

  useEffect(() => {
    if (post?.content && contentRef.current) {
      // Small timeout to ensure the DOM is fully rendered
      setTimeout(cleanupSummaryContent, 0);
    }
  }, [post?.content]);

  useEffect(() => {
    if (post?.content) {
      // Process the content and set it
      const processed = processContent(post.content);
      setComputedContent(processed);
      
      // Additional DOM processing for summaries after render
      setTimeout(() => {
        const contentElement = document.querySelector('.blog-content');
        if (contentElement) {
          // Find any remaining summary boxes with HTML tags showing
          const summaryElements = contentElement.querySelectorAll('.summary-box');
          summaryElements.forEach(summary => {
            // Check if the summary contains HTML tags shown as text
            const html = summary.innerHTML;
            if (html.includes('&lt;') || html.includes('&gt;')) {
              // Clean the content
              const cleanHtml = html
                .replace(/&lt;[^&]*?&gt;/g, '')
                .replace(/&nbsp;/g, ' ')
                .replace(/<\/?p>/g, '');
              
              // Recreate the summary box with clean content
              summary.innerHTML = `
                <h4>Summary</h4>
                <p>${cleanHtml.replace(/<h4>Summary<\/h4>/g, '').trim()}</p>
              `;
            }
          });
        }
      }, 100);
    }
  }, [post?.content]);

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
        
        // Fetch analytics (only attempt for authenticated users to avoid 403 errors)
        if (isAuthenticated) {
          try {
            const analyticsData = await blogService.getPostAnalytics(slug);
            setAnalytics(analyticsData);
          } catch (analyticsError) {
            console.log('Analytics not available - user may not have permission');
            // Don't set an error for the whole page just because analytics failed
            setAnalytics(null);
          }
        }
        
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
  }, [slug, isAuthenticated]);
  
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
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <Helmet>
        <title>{post.title} | Ella's Blog</title>
        <meta name="description" content={getSafeExcerpt(post.excerpt || post.title)} />
      </Helmet>
      
      <div className="mx-auto px-4 py-8 max-w-[700px]">
        <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 dark:text-white mb-3 leading-tight">
          {post.title}
        </h1>
        
        <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-6 border-b border-gray-200 dark:border-gray-800 pb-6">
          <span>{post.published_at && format(new Date(post.published_at), 'MMM d, yyyy')}</span>
          <span className="mx-2">•</span>
          <span>{calculateReadingTime(post.content)} min read</span>
          {post.view_count > 0 && (
            <>
              <span className="mx-2">•</span>
              <span>{post.view_count} {post.view_count === 1 ? 'view' : 'views'}</span>
            </>
          )}
          {isAuthenticated && (
            <>
              <span className="mx-2">•</span>
              <button 
                onClick={() => navigate(`/blog/edit/${post.slug}`)}
                className="text-blue-500 hover:text-blue-700"
              >
                Edit
              </button>
            </>
          )}
        </div>
        
        {post.featured_image && (
          <div className="my-6">
            <img 
              src={getPostImageUrl(post)} 
              alt={post.title}
              className="w-full h-auto rounded-lg"
            />
            {post.featured_image_caption && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center italic">
                {post.featured_image_caption}
              </p>
            )}
          </div>
        )}
        
        <div 
          ref={contentRef}
          className="prose lg:prose-lg dark:prose-invert mx-auto blog-content"
          dangerouslySetInnerHTML={{ 
            __html: computedContent 
          }}
        />
        
        <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <Link
                  key={tag.slug}
                  to={`/blog/tag/${tag.slug}`}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;
