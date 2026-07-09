import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, MessageCircle, Send, Bookmark, Smile, CheckCircle } from 'lucide-react';
import { Post, Story, User } from '../types';

interface FeedPageProps {
  currentUser: User;
  posts: Post[];
  stories: Story[];
  onToggleLike: (postId: string) => void;
  onAddComment: (postId: string, commentText: string) => void;
  onOpenStory: (storyIndex: number) => void;
  onToggleSave?: (postId: string) => void;
  savedPostIds?: string[];
}

export default function FeedPage({
  currentUser,
  posts,
  stories,
  onToggleLike,
  onAddComment,
  onOpenStory,
  onToggleSave,
  savedPostIds = [],
}: FeedPageProps) {
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});
  const [doubleTapHeart, setDoubleTapHeart] = useState<{ [postId: string]: boolean }>({});
  const [showEmojiPicker, setShowPostIdEmojiPicker] = useState<string | null>(null);
  
  // Interactive "Follow" state for sidebar suggestions
  const [followedUsers, setFollowedUsers] = useState<{ [username: string]: boolean }>({});

  const EMOJIS = ['❤️', '🙌', '🔥', '👏', '😍', '😂', '😮', '😢'];

  const handleDoubleTap = (postId: string, isLiked: boolean) => {
    // Toggle like
    if (!isLiked) {
      onToggleLike(postId);
    }
    
    // Show visual heart animation
    setDoubleTapHeart((prev) => ({ ...prev, [postId]: true }));
    setTimeout(() => {
      setDoubleTapHeart((prev) => ({ ...prev, [postId]: false }));
    }, 800);
  };

  const handleCommentSubmit = (e: React.FormEvent, postId: string) => {
    e.preventDefault();
    const text = commentInputs[postId] || '';
    if (!text.trim()) return;

    onAddComment(postId, text);
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
  };

  const insertEmoji = (postId: string, emoji: string) => {
    setCommentInputs((prev) => ({
      ...prev,
      [postId]: (prev[postId] || '') + emoji,
    }));
    setShowPostIdEmojiPicker(null);
  };

  const toggleFollowSuggestion = (username: string) => {
    setFollowedUsers(prev => ({
      ...prev,
      [username]: !prev[username]
    }));
  };

  return (
    <div className="max-w-[850px] lg:max-w-[935px] mx-auto flex gap-8 py-5 md:py-8 px-4 justify-center select-none bg-black text-white">
      
      {/* LEFT COLUMN: Stories & Posts Feed */}
      <div className="flex-1 max-w-[470px] flex flex-col gap-4">
        
        {/* 1. Stories Tray */}
        <div className="bg-black border border-zinc-800 rounded-xl p-4 flex gap-4 overflow-x-auto scrollbar-none transition-colors">
          {stories.map((story, idx) => {
            const hasUnviewed = !story.viewed;
            const isCurrentUserStory = story.id === 'story_current';

            return (
              <button
                key={story.id}
                onClick={() => onOpenStory(idx)}
                className="flex flex-col items-center flex-shrink-0 cursor-pointer focus:outline-none focus:scale-95 transition-transform"
              >
                <div className="relative">
                  {/* Elegant Gradient Circular Border Ring */}
                  <div
                    className={`w-[66px] h-[66px] rounded-full flex items-center justify-center ${
                      hasUnviewed
                        ? 'bg-gradient-to-tr from-yellow-400 via-pink-600 to-purple-600 p-[2.5px]'
                        : 'bg-zinc-800 p-[1.5px]'
                    }`}
                  >
                    <div className="bg-black w-full h-full rounded-full p-[2px] flex items-center justify-center">
                      <img
                        src={story.userAvatar}
                        alt={story.username}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                  </div>

                  {isCurrentUserStory && (
                    <div className="absolute bottom-0 right-0 bg-[#0095f6] text-white border-2 border-black rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold font-sans">
                      +
                    </div>
                  )}
                </div>
                
                <span className="text-[11px] mt-1.5 text-zinc-400 font-sans tracking-wide max-w-[70px] truncate text-center leading-tight">
                  {story.username}
                </span>
              </button>
            );
          })}
        </div>

        {/* 2. Posts Feed Container */}
        <div className="flex flex-col gap-4">
          <AnimatePresence initial={false}>
            {posts.map((post) => {
              const isLiked = post.likes.includes(currentUser.id);
              const isSaved = savedPostIds.includes(post.id);
              const isAnimatingHeart = doubleTapHeart[post.id];

              return (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-black border border-zinc-800 rounded-lg overflow-hidden flex flex-col transition-colors"
                  id={`feed-post-${post.id}`}
                >
                  {/* Post Header */}
                  <div className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-zinc-800 bg-zinc-900">
                        <img
                          src={post.userAvatar}
                          alt={post.username}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-xs text-white">
                            {post.username}
                          </span>
                          {post.isVerified && (
                            <CheckCircle className="w-3.5 h-3.5 text-sky-500 fill-sky-500" />
                          )}
                        </div>
                        {post.location && (
                          <span className="text-[10px] text-zinc-400 leading-none mt-0.5">
                            {post.location}
                          </span>
                        )}
                      </div>
                    </div>
                    <button className="text-zinc-400 hover:text-white p-1">
                      <span className="font-bold text-lg leading-none">•••</span>
                    </button>
                  </div>

                  {/* Post Image Container */}
                  <div
                    className="relative aspect-square w-full select-none cursor-pointer overflow-hidden bg-zinc-950 flex items-center justify-center"
                    onDoubleClick={() => handleDoubleTap(post.id, isLiked)}
                  >
                    <img
                      src={post.imageUrl}
                      alt="Post content"
                      className="w-full h-full object-cover select-none"
                      style={{ filter: post.filterClass }}
                      loading="lazy"
                    />

                    {/* Interactive Double Tap Overlay Heart */}
                    <AnimatePresence>
                      {isAnimatingHeart && (
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
                          initial={{ opacity: 0, scale: 0.3 }}
                          animate={{ opacity: [0, 1, 1, 0], scale: [0.3, 1.2, 1, 0.8] }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                        >
                          <Heart className="w-20 h-20 text-white fill-white drop-shadow-2xl" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Interactive Icons Bar */}
                  <div className="flex items-center justify-between px-3.5 py-3">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => onToggleLike(post.id)}
                        className="group p-0.5 focus:scale-90 transition-transform cursor-pointer"
                      >
                        <Heart
                          className={`w-6 h-6 transition-colors ${
                            isLiked
                              ? 'text-rose-500 fill-rose-500'
                              : 'text-white hover:text-zinc-400'
                          }`}
                        />
                      </button>
                      <button className="group p-0.5 hover:text-zinc-400 transition-colors">
                        <MessageCircle className="w-6 h-6 text-white" />
                      </button>
                      <button className="group p-0.5 hover:text-zinc-400 transition-colors">
                        <Send className="w-6 h-6 text-white" />
                      </button>
                    </div>

                    <button
                      onClick={() => onToggleSave && onToggleSave(post.id)}
                      className="group p-0.5 focus:scale-95 transition-transform cursor-pointer"
                    >
                      <Bookmark
                        className={`w-6 h-6 ${
                          isSaved
                            ? 'text-white fill-white'
                            : 'text-white hover:text-zinc-400'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Likes Counter */}
                  <div className="px-4">
                    <p className="text-xs font-bold text-white leading-tight">
                      {post.likes.length.toLocaleString()} {post.likes.length === 1 ? 'like' : 'likes'}
                    </p>
                  </div>

                  {/* Caption Description */}
                  <div className="px-4 pt-1.5 pb-2 text-xs leading-relaxed text-zinc-200">
                    <span className="font-bold mr-1.5 text-white">{post.username}</span>
                    <span>{post.caption}</span>
                  </div>

                  {/* Commentary List Container */}
                  <div className="px-4 pb-3 flex flex-col gap-1.5">
                    {post.comments.length > 0 && (
                      <span className="text-[11px] font-medium text-zinc-500 select-none">
                        Comments ({post.comments.length})
                      </span>
                    )}
                    {post.comments.map((comment) => (
                      <div key={comment.id} className="text-xs leading-normal">
                        <span className="font-bold text-white mr-2">
                          {comment.username}
                        </span>
                        <span className="text-zinc-300">
                          {comment.text}
                        </span>
                      </div>
                    ))}
                    <span className="text-[9px] uppercase tracking-wider text-zinc-500 mt-1 select-none">
                      {post.createdAt}
                    </span>
                  </div>

                  {/* Inline Comment Composition Form */}
                  <div className="relative border-t border-zinc-900 py-2.5 px-4 flex items-center justify-between">
                    <form
                      onSubmit={(e) => handleCommentSubmit(e, post.id)}
                      className="flex items-center gap-3 w-full"
                    >
                      <div className="relative flex items-center">
                        <button
                          type="button"
                          onClick={() =>
                            setShowPostIdEmojiPicker(showEmojiPicker === post.id ? null : post.id)
                          }
                          className="text-zinc-400 hover:text-white transition-colors"
                        >
                          <Smile className="w-5 h-5" />
                        </button>

                        {/* Micro inline emoji helper panel */}
                        <AnimatePresence>
                          {showEmojiPicker === post.id && (
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="absolute bottom-8 left-0 z-40 bg-zinc-950 border border-zinc-800 rounded-lg p-2 shadow-xl flex gap-1.5"
                            >
                              {EMOJIS.map((emoji) => (
                                <button
                                  key={emoji}
                                  type="button"
                                  onClick={() => insertEmoji(post.id, emoji)}
                                  className="hover:scale-125 transition-transform text-sm cursor-pointer"
                                >
                                  {emoji}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <input
                        type="text"
                        placeholder="Add a comment..."
                        className="flex-grow bg-transparent text-xs text-white focus:outline-none placeholder:text-zinc-600 font-sans"
                        value={commentInputs[post.id] || ''}
                        onChange={(e) =>
                          setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                        }
                      />

                      <button
                        type="submit"
                        disabled={!(commentInputs[post.id] || '').trim()}
                        className="text-sky-500 hover:text-sky-400 font-semibold text-xs disabled:opacity-30 disabled:pointer-events-none transition-colors select-none cursor-pointer"
                      >
                        Post
                      </button>
                    </form>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* RIGHT COLUMN: Suggestions Sidebar (Matches Design HTML) */}
      <aside className="w-[320px] hidden lg:flex flex-col gap-6 shrink-0 py-2 pl-4">
        
        {/* User profile row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full overflow-hidden border border-zinc-800 bg-zinc-900">
              <img
                src={currentUser.avatar}
                alt={currentUser.username}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xs text-white">{currentUser.username}</span>
              <span className="text-zinc-500 text-[11px] truncate max-w-[170px]">{currentUser.fullName}</span>
            </div>
          </div>
          <button className="text-sky-500 hover:text-white text-xs font-semibold cursor-pointer">
            Switch
          </button>
        </div>

        {/* Suggestions Title Section */}
        <div className="flex items-center justify-between text-xs mt-1">
          <span className="text-zinc-400 font-semibold">Suggested for you</span>
          <button className="text-white hover:text-zinc-400 font-semibold cursor-pointer">
            See All
          </button>
        </div>

        {/* List of elegant suggestions */}
        <div className="flex flex-col gap-3.5">
          
          {/* Suggestion 1: Elena Wild */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-zinc-800 bg-zinc-900">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"
                  alt="elena_wild"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-xs text-white">elena_wild</span>
                  <CheckCircle className="w-3 h-3 text-sky-500 fill-sky-500" />
                </div>
                <span className="text-zinc-500 text-[10px]">Followed by cafe_minimal + 1 more</span>
              </div>
            </div>
            <button 
              onClick={() => toggleFollowSuggestion('elena_wild')}
              className={`text-xs font-bold cursor-pointer transition-colors ${
                followedUsers['elena_wild'] ? 'text-zinc-500' : 'text-sky-500 hover:text-white'
              }`}
            >
              {followedUsers['elena_wild'] ? 'Following' : 'Follow'}
            </button>
          </div>

          {/* Suggestion 2: Café Minimal */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-zinc-800 bg-zinc-900">
                <img
                  src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=80&auto=format&fit=crop&q=80"
                  alt="cafe_minimal"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xs text-white">cafe_minimal</span>
                <span className="text-zinc-500 text-[10px]">Suggested for you</span>
              </div>
            </div>
            <button 
              onClick={() => toggleFollowSuggestion('cafe_minimal')}
              className={`text-xs font-bold cursor-pointer transition-colors ${
                followedUsers['cafe_minimal'] ? 'text-zinc-500' : 'text-sky-500 hover:text-white'
              }`}
            >
              {followedUsers['cafe_minimal'] ? 'Following' : 'Follow'}
            </button>
          </div>

          {/* Suggestion 3: Sophia Art */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-zinc-800 bg-zinc-900">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&auto=format&fit=crop&q=80"
                  alt="sophia.art"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xs text-white">sophia.art</span>
                <span className="text-zinc-500 text-[10px]">New to Instagram</span>
              </div>
            </div>
            <button 
              onClick={() => toggleFollowSuggestion('sophia.art')}
              className={`text-xs font-bold cursor-pointer transition-colors ${
                followedUsers['sophia.art'] ? 'text-zinc-500' : 'text-sky-500 hover:text-white'
              }`}
            >
              {followedUsers['sophia.art'] ? 'Following' : 'Follow'}
            </button>
          </div>

        </div>

        {/* Small Footer meta details */}
        <div className="text-[10px] text-zinc-600 mt-5 leading-normal">
          <div className="flex flex-wrap gap-x-1.5 gap-y-1">
            <a href="#" className="hover:underline">About</a><span>•</span>
            <a href="#" className="hover:underline">Help</a><span>•</span>
            <a href="#" className="hover:underline">Press</a><span>•</span>
            <a href="#" className="hover:underline">API</a><span>•</span>
            <a href="#" className="hover:underline">Jobs</a><span>•</span>
            <a href="#" className="hover:underline">Privacy</a><span>•</span>
            <a href="#" className="hover:underline">Terms</a><span>•</span>
            <a href="#" className="hover:underline">Locations</a><span>•</span>
            <a href="#" className="hover:underline">Language</a><span>•</span>
            <a href="#" className="hover:underline">Meta Verified</a>
          </div>
          <p className="mt-4 uppercase tracking-wider text-[9px]">© 2026 INSTAGRAM FROM META</p>
        </div>

      </aside>

    </div>
  );
}
