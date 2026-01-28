
import React, { useState, useEffect } from 'react';
import { Post, User, Comment } from './types';
import { INITIAL_USER, INITIAL_FRIENDS, INITIAL_POSTS } from './constants';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import CreatePost from './components/CreatePost';
import PostCard from './components/PostCard';
import AIAssistant from './components/AIAssistant';
import { analyzeFeedSentiment } from './services/geminiService';
import { Sparkles, Info } from 'lucide-react';

const App: React.FC = () => {
  const [currentUser] = useState<User>(INITIAL_USER);
  // FIX: Type of friends should be User[] to match INITIAL_FRIENDS and expected usage
  const [friends] = useState<User[]>(INITIAL_FRIENDS);
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [communityPulse, setCommunityPulse] = useState('Loading daily insights...');

  useEffect(() => {
    const fetchPulse = async () => {
      try {
        const pulse = await analyzeFeedSentiment(posts);
        setCommunityPulse(pulse);
      } catch (err) {
        console.error("Pulse failed", err);
      }
    };
    fetchPulse();
  }, [posts]);

  const handlePostCreated = (content: string) => {
    const newPost: Post = {
      id: `p-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      content,
      likes: 0,
      comments: [],
      createdAt: Date.now(),
    };
    setPosts([newPost, ...posts]);
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ));
  };

  const handleComment = (postId: string, content: string) => {
    const newComment: Comment = {
      id: `c-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      content,
      createdAt: Date.now(),
    };
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, comments: [...post.comments, newComment] } : post
    ));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f2f5]">
      <Navbar user={currentUser} />
      
      <main className="flex-1 flex justify-center max-w-[1920px] mx-auto w-full">
        {/* Left Sidebar */}
        <Sidebar user={currentUser} friends={friends} />

        {/* Main Feed */}
        <div className="w-full max-w-[600px] flex flex-col py-6 px-4">
          
          {/* AI Community Pulse */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg p-5 mb-6 text-white relative overflow-hidden">
            <div className="relative z-10 flex items-start space-x-3">
              <Sparkles className="w-6 h-6 text-yellow-300 shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg mb-1">Community Pulse</h3>
                <p className="text-blue-100 text-sm italic">"{communityPulse}"</p>
              </div>
            </div>
            {/* Background decoration */}
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -left-10 -top-10 w-40 h-40 bg-indigo-400/20 rounded-full blur-3xl"></div>
          </div>

          {/* Stories placeholder */}
          <div className="flex space-x-2 mb-6 overflow-x-auto no-scrollbar pb-2">
            <div className="min-w-[110px] h-[200px] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative cursor-pointer group shrink-0">
               <img src={currentUser.avatar} className="w-full h-full object-cover transition duration-300 group-hover:scale-110" alt="Me" />
               <div className="absolute inset-0 bg-black/20"></div>
               <div className="absolute bottom-2 left-2 right-2 text-white text-[10px] font-bold text-center">Create Story</div>
            </div>
            {friends.map(friend => (
              <div key={friend.id} className="min-w-[110px] h-[200px] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative cursor-pointer group shrink-0">
                <img src={friend.avatar} className="w-full h-full object-cover transition duration-300 group-hover:scale-110" alt={friend.name} />
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute top-2 left-2 w-8 h-8 rounded-full border-4 border-blue-500 overflow-hidden">
                  <img src={friend.avatar} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="absolute bottom-2 left-2 text-white text-[10px] font-bold truncate pr-2">{friend.name}</div>
              </div>
            ))}
          </div>

          <CreatePost user={currentUser} onPostCreated={handlePostCreated} />

          <div className="space-y-4">
            {posts.map(post => (
              <PostCard 
                key={post.id} 
                post={post} 
                onLike={handleLike} 
                onComment={handleComment} 
              />
            ))}
          </div>

          {/* Footer mobile friendly */}
          <div className="py-10 text-center text-gray-500 text-xs flex flex-col items-center">
            <p>GeminiSocial &copy; 2024</p>
            <div className="flex space-x-2 mt-2">
              <a href="#" className="hover:underline">Privacy</a>
              <span>&middot;</span>
              <a href="#" className="hover:underline">Terms</a>
              <span>&middot;</span>
              <a href="#" className="hover:underline">Cookies</a>
              <span>&middot;</span>
              <a href="#" className="hover:underline">More</a>
            </div>
            <div className="mt-4 flex items-center space-x-1 opacity-50">
              <Info className="w-3 h-3" />
              <span>Powered by Gemini 3 Flash</span>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <Sidebar user={currentUser} friends={friends} isRight />
      </main>

      {/* Floating AI Assistant */}
      <AIAssistant />
    </div>
  );
};

export default App;
