
import React, { useState } from 'react';
import { User } from '../types';
import { Video, Image, Smile, Sparkles, Loader2 } from 'lucide-react';
import { suggestPostContent } from '../services/geminiService';

interface CreatePostProps {
  user: User;
  onPostCreated: (content: string) => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ user, onPostCreated }) => {
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = () => {
    if (content.trim()) {
      onPostCreated(content);
      setContent('');
    }
  };

  const handleAISuggest = async () => {
    const topic = prompt("What would you like to post about? (e.g., 'A sunny day in the park')");
    if (topic) {
      setIsGenerating(true);
      try {
        const suggestion = await suggestPostContent(topic);
        setContent(suggestion);
      } catch (error) {
        console.error("AI Suggestion failed", error);
      } finally {
        setIsGenerating(false);
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-4 border border-gray-200">
      <div className="flex items-center space-x-3 mb-4">
        <img src={user.avatar} alt="Me" className="w-10 h-10 rounded-full object-cover" />
        <button 
          onClick={() => { /* Open full post dialog */ }} 
          className="bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full flex-1 py-2 px-4 text-left text-sm font-medium transition"
        >
          What's on your mind, {user.name.split(' ')[0]}?
        </button>
      </div>
      
      <div className="mb-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start typing or use AI assistant..."
          className="w-full p-2 border border-gray-100 rounded-lg text-sm min-h-[80px] focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none transition"
        />
      </div>

      <hr className="mb-3 border-gray-100" />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <button className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition text-red-500">
            <Video className="w-5 h-5" />
            <span className="text-xs font-semibold text-gray-500 hidden sm:inline">Live Video</span>
          </button>
          <button className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition text-green-500">
            <Image className="w-5 h-5" />
            <span className="text-xs font-semibold text-gray-500 hidden sm:inline">Photo/video</span>
          </button>
          <button className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition text-yellow-500">
            <Smile className="w-5 h-5" />
            <span className="text-xs font-semibold text-gray-500 hidden sm:inline">Feeling/activity</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={handleAISuggest}
            disabled={isGenerating}
            className="flex items-center space-x-2 p-2 px-3 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border border-blue-200 rounded-lg transition text-blue-600 disabled:opacity-50"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span className="text-xs font-bold">AI Help</span>
          </button>
          <button 
            onClick={handleSubmit}
            disabled={!content.trim()}
            className="px-6 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm transition disabled:bg-blue-300"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
