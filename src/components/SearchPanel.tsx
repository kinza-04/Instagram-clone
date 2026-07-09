import { useState } from 'react';
import { Search, X, CheckCircle2 } from 'lucide-react';
import { User, Post } from '../types';
import { MOCK_USERS } from '../data/mockData';

interface SearchPanelProps {
  posts: Post[];
  onClose: () => void;
  onNavigateToUser?: (username: string) => void;
}

export default function SearchPanel({ posts, onClose, onNavigateToUser }: SearchPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter mock users and posts
  const filteredUsers = searchQuery.trim() === '' 
    ? [] 
    : MOCK_USERS.filter(user => 
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const filteredPosts = searchQuery.trim() === ''
    ? []
    : posts.filter(post => 
        post.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.location && post.location.toLowerCase().includes(searchQuery.toLowerCase()))
      );

  return (
    <div className="absolute top-0 left-0 h-full w-[350px] bg-black border-r border-zinc-800 shadow-2xl z-40 p-5 flex flex-col transition-colors text-white">
      
      {/* Search Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Search</h2>
        <button 
          onClick={onClose}
          className="text-zinc-500 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Input box */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search users, captions, or locations..."
          className="w-full bg-zinc-900 text-white text-xs px-3.5 py-2.5 pl-10 rounded-lg border-none focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-colors"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          autoFocus
        />
        <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
      </div>

      {/* Results stages */}
      <div className="flex-grow overflow-y-auto flex flex-col gap-4">
        {searchQuery.trim() === '' ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-zinc-500">
            <span className="text-xs">Type a name, location or keyword.</span>
          </div>
        ) : (
          <>
            {/* Accounts Match */}
            {filteredUsers.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-zinc-500 mb-2 select-none uppercase tracking-wider">
                  Accounts
                </h3>
                <div className="flex flex-col gap-3">
                  {filteredUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        if (onNavigateToUser) onNavigateToUser(user.username);
                        onClose();
                      }}
                      className="flex items-center gap-3 w-full hover:bg-zinc-900/40 p-1.5 rounded transition-colors text-left focus:outline-none"
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-zinc-800 bg-zinc-900">
                        <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="font-semibold text-xs text-white truncate">
                            {user.username}
                          </span>
                          {user.isVerified && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 fill-sky-500 flex-shrink-0" />
                          )}
                        </div>
                        <span className="text-[10px] text-zinc-500 truncate">{user.fullName}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Posts Match */}
            {filteredPosts.length > 0 && (
              <div className="mt-2">
                <h3 className="text-xs font-bold text-zinc-500 mb-2 select-none uppercase tracking-wider">
                  Posts Matches
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {filteredPosts.map((post) => (
                    <div
                      key={post.id}
                      className="group relative aspect-square bg-zinc-900 border border-zinc-800 rounded overflow-hidden cursor-pointer"
                    >
                      <img src={post.imageUrl} alt="Post match" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2 text-white">
                        <span className="text-[10px] font-bold truncate">@{post.username}</span>
                        <p className="text-[8px] text-zinc-300 line-clamp-2 leading-tight mt-0.5">{post.caption}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {filteredUsers.length === 0 && filteredPosts.length === 0 && (
              <div className="text-center text-xs text-zinc-500 py-8">
                No matches found for "{searchQuery}"
              </div>
            )}
          </>
        )}
      </div>

    </div>
  );
}
