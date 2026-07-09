import { Home, Search, Compass, LogOut, Sun, Moon } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  currentUser: User;
  activeTab: 'home' | 'explore' | 'messages' | 'profile';
  onTabChange: (tab: 'home' | 'explore' | 'messages' | 'profile') => void;
  onOpenCreateModal: () => void;
  onOpenSearch: () => void;
  darkMode: boolean;
  onToggleTheme: () => void;
  onLogout: () => void;
  unreadCount?: number;
}

export default function Navbar({
  currentUser,
  activeTab,
  onTabChange,
  onOpenCreateModal,
  onOpenSearch,
  darkMode,
  onToggleTheme,
  onLogout,
  unreadCount = 0,
}: NavbarProps) {
  
  const MessageIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.38 0 0 1 8 8v.5z" />
    </svg>
  );

  return (
    <>
      {/* 1. DESKTOP NAV SIDEBAR */}
      <aside className="hidden md:flex flex-col justify-between w-[245px] h-screen bg-white dark:bg-black border-r border-neutral-200 dark:border-zinc-800 p-5 fixed top-0 left-0 transition-colors z-30 select-none">
        <div className="flex flex-col gap-9">
          {/* Logo Brand Title */}
          <div className="mb-2 px-3 mt-4">
            <h1 
              onClick={() => onTabChange('home')}
              className="text-2xl font-bold italic tracking-tighter text-neutral-950 dark:text-white cursor-pointer select-none"
            >
              Instagram
            </h1>
          </div>

          {/* Links list */}
          <nav className="flex flex-col gap-1.5">
            
            {/* Home Tab */}
            <button
              onClick={() => onTabChange('home')}
              className={`flex items-center gap-4 w-full p-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-zinc-900 font-sans text-sm transition-colors cursor-pointer text-left focus:outline-none ${
                activeTab === 'home' ? 'font-semibold text-neutral-950 dark:text-white bg-neutral-100 dark:bg-zinc-900' : 'text-neutral-700 dark:text-zinc-300'
              }`}
            >
              <Home className={`w-6 h-6 ${activeTab === 'home' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              <span>Home</span>
            </button>

            {/* Search Tab */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-4 w-full p-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-zinc-900 font-sans text-sm text-neutral-700 dark:text-zinc-300 transition-colors cursor-pointer text-left focus:outline-none"
            >
              <Search className="w-6 h-6" />
              <span>Search</span>
            </button>

            {/* Explore Tab */}
            <button
              onClick={() => onTabChange('explore')}
              className={`flex items-center gap-4 w-full p-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-zinc-900 font-sans text-sm transition-colors cursor-pointer text-left focus:outline-none ${
                activeTab === 'explore' ? 'font-semibold text-neutral-950 dark:text-white bg-neutral-100 dark:bg-zinc-900' : 'text-neutral-700 dark:text-zinc-300'
              }`}
            >
              <Compass className={`w-6 h-6 ${activeTab === 'explore' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              <span>Explore</span>
            </button>

            {/* Direct Messages Tab */}
            <button
              onClick={() => onTabChange('messages')}
              className={`flex items-center gap-4 w-full p-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-zinc-900 font-sans text-sm transition-colors cursor-pointer text-left relative focus:outline-none ${
                activeTab === 'messages' ? 'font-semibold text-neutral-950 dark:text-white bg-neutral-100 dark:bg-zinc-900' : 'text-neutral-700 dark:text-zinc-300'
              }`}
            >
              <div className="relative">
                <MessageIcon className={`w-6 h-6 ${activeTab === 'messages' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[9px] font-sans font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white dark:border-black">
                    {unreadCount}
                  </span>
                )}
              </div>
              <span>Messages</span>
            </button>

            {/* Create Post Tab */}
            <button
              onClick={onOpenCreateModal}
              className="flex items-center gap-4 w-full p-3 hover:bg-neutral-100 dark:hover:bg-zinc-900 font-sans text-sm transition-colors cursor-pointer text-left text-neutral-700 dark:text-zinc-300 rounded-lg focus:outline-none"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
              <span>Create</span>
            </button>

            {/* Profile Tab */}
            <button
              onClick={() => onTabChange('profile')}
              className={`flex items-center gap-4 w-full p-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-zinc-900 font-sans text-sm transition-colors cursor-pointer text-left focus:outline-none ${
                activeTab === 'profile' ? 'font-semibold text-neutral-950 dark:text-white bg-neutral-100 dark:bg-zinc-900' : 'text-neutral-700 dark:text-zinc-300'
              }`}
            >
              <div className="w-6 h-6 rounded-full overflow-hidden border border-neutral-300 dark:border-zinc-700 bg-zinc-800">
                <img src={currentUser.avatar} alt={currentUser.username} className="w-full h-full object-cover" />
              </div>
              <span>Profile</span>
            </button>

          </nav>
        </div>

        {/* Footer controls inside Desktop Navigation Sidebar */}
        <div className="flex flex-col gap-1.5">
          
          {/* Light/Dark mode switcher */}
          <button
            onClick={onToggleTheme}
            className="flex items-center gap-4 w-full p-3 hover:bg-neutral-100 dark:hover:bg-zinc-900 font-sans text-sm transition-colors cursor-pointer text-left text-neutral-700 dark:text-zinc-300 rounded-lg focus:outline-none"
          >
            {darkMode ? <Sun className="w-6 h-6 text-yellow-500" /> : <Moon className="w-6 h-6 text-neutral-700" />}
            <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          {/* Logout button */}
          <button
            onClick={onLogout}
            className="flex items-center gap-4 w-full p-3 hover:bg-red-50 dark:hover:bg-red-950/20 font-sans text-sm transition-colors cursor-pointer text-left text-rose-500 dark:text-rose-400 rounded-lg focus:outline-none font-medium"
          >
            <LogOut className="w-6 h-6" />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* 2. MOBILE HEADER & BOTTOM NAV BAR */}
      <div className="md:hidden select-none">
        
        {/* Mobile top header bar */}
        <header className="fixed top-0 inset-x-0 h-14 bg-white dark:bg-black border-b border-neutral-200 dark:border-zinc-800 px-4 flex items-center justify-between z-30 transition-colors">
          <h1 
            onClick={() => onTabChange('home')}
            className="font-serif text-2xl font-bold tracking-tighter italic text-neutral-900 dark:text-white cursor-pointer"
          >
            Instagram
          </h1>

          <div className="flex items-center gap-4 text-neutral-700 dark:text-neutral-200">
            {/* Quick Create Trigger */}
            <button
              onClick={onOpenCreateModal}
              className="p-1 hover:opacity-80 active:scale-95 transition-all text-neutral-900 dark:text-white"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
            </button>

            {/* Quick Messages */}
            <button
              onClick={() => onTabChange('messages')}
              className="p-1 hover:opacity-80 active:scale-95 transition-all relative text-neutral-900 dark:text-white"
            >
              <MessageIcon className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1.5 bg-rose-500 text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white dark:border-black animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
            
            {/* Quick Theme Switch */}
            <button onClick={onToggleTheme} className="p-1 text-neutral-500">
              {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* Mobile bottom persistent bar */}
        <nav className="fixed bottom-0 inset-x-0 h-12 bg-white dark:bg-black border-t border-neutral-200 dark:border-zinc-800 px-6 flex items-center justify-between z-30 transition-colors">
          
          <button onClick={() => onTabChange('home')} className="p-2">
            <Home className={`w-6 h-6 ${activeTab === 'home' ? 'text-neutral-900 dark:text-white stroke-[2.5px]' : 'text-neutral-500 dark:text-neutral-400'}`} />
          </button>

          <button onClick={onOpenSearch} className="p-2">
            <Search className="w-6 h-6 text-neutral-500 dark:text-neutral-400" />
          </button>

          <button onClick={() => onTabChange('explore')} className="p-2">
            <Compass className={`w-6 h-6 ${activeTab === 'explore' ? 'text-neutral-900 dark:text-white stroke-[2.5px]' : 'text-neutral-500 dark:text-neutral-400'}`} />
          </button>

          <button onClick={() => onTabChange('profile')} className="p-2">
            <div className={`w-6.5 h-6.5 rounded-full overflow-hidden border ${activeTab === 'profile' ? 'border-neutral-900 dark:border-white p-[1px]' : 'border-neutral-300 dark:border-zinc-700'}`}>
              <img src={currentUser.avatar} alt={currentUser.username} className="w-full h-full object-cover rounded-full" />
            </div>
          </button>

          {/* Quick logout */}
          <button onClick={onLogout} className="p-2 text-rose-500">
            <LogOut className="w-5 h-5" />
          </button>

        </nav>
      </div>
    </>
  );
}
