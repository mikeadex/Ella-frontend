import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import BlogHome from './Blog/BlogHome';
import BlogDetailPage from './Blog/BlogDetailPage';
import BlogCategoryPage from './Blog/BlogCategoryPage';
import BlogTagPage from './Blog/BlogTagPage';
import BlogTagsListPage from './Blog/BlogTagsListPage';
import BlogSearchPage from './Blog/BlogSearchPage';
import { useAuth } from '../context/AuthContext';
import BlogPostEditor from '../components/Editor/BlogPostEditor';
import BlogManagePage from './BlogManagePage';

const Blog = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <Routes>
      <Route path="/" element={<BlogHome />} />
      <Route path="/search" element={<BlogSearchPage />} />
      <Route path="/category/:slug" element={<BlogCategoryPage />} />
      <Route path="/tag/:slug" element={<BlogTagPage />} />
      <Route path="/tags" element={<BlogTagsListPage />} />
      
      {/* Editor routes - protected by authentication check */}
      <Route 
        path="/create" 
        element={isAuthenticated ? <BlogPostEditor /> : <Navigate to="/login" state={{ from: '/blog/create' }} />} 
      />
      <Route 
        path="/edit/:slug" 
        element={isAuthenticated ? <BlogPostEditor isEditing={true} /> : <Navigate to="/login" state={{ from: window.location.pathname }} />}
      />
      
      {/* Blog Management route */}
      <Route 
        path="/manage" 
        element={isAuthenticated ? <BlogManagePage /> : <Navigate to="/login" state={{ from: '/blog/manage' }} />}
      />
      
      {/* Detail page - keep at the end as it has a catch-all pattern */}
      <Route path="/:slug" element={<BlogDetailPage />} />
      
      {/* Redirect any other blog paths back to the blog home */}
      <Route path="*" element={<Navigate to="/blog" replace />} />
    </Routes>
  );
};

export default Blog;
