import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, MessageCircle, X, CheckCircle, Smile } from 'lucide-react';
import { EXPLORE_GRID_PRESETS } from '../data/mockData';
import { Comment, User } from '../types';

interface ExplorePageProps {
  currentUser: User;
}

interface ExploreItem {
  id: string;
  imageUrl: string;
  likes: number;
  comments: number;
  isLarge?: boolean;
}

export default function ExplorePage({ currentUser }: ExplorePageProps) {
  const [selectedItem, setSelectedItem] = useState<ExploreItem | null>(null);
  
  // Manage comments inside the explore modal dynamically
  const [modalComments, setModalComments] = useState<{ [itemId: string]: Comment[] }>({
    ex_1: [
      { id: 'ec_1', username: 'elena_wild', text: 'Stunning light and depth! 🌅', createdAt: '1h ago' },
      { id: 'ec_2', username: 'cafe_minimal', text: 'Remarkable composition here.', createdAt: '45m ago' }
    ],
    ex_2: [
      { id: 'ec_3', username: 'sophia.art', text: 'This looks so serene! Love the mood.', createdAt: '3h ago' }
    ]
  });
  
  const [newCommentText, setNewCommentText] = useState('');
  const [likedItems, setLikedItems] = useState<{ [itemId: string]: boolean }>({});

  const handleAddComment = (itemId: string) => {
    if (!newCommentText.trim()) return;

    const newComment: Comment = {
      id: `ec_${Date.now()}`,
      username: currentUser.username,
      text: newCommentText.trim(),
      createdAt: 'Just now'
    };

    setModalComments((prev) => ({
      ...prev,
      [itemId]: [...(prev[itemId] || []), newComment]
    }));
    setNewCommentText('');
  };

  const handleToggleLike = (itemId: string) => {
    setLikedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  return (
    <div className="w-full max-w-[950px] mx-auto py-6 px-4 select-none">
      
      {/* 3x3 staggered bento explore grid layout */}
      <div className="grid grid-cols-3 gap-1 md:gap-7 rounded-xl overflow-hidden">
        {EXPLORE_GRID_PRESETS.map((item, idx) => {
          // Instagram pattern: Every 5th item spans 2 rows for that premium asymmetrical grid look!
          const isLargeLayout = idx % 5 === 0;

          return (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className={`relative cursor-pointer overflow-hidden aspect-square group bg-zinc-950 border border-zinc-800 rounded ${
                isLargeLayout ? 'row-span-2 col-span-1 md:aspect-auto md:h-full h-auto' : ''
              }`}
            >
              <img
                src={item.imageUrl}
                alt="Explore tile"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />

              {/* Hover Overlay Displaying Stats */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white text-sm md:text-base font-semibold z-10">
                <div className="flex items-center gap-1.5">
                  <Heart className="w-5 h-5 fill-white" />
                  <span>{likedItems[item.id] ? item.likes + 1 : item.likes}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MessageCircle className="w-5 h-5 fill-white" />
                  <span>{(modalComments[item.id] || []).length + item.comments}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Fullscreen Detailed Post view Overlay Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50 animate-fade-in">
            {/* Click backdrop to close */}
            <div className="absolute inset-0 cursor-default" onClick={() => setSelectedItem(null)} />

            <div className="relative bg-black rounded-xl overflow-hidden w-full max-w-[850px] md:h-[550px] max-h-[90vh] flex flex-col md:flex-row shadow-2xl border border-zinc-800 z-10 transition-colors">
              
              {/* Left stage: Large photo */}
              <div className="w-full md:w-[55%] h-[300px] md:h-full bg-black flex items-center justify-center relative">
                <img
                  src={selectedItem.imageUrl}
                  alt="Selected explore content"
                  className="w-full h-full object-cover max-h-full"
                />
                <button
                  onClick={() => handleToggleLike(selectedItem.id)}
                  className="absolute bottom-4 left-4 bg-zinc-900/60 hover:bg-zinc-800 p-2.5 rounded-full transition-colors backdrop-blur text-white border border-zinc-800"
                >
                  <Heart className={`w-5 h-5 ${likedItems[selectedItem.id] ? 'fill-rose-500 text-rose-500 scale-110' : ''}`} />
                </button>
              </div>

              {/* Right stage: Details, commentary feed and writing box */}
              <div className="w-full md:w-[45%] h-full flex flex-col justify-between p-4 bg-black">
                
                {/* Header user detail */}
                <div className="flex items-center justify-between pb-3.5 border-b border-zinc-900">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"
                        alt="Creator"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-xs text-white">explore_curator</span>
                        <CheckCircle className="w-3.5 h-3.5 text-sky-500 fill-sky-500" />
                      </div>
                      <span className="text-[10px] text-zinc-500">Sponsored</span>
                    </div>
                  </div>
                  
                  <button onClick={() => setSelectedItem(null)} className="text-zinc-500 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Scroller for commentary lists */}
                <div className="flex-grow overflow-y-auto py-3.5 flex flex-col gap-3">
                  <div className="text-xs">
                    <span className="font-bold text-white mr-1.5">explore_curator</span>
                    <span className="text-zinc-300">Inspired by light, shadow and daily symmetry. ✨🌅 Feel free to share your thoughts in the comments.</span>
                  </div>

                  {(modalComments[selectedItem.id] || []).map((comm) => (
                    <div key={comm.id} className="text-xs">
                      <span className="font-bold text-white mr-1.5">{comm.username}</span>
                      <span className="text-zinc-300">{comm.text}</span>
                    </div>
                  ))}
                </div>

                {/* Footer metrics and comment writing container */}
                <div className="pt-2 border-t border-zinc-900">
                  <div className="flex items-center justify-between text-xs font-semibold mb-2 text-white">
                    <span>
                      {(likedItems[selectedItem.id] ? selectedItem.likes + 1 : selectedItem.likes).toLocaleString()} likes
                    </span>
                    <span className="text-zinc-500 font-normal">July 9, 2026</span>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleAddComment(selectedItem.id);
                    }}
                    className="flex items-center gap-2"
                  >
                    <Smile className="w-5 h-5 text-zinc-500" />
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      className="flex-grow text-xs text-white focus:outline-none bg-transparent placeholder:text-zinc-600"
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                    />
                    <button
                      type="submit"
                      disabled={!newCommentText.trim()}
                      className="text-[#0095f6] hover:text-[#1877f2] font-semibold text-xs disabled:opacity-30 transition-colors"
                    >
                      Post
                    </button>
                  </form>
                </div>

              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
