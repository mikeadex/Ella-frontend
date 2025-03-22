import { useState } from 'react';
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import BlogCommentForm from './BlogCommentForm';

const Comment = ({ comment, onSubmit }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  
  // Create a hierarchy of comments (parent and child comments)
  const hasReplies = comment.replies && comment.replies.length > 0;
  
  // Format the comment date
  const formattedDate = comment.created_at 
    ? format(new Date(comment.created_at), 'MMM d, yyyy • h:mm a')
    : '';
  
  return (
    <div className="mb-6 last:mb-0" id={`comment-${comment.id}`}>
      <div className="flex space-x-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-gray-700 font-semibold">{comment.name.charAt(0).toUpperCase()}</span>
          </div>
        </div>
        
        <div className="flex-grow">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-gray-900">{comment.name}</h4>
              <span className="text-xs text-gray-500">{formattedDate}</span>
            </div>
            
            <div className="prose prose-sm max-w-none text-gray-700">
              <p>{comment.content}</p>
            </div>
            
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="mt-3 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
              {showReplyForm ? 'Cancel Reply' : 'Reply'}
            </button>
          </div>
          
          {showReplyForm && (
            <div className="mt-4">
              <BlogCommentForm onSubmit={onSubmit} parentId={comment.id} />
            </div>
          )}
          
          {hasReplies && (
            <div className="mt-4 pl-4 border-l-2 border-gray-200">
              {comment.replies.map(reply => (
                <Comment key={reply.id} comment={reply} onSubmit={onSubmit} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

Comment.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    created_at: PropTypes.string,
    replies: PropTypes.array
  }).isRequired,
  onSubmit: PropTypes.func.isRequired
};

const BlogCommentList = ({ comments = [], onSubmit }) => {
  if (!comments || comments.length === 0) {
    return (
      <div className="text-center py-6 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No comments yet. Be the first to comment!</p>
      </div>
    );
  }
  
  // Filter to only show parent comments (those without a parent)
  const parentComments = comments.filter(comment => !comment.parent);
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
      </h3>
      
      {parentComments.map(comment => (
        <Comment key={comment.id} comment={comment} onSubmit={onSubmit} />
      ))}
    </div>
  );
};

BlogCommentList.propTypes = {
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      created_at: PropTypes.string,
      parent: PropTypes.number,
      replies: PropTypes.array
    })
  ),
  onSubmit: PropTypes.func
};

export default BlogCommentList;
