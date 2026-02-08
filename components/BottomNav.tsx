
import React from 'react';
import { Home, Settings } from 'lucide-react';
import { ViewState } from '../types';

interface BottomNavProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate }) => {
  const isActive = (view: ViewState) => {
    // Group all "Home" sub-features under the Home tab active state
    const homeViews = [
      ViewState.HOME, 
      ViewState.TIMETABLE, 
      ViewState.CHECK_IN, 
      ViewState.ENGAGEMENT, 
      ViewState.CHATBOT, 
      ViewState.CAMPUS,
      ViewState.SEARCH,
      ViewState.ANNOUNCEMENTS
    ];
    if (view === ViewState.HOME && homeViews.includes(currentView)) return true;
    return currentView === view;
  };

  const navItemClass = (active: boolean) =>
    `flex flex-col items-center justify-center gap-1 w-full py-2 transition-colors ${
      active ? 'text-leeds-blue dark:text-orange-500' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
    }`;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pb-safe z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        <button className={navItemClass(isActive(ViewState.HOME))} onClick={() => onNavigate(ViewState.HOME)}>
          <Home className="w-6 h-6" fill={isActive(ViewState.HOME) ? "currentColor" : "none"} />
          <span className="text-[10px] font-bold uppercase tracking-tighter">My Campus</span>
        </button>

        <button className={navItemClass(isActive(ViewState.SETTINGS))} onClick={() => onNavigate(ViewState.SETTINGS)}>
          <Settings className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Settings</span>
        </button>
      </div>
    </div>
  );
};