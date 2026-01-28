
import React from 'react';
import { User } from '../types';
import { Users, Bookmark, Clock, Flag, Calendar, Star, ChevronDown, Video } from 'lucide-react';

interface SidebarProps {
  user: User;
  friends: User[];
  isRight?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ user, friends, isRight = false }) => {
  if (isRight) {
    return (
      <aside className="hidden lg:block w-[300px] h-[calc(100vh-56px)] overflow-y-auto p-4 sticky top-14 no-scrollbar">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-gray-500 font-semibold text-lg">Contacts</h2>
          <div className="flex space-x-4">
             <Video className="w-5 h-5 text-gray-500 cursor-pointer" />
             <Search className="w-5 h-5 text-gray-500 cursor-pointer" />
          </div>
        </div>
        <ul className="space-y-1">
          {friends.map(friend => (
            <li key={friend.id} className="flex items-center space-x-3 p-2 hover:bg-gray-200 rounded-lg cursor-pointer transition">
              <div className="relative">
                <img src={friend.avatar} alt={friend.name} className="w-9 h-9 rounded-full object-cover" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <span className="font-medium text-sm text-gray-800">{friend.name}</span>
            </li>
          ))}
        </ul>
      </aside>
    );
  }

  return (
    <aside className="hidden md:block w-[300px] h-[calc(100vh-56px)] overflow-y-auto p-4 sticky top-14 no-scrollbar">
      <ul className="space-y-1">
        <li className="flex items-center space-x-3 p-2 hover:bg-gray-200 rounded-lg cursor-pointer transition">
          <img src={user.avatar} alt="Me" className="w-9 h-9 rounded-full object-cover" />
          <span className="font-medium text-sm text-gray-800">{user.name}</span>
        </li>
        <li className="flex items-center space-x-3 p-2 hover:bg-gray-200 rounded-lg cursor-pointer transition">
          <Users className="w-9 h-9 text-blue-500" />
          <span className="font-medium text-sm text-gray-800">Friends</span>
        </li>
        <li className="flex items-center space-x-3 p-2 hover:bg-gray-200 rounded-lg cursor-pointer transition">
          <Clock className="w-9 h-9 text-blue-400" />
          <span className="font-medium text-sm text-gray-800">Memories</span>
        </li>
        <li className="flex items-center space-x-3 p-2 hover:bg-gray-200 rounded-lg cursor-pointer transition">
          <Bookmark className="w-9 h-9 text-purple-600" />
          <span className="font-medium text-sm text-gray-800">Saved</span>
        </li>
        <li className="flex items-center space-x-3 p-2 hover:bg-gray-200 rounded-lg cursor-pointer transition">
          <Flag className="w-9 h-9 text-orange-600" />
          <span className="font-medium text-sm text-gray-800">Pages</span>
        </li>
        <li className="flex items-center space-x-3 p-2 hover:bg-gray-200 rounded-lg cursor-pointer transition">
          <Calendar className="w-9 h-9 text-red-500" />
          <span className="font-medium text-sm text-gray-800">Events</span>
        </li>
        <li className="flex items-center space-x-3 p-2 hover:bg-gray-200 rounded-lg cursor-pointer transition">
          <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center">
            <ChevronDown className="w-5 h-5 text-gray-700" />
          </div>
          <span className="font-medium text-sm text-gray-800">See more</span>
        </li>
      </ul>
      <hr className="my-4 border-gray-300" />
      <h3 className="text-gray-500 font-semibold px-2 mb-2">Your Shortcuts</h3>
      <div className="px-2 text-xs text-gray-400 hover:text-blue-500 cursor-pointer">Edit</div>
    </aside>
  );
};

// Internal icon for right sidebar
const Search = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
);

export default Sidebar;
