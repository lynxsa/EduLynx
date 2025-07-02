'use client';

import { MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { ForumPost, ForumView } from '../../components/ui/forum-system';

const mockPosts: ForumPost[] = [
  {
    id: '1',
    title: 'Having trouble with Calculus homework',
    content:
      "Can anyone help me with question 5? I'm stuck on the differentiation part. I've tried the chain rule but I'm not getting the right answer.",
    author: { id: 'user1', name: 'Thabo Mthembu', role: 'student' },
    subject: 'Mathematics',
    grade: '12',
    createdAt: '2025-06-24T10:30:00Z',
    likes: 12,
    replies: 3,
    isLiked: false,
    tags: ['calculus', 'homework-help', 'differentiation'],
  },
  {
    id: '2',
    title: 'Tips for preparing for the Physical Sciences exam?',
    content:
      "The final exam is coming up and I'm feeling a bit overwhelmed. Does anyone have any good study strategies or resources to share? Specifically for Chemistry paper 2.",
    author: { id: 'user2', name: 'Sarah Molefe', role: 'student' },
    subject: 'Physical Science',
    grade: '11',
    createdAt: '2025-06-23T14:00:00Z',
    likes: 25,
    replies: 8,
    isPinned: true,
    isLiked: true,
    tags: ['exam-prep', 'study-tips', 'chemistry'],
  },
];

export default function ForumPage() {
  const [posts, setPosts] = useState<ForumPost[]>(mockPosts);
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);

  const handleCreatePost = () => {
    // Logic to create a new post
    console.log('Create new post');
  };

  const handlePostClick = (post: ForumPost) => {
    setSelectedPost(post);
    console.log('Post clicked:', post);
  };

  const handleLike = (postId: string) => {
    setPosts(
      posts.map(p =>
        p.id === postId
          ? { ...p, likes: p.isLiked ? p.likes - 1 : p.likes + 1, isLiked: !p.isLiked }
          : p
      )
    );
    console.log('Post liked:', postId);
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1 className="page-title">
          <MessageSquare className="w-8 h-8 mr-3 text-brand-primary" />
          Community Forum
        </h1>
        <p className="page-description">
          Connect with fellow students, ask questions, and share your knowledge.
        </p>
      </header>
      <div className="page-content">
        <ForumView
          posts={posts}
          onCreatePost={handleCreatePost}
          onPostClick={handlePostClick}
          onLike={handleLike}
        />
      </div>
    </div>
  );
}
