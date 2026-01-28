
import React from 'react';
import { Search, Home, Users, Video, ShoppingBag, Bell, MessageCircle, Menu, LayoutGrid } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  user: User;
}

const Navbar: React.FC<NavbarProps> = ({ user }) => {
  return (
    <nav className="h-14 bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 flex items-center justify-between px-4">
      {/* Left: Logo & Search */}
      <div className="flex items-center space-x-2 flex-1">
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-2xl italic">G</span>
        </div>
        <div className="relative hidden md:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-64 pl-10 pr-3 py-2 bg-gray-100 border-none rounded-full text-sm placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
            placeholder="Search GeminiSocial"
          />
        </div>
      </div>

      {/* Center: Tabs */}
      <div className="hidden lg:flex items-center justify-center space-x-1 flex-1">
        <button className="px-10 py-2 text-blue-600 border-b-4 border-blue-600 hover:bg-gray-50 rounded-t-lg transition">
          <Home className="w-7 h-7" />
        </button>
        <button className="px-10 py-2 text-gray-500 hover:bg-gray-50 rounded-lg transition">
          <Users className="w-7 h-7" />
        </button>
        <button className="px-10 py-2 text-gray-500 hover:bg-gray-50 rounded-lg transition">
          <Video className="w-7 h-7" />
        </button>
        <button className="px-10 py-2 text-gray-500 hover:bg-gray-50 rounded-lg transition">
          <ShoppingBag className="w-7 h-7" />
        </button>
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center justify-end space-x-2 flex-1">
        <div className="hidden xl:flex space-x-2">
          <button className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full text-gray-700">
            <LayoutGrid className="w-5 h-5" />
          </button>
          <button className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full text-gray-700">
            <MessageCircle className="w-5 h-5" />
          </button>
          <button className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full text-gray-700">
            <Bell className="w-5 h-5" />
          </button>
        </div>
        <img src={user.avatar} alt="Profile" className="w-10 h-10 rounded-full object-cover border border-gray-200 cursor-pointer hover:opacity-90" />
      </div>
    </nav>
  );
};

export default Navbar;
