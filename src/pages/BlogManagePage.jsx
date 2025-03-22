import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import * as blogService from '../services/blogService';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import { 
  PencilIcon, 
  TrashIcon, 
  EyeIcon, 
  ArrowPathIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

const BlogManagePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState('all'); // 'all', 'published', 'draft'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await blogService.getPosts({
          page: currentPage,
          status: filter !== 'all' ? filter : undefined,
          search: searchTerm || undefined
        });
        
        setPosts(response.results || []);
        setTotalPages(Math.ceil(response.count / response.page_size) || 1);
      } catch (error) {
        console.error('Error fetching posts:', error);
        toast.error('Failed to load blog posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage, filter, searchTerm]);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Handle select all
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedPosts(posts.map(post => post.id));
    } else {
      setSelectedPosts([]);
    }
  };

  // Handle select individual post
  const handleSelectPost = (postId) => {
    setSelectedPosts(prev => {
      if (prev.includes(postId)) {
        return prev.filter(id => id !== postId);
      } else {
        return [...prev, postId];
      }
    });
  };

  // Handle delete selected posts
  const handleDeleteSelected = async () => {
    if (selectedPosts.length === 0) return;
    
    if (!window.confirm(`Are you sure you want to delete ${selectedPosts.length} posts?`)) {
      return;
    }
    
    try {
      setIsDeleting(true);
      // Delete posts sequentially to avoid rate limiting issues
      for (const postId of selectedPosts) {
        await blogService.deletePost(postId);
      }
      
      // Refresh the list
      setPosts(prev => prev.filter(post => !selectedPosts.includes(post.id)));
      setSelectedPosts([]);
      toast.success(`${selectedPosts.length} posts deleted successfully`);
    } catch (error) {
      console.error('Error deleting posts:', error);
      toast.error('Failed to delete some posts');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle delete individual post
  const handleDeletePost = async (postId, postTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${postTitle}"?`)) {
      return;
    }
    
    try {
      await blogService.deletePost(postId);
      setPosts(prev => prev.filter(post => post.id !== postId));
      toast.success('Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 dark:bg-black pt-16">
        <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="mb-8 flex flex-wrap justify-between items-center">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              Manage Blog Posts
            </h1>
            <Link
              to="/blog/create"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 transition-colors"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              New Post
            </Link>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-900 shadow rounded-lg mb-8 p-4">
            <div className="flex flex-wrap gap-4">
              <div className="w-full md:w-auto flex-1">
                <label htmlFor="search" className="sr-only">Search</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="search"
                    id="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Search posts..."
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="status-filter" className="sr-only">Status</label>
                <select
                  id="status-filter"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-700 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="all">All Posts</option>
                  <option value="published">Published</option>
                  <option value="draft">Drafts</option>
                </select>
              </div>
              
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setFilter('all');
                  setCurrentPage(1);
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <ArrowPathIcon className="h-4 w-4 mr-2" />
                Reset
              </button>
            </div>
            
            {selectedPosts.length > 0 && (
              <div className="mt-4 flex items-center">
                <span className="mr-4 text-sm text-gray-700 dark:text-gray-300">
                  {selectedPosts.length} post{selectedPosts.length > 1 ? 's' : ''} selected
                </span>
                <button
                  type="button"
                  onClick={handleDeleteSelected}
                  disabled={isDeleting}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? (
                    <>
                      <ArrowPathIcon className="animate-spin h-4 w-4 mr-2" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <TrashIcon className="h-4 w-4 mr-2" />
                      Delete Selected
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Posts Table */}
          <div className="bg-white dark:bg-gray-900 shadow overflow-hidden rounded-lg">
            {loading ? (
              <div className="p-12 flex justify-center">
                <ArrowPathIcon className="h-8 w-8 text-purple-500 animate-spin" />
              </div>
            ) : posts.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-500 dark:text-gray-400">No posts found.</p>
                <Link 
                  to="/blog/create"
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700"
                >
                  Create your first post
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 dark:border-gray-700 rounded"
                            onChange={handleSelectAll}
                            checked={selectedPosts.length === posts.length && posts.length > 0}
                          />
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Title
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Views
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                    {posts.map((post) => (
                      <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 dark:border-gray-700 rounded"
                            checked={selectedPosts.includes(post.id)}
                            onChange={() => handleSelectPost(post.id)}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {post.featured_image && (
                              <div className="flex-shrink-0 h-10 w-10 mr-3">
                                <img className="h-10 w-10 rounded-md object-cover" src={post.featured_image} alt="" />
                              </div>
                            )}
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {post.title}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                                {post.excerpt || "No excerpt available"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            post.status === 'published' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                          }`}>
                            {post.status === 'published' ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(post.updated_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {post.view_count || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <Link
                              to={`/blog/${post.slug}`}
                              className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                              title="View"
                            >
                              <EyeIcon className="h-5 w-5" />
                            </Link>
                            <Link
                              to={`/blog/edit/${post.slug}`}
                              className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                              title="Edit"
                            >
                              <PencilIcon className="h-5 w-5" />
                            </Link>
                            <button
                              onClick={() => handleDeletePost(post.id, post.title)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                              title="Delete"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {!loading && posts.length > 0 && (
              <div className="bg-white dark:bg-gray-900 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Showing <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(currentPage * 10, posts.length + (currentPage - 1) * 10)}
                      </span>{' '}
                      of <span className="font-medium">{posts.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Previous</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`relative inline-flex items-center px-4 py-2 border ${
                            currentPage === i + 1
                              ? 'z-10 bg-indigo-50 dark:bg-indigo-900 border-indigo-500 dark:border-indigo-500 text-indigo-600 dark:text-indigo-300'
                              : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                          } text-sm font-medium`}
                        >
                          {i + 1}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Next</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BlogManagePage;
