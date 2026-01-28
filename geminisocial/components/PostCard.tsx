
import React, { useState } from 'react';
import { Post, Comment } from '../types';
import { ThumbsUp, MessageSquare, Share2, MoreHorizontal, Smile, Send } from 'lucide-react';

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onComment: (postId: string, content: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike, onComment }) => {
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      onComment(post.id, commentText);
      setCommentText('');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm mb-4 overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img src={post.userAvatar} alt={post.userName} className="w-10 h-10 rounded-full object-cover" />
          <div>
            <h4 className="font-bold text-sm text-gray-900 flex items-center">
              {post.userName}
              {post.isAIGenerated && (
                <span className="ml-2 px-1.5 py-0.5 bg-blue-100 text-blue-600 text-[10px] rounded font-medium uppercase tracking-wider">AI</span>
              )}
            </h4>
            <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString()} at {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{post.content}</p>
      </div>

      {/* Image if any */}
      {post.image && (
        <div className="mt-1 border-y border-gray-100 bg-gray-50">
          <img src={post.image} alt="Post content" className="w-full h-auto max-h-[500px] object-contain mx-auto" />
        </div>
      )}

      {/* Stats */}
      <div className="px-4 py-3 flex items-center justify-between text-gray-500 text-xs">
        <div className="flex items-center space-x-1">
          <div className="bg-blue-500 p-1 rounded-full">
            <ThumbsUp className="w-3 h-3 text-white" />
          </div>
          <span>{post.likes}</span>
        </div>
        <div className="flex space-x-4">
          <button onClick={() => setShowComments(!showComments)} className="hover:underline">{post.comments.length} comments</button>
          <span>Share</span>
        </div>
      </div>

      {/* Actions */}
      <div className="px-3 py-1 border-t border-gray-100 flex items-center justify-between">
        <button 
          onClick={() => onLike(post.id)}
          className="flex-1 py-2 flex items-center justify-center space-x-2 text-gray-600 hover:bg-gray-100 rounded-md transition"
        >
          <ThumbsUp className="w-5 h-5" />
          <span className="font-semibold text-sm">Like</span>
        </button>
        <button 
          onClick={() => setShowComments(!showComments)}
          className="flex-1 py-2 flex items-center justify-center space-x-2 text-gray-600 hover:bg-gray-100 rounded-md transition"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="font-semibold text-sm">Comment</span>
        </button>
        <button className="flex-1 py-2 flex items-center justify-center space-x-2 text-gray-600 hover:bg-gray-100 rounded-md transition">
          <Share2 className="w-5 h-5" />
          <span className="font-semibold text-sm">Share</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="px-4 pb-4 border-t border-gray-100 bg-gray-50">
          {post.comments.length > 0 && (
            <div className="space-y-3 mt-4">
              {post.comments.map(comment => (
                <div key={comment.id} className="flex space-x-2">
                  <img src={comment.userAvatar} alt={comment.userName} className="w-8 h-8 rounded-full object-cover" />
                  <div className="bg-white p-2 px-3 rounded-2xl border border-gray-200 flex-1">
                    <p className="font-bold text-xs text-gray-900">{comment.userName}</p>
                    <p className="text-sm text-gray-800">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <form onSubmit={handleSubmitComment} className="flex items-center space-x-2 mt-4">
            <div className="relative flex-1">
              <input 
                type="text" 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="w-full bg-gray-100 border-none rounded-2xl py-2 px-4 text-sm focus:ring-1 focus:ring-blue-400"
              />
              <Smile className="absolute right-3 top-2.5 w-5 h-5 text-gray-400 hover:text-blue-500 cursor-pointer" />
            </div>
            <button type="submit" disabled={!commentText.trim()} className="text-blue-600 disabled:text-gray-400 transition">
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PostCard;
