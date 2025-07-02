'use client';

import { motion } from 'framer-motion';
import {
  ChevronUp,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Pin,
  Plus,
  Reply,
  Search,
  ThumbsUp,
  User,
} from 'lucide-react';
import { useState } from 'react';

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    role: 'student' | 'teacher' | 'admin';
  };
  subject: string;
  grade: string;
  createdAt: string;
  updatedAt?: string;
  likes: number;
  replies: number;
  isPinned?: boolean;
  isLiked?: boolean;
  tags?: string[];
}

export interface ForumReply {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    role: 'student' | 'teacher' | 'admin';
  };
  createdAt: string;
  likes: number;
  isLiked?: boolean;
  parentId?: string; // For nested replies
}

interface ForumCardProps {
  post: ForumPost;
  onClick: (post: ForumPost) => void;
  onLike: (postId: string) => void;
}

export function ForumCard({ post, onClick, onLike }: ForumCardProps) {
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'teacher':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'admin':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="forum-card glass-card p-6 rounded-xl border border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
      onClick={() => onClick(post)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {post.isPinned && <Pin className="w-4 h-4 text-amber-500" />}
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-lg text-xs font-medium">
              {post.subject}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Grade {post.grade}</span>
          </div>
        </div>

        <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
          <MoreHorizontal className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Title and Content */}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{post.title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">{post.content}</p>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">{post.author.name}</span>
            <span className={`px-2 py-0.5 rounded text-xs ${getRoleColor(post.author.role)}`}>
              {post.author.role}
            </span>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatTimeAgo(post.createdAt)}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={e => {
              e.stopPropagation();
              onLike(post.id);
            }}
            className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
              post.isLiked
                ? 'text-red-500 bg-red-50 dark:bg-red-900/30'
                : 'text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30'
            }`}
          >
            <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
            <span className="text-xs">{post.likes}</span>
          </motion.button>

          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
            <MessageCircle className="w-4 h-4" />
            <span className="text-xs">{post.replies}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface ForumViewProps {
  posts: ForumPost[];
  onCreatePost: () => void;
  onPostClick: (post: ForumPost) => void;
  onLike: (postId: string) => void;
}

export function ForumView({ posts, onCreatePost, onPostClick, onLike }: ForumViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const subjects = [
    'all',
    'Mathematics',
    'Physical Science',
    'English',
    'Life Sciences',
    'History',
  ];
  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'replies', label: 'Most Replies' },
  ];

  const filteredPosts = posts
    .filter(post => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSubject = selectedSubject === 'all' || post.subject === selectedSubject;
      return matchesSearch && matchesSubject;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.likes - a.likes;
        case 'replies':
          return b.replies - a.replies;
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  // Separate pinned posts
  const pinnedPosts = filteredPosts.filter(post => post.isPinned);
  const regularPosts = filteredPosts.filter(post => !post.isPinned);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Study Forum</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Connect with classmates, ask questions, and share knowledge
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCreatePost}
          className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium transition-colors shadow-lg"
        >
          <Plus className="w-5 h-5" />
          New Post
        </motion.button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search discussions..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        <select
          value={selectedSubject}
          onChange={e => setSelectedSubject(e.target.value)}
          className="px-4 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
        >
          {subjects.map(subject => (
            <option key={subject} value={subject}>
              {subject === 'all' ? 'All Subjects' : subject}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="px-4 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Posts */}
      <div className="space-y-6">
        {/* Pinned Posts */}
        {pinnedPosts.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Pin className="w-5 h-5 text-amber-500" />
              Pinned Posts
            </h2>
            <div className="space-y-4">
              {pinnedPosts.map(post => (
                <ForumCard key={post.id} post={post} onClick={onPostClick} onLike={onLike} />
              ))}
            </div>
          </div>
        )}

        {/* Regular Posts */}
        {regularPosts.length > 0 && (
          <div>
            {pinnedPosts.length > 0 && (
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recent Discussions
              </h2>
            )}
            <div className="space-y-4">
              {regularPosts.map(post => (
                <ForumCard key={post.id} post={post} onClick={onPostClick} onLike={onLike} />
              ))}
            </div>
          </div>
        )}

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No discussions found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm
                ? 'Try adjusting your search terms'
                : 'Be the first to start a discussion!'}
            </p>
            <button
              onClick={onCreatePost}
              className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium transition-colors"
            >
              Start Discussion
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

interface PostDetailProps {
  post: ForumPost;
  replies: ForumReply[];
  onBack: () => void;
  onLike: (postId: string) => void;
  onReply: (content: string, parentId?: string) => void;
  onLikeReply: (replyId: string) => void;
}

export function PostDetail({
  post,
  replies,
  onBack,
  onLike,
  onReply,
  onLikeReply,
}: PostDetailProps) {
  const [replyContent, setReplyContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const handleSubmitReply = () => {
    if (replyContent.trim()) {
      onReply(replyContent, replyingTo || undefined);
      setReplyContent('');
      setReplyingTo(null);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'teacher':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'admin':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
      >
        <ChevronUp className="w-4 h-4 rotate-90" />
        Back to Forum
      </button>

      {/* Post Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-6 mb-8"
      >
        {/* Post Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {post.isPinned && <Pin className="w-4 h-4 text-amber-500" />}
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-primary/10 text-primary rounded-lg text-xs font-medium">
                {post.subject}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Grade {post.grade}</span>
            </div>
          </div>

          <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
            <MoreHorizontal className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{post.title}</h1>

        <div className="prose dark:prose-invert max-w-none mb-6">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{post.content}</p>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Post Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {post.author.name}
                </span>
                <span className={`px-2 py-0.5 rounded text-xs ${getRoleColor(post.author.role)}`}>
                  {post.author.role}
                </span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatTimeAgo(post.createdAt)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onLike(post.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                post.isLiked
                  ? 'text-red-500 bg-red-50 dark:bg-red-900/30'
                  : 'text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30'
              }`}
            >
              <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm">{post.likes}</span>
            </motion.button>

            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm">{post.replies} replies</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Reply Form */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {replyingTo ? 'Reply to comment' : 'Join the discussion'}
        </h3>

        {replyingTo && (
          <div className="mb-4">
            <button
              onClick={() => setReplyingTo(null)}
              className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Cancel reply
            </button>
          </div>
        )}

        <textarea
          value={replyContent}
          onChange={e => setReplyContent(e.target.value)}
          placeholder="Share your thoughts..."
          className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-primary"
          rows={4}
        />

        <div className="flex justify-end mt-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmitReply}
            disabled={!replyContent.trim()}
            className="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Post Reply
          </motion.button>
        </div>
      </div>

      {/* Replies */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Replies ({replies.length})
        </h3>

        {replies.map((reply, index) => (
          <motion.div
            key={reply.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-6"
          >
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {reply.author.name}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-xs ${getRoleColor(reply.author.role)}`}
                  >
                    {reply.author.role}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatTimeAgo(reply.createdAt)}
                  </span>
                </div>

                <p className="text-gray-700 dark:text-gray-300 mb-4">{reply.content}</p>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => onLikeReply(reply.id)}
                    className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                      reply.isLiked
                        ? 'text-red-500 bg-red-50 dark:bg-red-900/30'
                        : 'text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30'
                    }`}
                  >
                    <ThumbsUp className={`w-4 h-4 ${reply.isLiked ? 'fill-current' : ''}`} />
                    <span className="text-xs">{reply.likes}</span>
                  </button>

                  <button
                    onClick={() => setReplyingTo(reply.id)}
                    className="flex items-center gap-1 px-2 py-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded transition-colors"
                  >
                    <Reply className="w-4 h-4" />
                    <span className="text-xs">Reply</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {replies.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No replies yet. Be the first to join the discussion!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ForumSystem() {
  return null;
}
