import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { truncateText } from '../../../utils/textUtils';
import DOMPurify from 'dompurify';
import BlogImage from '../../../components/Blog/BlogImage';
import { getPostImageUrl } from '../../../utils/imageUtils';

const BlogFeaturedSection = ({ featuredPosts = [] }) => {
  if (!featuredPosts.length) {
    return null;
  }

  const mainFeatured = featuredPosts[0];
  const secondaryFeatured = featuredPosts.slice(1, 3);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="mb-12"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main featured post */}
        {mainFeatured && (
          <motion.div 
            className="lg:col-span-7 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link to={`/blog/${mainFeatured.slug}`} className="block group">
              <div className="relative h-96 rounded-xl overflow-hidden shadow-lg">
                {mainFeatured.featured_image ? (
                  <BlogImage
                    src={getPostImageUrl(mainFeatured)}
                    alt={mainFeatured.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6">
                  <div className="flex items-center mb-3">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {mainFeatured.category?.name || 'Featured'}
                    </span>
                    <span className="ml-3 text-white/90 text-sm">
                      {mainFeatured.published_at ? 
                        format(new Date(mainFeatured.published_at), 'MMM d, yyyy') : 
                        'Recent'}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-blue-200 transition-colors">
                    {mainFeatured.title}
                  </h2>
                  <div 
                    className="text-white/80 mb-3"
                    dangerouslySetInnerHTML={{ 
                      __html: DOMPurify.sanitize(truncateText(mainFeatured.excerpt || '', 150))
                    }}
                  />
                  <div className="flex items-center">
                    <div className="mr-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 h-10 w-10 flex items-center justify-center text-white font-medium">
                      {mainFeatured.author?.first_name?.charAt(0) || 
                       mainFeatured.author?.username?.charAt(0) || 'A'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {mainFeatured.author?.first_name 
                          ? `${mainFeatured.author.first_name} ${mainFeatured.author.last_name || ''}` 
                          : mainFeatured.author?.username || 'Anonymous'}
                      </p>
                      <p className="text-xs text-white/70">
                        {`${mainFeatured.view_count || 0} views`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Secondary featured posts */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {secondaryFeatured.map((post, index) => (
            <motion.div 
              key={post.id || `secondary-featured-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + (index * 0.1) }}
              className="relative"
            >
              <Link to={`/blog/${post.slug}`} className="block group">
                <div className="relative h-44 rounded-xl overflow-hidden shadow-lg">
                  {post.featured_image ? (
                    <BlogImage
                      src={getPostImageUrl(post)}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-5">
                    <div className="flex items-center mb-2">
                      <span className="text-white/90 text-xs">
                        {post.published_at ? 
                          format(new Date(post.published_at), 'MMM d, yyyy') : 
                          'Recent'}
                      </span>
                      <span className="mx-2 text-white/50">•</span>
                      <span className="text-white/90 text-xs">
                        {post.category?.name || 'Featured'}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-200 transition-colors">
                      {post.title}
                    </h3>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

BlogFeaturedSection.propTypes = {
  featuredPosts: PropTypes.array
};

export default BlogFeaturedSection;
