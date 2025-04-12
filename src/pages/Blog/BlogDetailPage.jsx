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

  // Configure DOMPurify with more permissive settings
  const purifyConfig = {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a', 'ul', 'ol', 'li', 
      'blockquote', 'code', 'pre', 'strong', 'em', 'b', 'i', 'u', 'strike',
      'img', 'div', 'span', 'br', 'hr', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'figure', 'figcaption'
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'class', 'id', 'target', 'style', 'width', 'height',
      'title', 'align', 'bgcolor', 'border', 'cellpadding', 'cellspacing'
    ],
    ALLOW_DATA_ATTR: true,
    KEEP_CONTENT: true,
    ADD_ATTR: ['target'],
    ADD_TAGS: ['iframe'] // Allow iframes for embedded content
  };

  // Sanitize the content while preserving needed HTML
  let sanitizedContent = DOMPurify.sanitize(content, purifyConfig);

  // Fix summary sections while preserving valid HTML
  sanitizedContent = sanitizedContent.replace(
    /<h[2-4]>Summary<\/h[2-4]>\s*<p>(?:&lt;[^&]*?&gt;)?([\s\S]*?)(?=<\/p>|$)/g,
    (match, content) => {
      // Clean the content removing only HTML shown as text
      const cleanContent = content
        .replace(/&lt;[^&]*?&gt;/g, '') // Remove HTML shown as text
        .replace(/&nbsp;/g, ' ')
        .trim();

      // Detect if content has list items
      if (cleanContent.includes('•') || cleanContent.includes('·') || /^\d+\./.test(cleanContent) || cleanContent.includes('-')) {
        const items = cleanContent
          .split(/(?:\s*[•·-]\s*|\s*\d+\.\s*|\n+)/)
          .filter(item => item.trim().length > 0);

        return `
          <div class="summary-box">
            <h4>Summary</h4>
            <ul>
              ${items.map(item => `<li>${item.trim()}</li>`).join('')}
            </ul>
          </div>
        `;
      }

      // If no list markers found, keep as paragraph
      return `
        <div class="summary-box">
          <h4>Summary</h4>
          <p>${cleanContent}</p>
        </div>
      `;
    }
  );

  // Process HTML entities without breaking valid HTML tags
  sanitizedContent = sanitizedContent
    .replace(/&amp;(?!(?:amp|lt|gt|quot|apos);)/g, "&") // Fix ampersands not part of entities
    .replace(/&lt;(\/?[a-z][a-z0-9]*(?:\s+[a-z0-9\-]+(?:=(?:"[^"]*"|'[^']*'|[^'"<>=\s]+))?)*\s*\/?)&gt;/gi, "<$1>") // Convert HTML-escaped tags back to real tags
    .replace(/&nbsp;/g, " ");

  // Transform lists that might be improperly formatted
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = sanitizedContent;
  
  // Fix lists that are missing proper structure
  const paragraphs = tempDiv.querySelectorAll('p');
  paragraphs.forEach(p => {
    const text = p.innerHTML;
    // Check if paragraph has list markers
    if ((text.includes('• ') || text.includes('- ') || /^\d+\.\s/.test(text)) && 
        !p.closest('li') && !p.closest('ul') && !p.closest('ol')) {
      
      // Create a proper list
      const isOrdered = /^\d+\.\s/.test(text);
      const listEl = document.createElement(isOrdered ? 'ol' : 'ul');
      
      // Split by list markers and create list items
      const items = text.split(/(?:\s*[•\-]\s*|\s*\d+\.\s*|\n+)/)
                       .filter(item => item.trim().length > 0);
      
      items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item.trim();
        listEl.appendChild(li);
      });
      
      // Replace the paragraph with the list
      p.parentNode.replaceChild(listEl, p);
    }
  });

  return tempDiv.innerHTML;
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
      
      {/* Article Header */}
      <header className="pt-16 pb-12 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="mx-auto px-4 max-w-[800px]">
          {/* Category and Date */}
          <div className="flex items-center space-x-4 mb-6">
            {post.category && (
              <Link
                to={`/blog/category/${post.category.slug}`}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
              >
                {post.category.name}
              </Link>
            )}
            <span className="text-gray-400 dark:text-gray-500">•</span>
            <time className="text-gray-600 dark:text-gray-400 text-sm">
              {post.published_at && format(new Date(post.published_at), 'MMMM d, yyyy')}
            </time>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Article Meta */}
          <div className="flex items-center justify-between border-t border-b border-gray-200 dark:border-gray-700 py-4">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                  <span>{calculateReadingTime(post.content)} min read</span>
                  <span className="mx-2">•</span>
                  <span>{post.view_count} views</span>
                </div>
              </div>
            </div>
            {isAuthenticated && (
              <button 
                onClick={() => navigate(`/blog/edit/${post.slug}`)}
                className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit Article
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <article className="mx-auto px-4 py-8 max-w-[800px]">
        {/* Featured Image */}
        {post.featured_image && (
          <figure className="mb-12">
            <img 
              src={getPostImageUrl(post)} 
              alt={post.title}
              className="w-full h-auto rounded-xl shadow-lg"
            />
            {post.featured_image_caption && (
              <figcaption className="mt-3 text-center text-sm text-gray-600 dark:text-gray-400 italic">
                {post.featured_image_caption}
              </figcaption>
            )}
          </figure>
        )}

        {/* Article Content */}
        <div 
          ref={contentRef}
          className="prose prose-lg dark:prose-invert max-w-none
            /* Base typography */
            prose-p:text-base sm:prose-p:text-lg prose-p:leading-relaxed prose-p:mb-6
            prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white 
            prose-headings:tracking-tight prose-headings:leading-tight
            
            /* Spacing */
            prose-h1:text-3xl sm:prose-h1:text-4xl prose-h1:mt-10 prose-h1:mb-6
            prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:mt-8 prose-h2:mb-4
            prose-h3:text-xl sm:prose-h3:text-2xl prose-h3:mt-6 prose-h3:mb-3
            prose-h4:text-lg sm:prose-h4:text-xl prose-h4:mt-6 prose-h4:mb-2
            
            /* Lists - ensuring they render properly */
            prose-ul:pl-0 sm:prose-ul:pl-5 prose-ul:list-disc prose-ul:my-6
            prose-ol:pl-0 sm:prose-ol:pl-5 prose-ol:list-decimal prose-ol:my-6
            prose-li:my-2 prose-li:marker:text-gray-400
            
            /* Other elements */
            prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:font-normal hover:prose-a:underline
            prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 
            prose-blockquote:italic prose-blockquote:my-8
            
            /* Code blocks */
            prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:rounded prose-code:px-1 prose-code:py-0.5
            prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800 prose-pre:p-4 prose-pre:rounded-lg
            prose-pre:overflow-x-auto
            
            /* Tables */
            prose-table:border-collapse prose-table:w-full prose-table:my-8
            prose-th:border prose-th:border-gray-300 dark:prose-th:border-gray-700 
            prose-th:p-2 prose-th:bg-gray-100 dark:prose-th:bg-gray-800
            prose-td:border prose-td:border-gray-300 dark:prose-td:border-gray-700 prose-td:p-2
            
            /* Summary and special boxes */
            [&_.summary-box]:bg-blue-50 dark:[&_.summary-box]:bg-blue-900/20 
            [&_.summary-box]:p-5 [&_.summary-box]:rounded-lg [&_.summary-box]:my-8
            [&_.summary-box]:border-l-4 [&_.summary-box]:border-blue-500
            
            /* Ensure lists in summary boxes work properly */
            [&_.summary-box_ul]:list-disc [&_.summary-box_ul]:pl-5 [&_.summary-box_ul]:my-4
            [&_.summary-box_li]:ml-0 [&_.summary-box_li]:pl-0"
          dangerouslySetInnerHTML={{ 
            __html: computedContent 
          }}
        />

        {/* Tags Section */}
        <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <Link
                  key={tag.slug}
                  to={`/blog/tag/${tag.slug}`}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 
                           rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition
                           border border-gray-200 dark:border-gray-700"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Author Section */}
        {post.author && (
          <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 
                              flex items-center justify-center text-white text-lg font-bold">
                  {post.author.first_name?.charAt(0) || post.author.username?.charAt(0) || 'A'}
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {post.author.first_name 
                    ? `${post.author.first_name} ${post.author.last_name || ''}` 
                    : post.author.username || 'Anonymous'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Author
                </p>
              </div>
            </div>
          </div>
        )}
      </article>
    </div>
  );
};

export default BlogDetailPage;
