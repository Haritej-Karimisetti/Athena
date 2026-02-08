
import React from 'react';
import { Bell, Search, UserCircle } from 'lucide-react';
import { ViewState } from '../types';

interface HeaderProps {
  onNavigate: (view: ViewState) => void;
  profileImage?: string | null;
  hasNotifications?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, profileImage, hasNotifications }) => {
  return (
    <div className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-sm px-4 py-3 flex items-center gap-3 border-b border-gray-100 dark:border-gray-700">
      {/* Left: Alert */}
      <button 
        onClick={() => onNavigate(ViewState.ANNOUNCEMENTS)}
        className="relative p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
      >
        <Bell className="w-6 h-6" />
        {hasNotifications && (
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-600 border-2 border-white dark:border-gray-800 rounded-full animate-in zoom-in-50 duration-200" />
        )}
      </button>

      {/* Center: Search Box */}
      <div className="flex-1 relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="w-4 h-4 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search..."
          className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-full py-2.5 pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-leeds-blue/50 dark:focus:ring-orange-500/50 transition-all"
          onClick={() => onNavigate(ViewState.SEARCH)}
          readOnly // For now, this acts as a navigation trigger
        />
      </div>

      {/* Right: Profile */}
      <button 
        onClick={() => onNavigate(ViewState.SETTINGS)}
        className="shrink-0 flex items-center justify-center w-9 h-9 overflow-hidden rounded-full border border-gray-200 dark:border-gray-600 transition-all active:scale-90"
      >
        {profileImage ? (
          <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <UserCircle className="w-8 h-8 text-gray-400" strokeWidth={1.5} />
        )}
      </button>
    </div>
  );
};