import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Grid, Bookmark, User as UserIcon, Heart, MessageCircle, X, Trash2, Edit3, Settings, Smile } from 'lucide-react';
import { User, Post, Comment } from '../types';

interface ProfilePageProps {
  currentUser: User;
  posts: Post[];
  onUpdateBio: (newBio: string) => void;
  onUpdateAvatar: (newAvatarUrl: string) => void;
  onDeletePost?: (postId: string) => void;
  onToggleLikePost?: (postId: string) => void;
  onAddCommentToPost?: (postId: string, text: string) => void;
  savedPostIds?: string[];
}

export default function ProfilePage({
  currentUser,
  posts,
  onUpdateBio,
  onUpdateAvatar,
  onDeletePost,
  onToggleLikePost,
  onAddCommentToPost,
  savedPostIds = [],
}: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState<'posts' | 'saved'>('posts');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  
  // Bio edit states
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [editedBio, setEditedBio] = useState(currentUser.bio || '');
  const [newAvatarInput, setNewAvatarInput] = useState('');
  const [showAvatarEdit, setShowAvatarEdit] = useState(false);

  // Comments within active detail modal
  const [inlineComment, setInlineComment] = useState('');

  // Filter posts to show
  const myPosts = posts.filter((p) => p.userId === currentUser.id);
  const savedPosts = posts.filter((p) => savedPostIds.includes(p.id));

  const activeDisplayPosts = activeTab === 'posts' ? myPosts : savedPosts;

  const handleSaveBio = () => {
    onUpdateBio(editedBio);
    setIsEditingBio(false);
  };

  const handleSaveAvatar = () => {
    if (newAvatarInput.trim()) {
      onUpdateAvatar(newAvatarInput.trim());
      setNewAvatarInput('');
      setShowAvatarEdit(false);
    }
  };

  const handleAddModalComment = (e: React.FormEvent, postId: string) => {
    e.preventDefault();
    if (!inlineComment.trim() || !onAddCommentToPost) return;

    onAddCommentToPost(postId, inlineComment.trim());
    
    // Update the selected post in local view state to immediately show comment
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          comments: [
            ...prev.comments,
            {
              id: `c_${Date.now()}`,
              username: currentUser.username,
              text: inlineComment.trim(),
              createdAt: 'Just now',
            },
          ],
        };
      });
    }
    setInlineComment('');
  };

  const handleToggleLikeModal = (postId: string) => {
    if (!onToggleLikePost) return;
    onToggleLikePost(postId);

    if (selectedPost && selectedPost.id === postId) {
      const alreadyLiked = selectedPost.likes.includes(currentUser.id);
      setSelectedPost((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          likes: alreadyLiked
            ? prev.likes.filter((uid) => uid !== currentUser.id)
            : [...prev.likes, currentUser.id],
        };
      });
    }
  };

  return (
    <div className="w-full max-w-[930px] mx-auto py-8 px-4 select-none">
      
      {/* 1. PROFILE HEADER SECTION */}
      <header className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-20 pb-11 border-b border-zinc-800">
        
        {/* Avatar container */}
        <div className="relative group flex-shrink-0 cursor-pointer" onClick={() => setShowAvatarEdit(true)}>
          <div className="w-[150px] h-[150px] rounded-full overflow-hidden border border-zinc-800 bg-zinc-900">
            <img
              src={currentUser.avatar}
              alt={currentUser.username}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
            <Edit3 className="w-5 h-5 mr-1" /> Change Foto
          </div>
        </div>

        {/* User text layout details */}
        <div className="flex-grow flex flex-col items-center md:items-start gap-4">
          
          {/* Identity toprow */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 w-full">
            <h2 className="text-xl text-neutral-900 dark:text-neutral-100 font-sans tracking-wide">
              {currentUser.username}
            </h2>
            <button
              onClick={() => setIsEditingBio(!isEditingBio)}
              className="bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold px-4 py-2 rounded-lg border border-zinc-800 transition-colors"
            >
              {isEditingBio ? 'Close Edit' : 'Edit profile'}
            </button>
            <button className="text-zinc-200 hover:opacity-85 transition-opacity">
              <Settings className="w-5 h-5" />
            </button>
          </div>

          {/* Stats counts row */}
          <div className="flex gap-8 text-sm select-none my-1">
            <span>
              <strong className="font-semibold text-white">{myPosts.length}</strong> posts
            </span>
            <span>
              <strong className="font-semibold text-white">{currentUser.followersCount.toLocaleString()}</strong> followers
            </span>
            <span>
              <strong className="font-semibold text-white">{currentUser.followingCount.toLocaleString()}</strong> following
            </span>
          </div>

          {/* Real BIO rendering */}
          {isEditingBio ? (
            <div className="w-full max-w-[400px] flex flex-col gap-3 mt-2">
              <textarea
                rows={3}
                className="w-full bg-zinc-900 text-white text-xs p-3 rounded-lg border border-zinc-800 focus:outline-none"
                value={editedBio}
                onChange={(e) => setEditedBio(e.target.value)}
                placeholder="Write your bio..."
              />
              <button
                onClick={handleSaveBio}
                className="bg-[#0095f6] hover:bg-[#1877f2] text-white text-xs font-semibold py-1.5 rounded-lg w-fit px-4"
              >
                Save Bio
              </button>
            </div>
          ) : (
            <div className="text-sm text-center md:text-left">
              <h3 className="font-semibold text-white">{currentUser.fullName}</h3>
              <p className="text-zinc-300 whitespace-pre-line mt-1 leading-relaxed">
                {currentUser.bio || "No bio yet. Click Edit Profile to add one."}
              </p>
            </div>
          )}
        </div>
      </header>

      {/* 2. TABS SELECTOR ROW */}
      <div className="flex justify-center border-b border-zinc-800 mb-6 select-none">
        <div className="flex gap-14 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex items-center gap-1.5 py-4 border-t -mt-[1px] transition-colors ${
              activeTab === 'posts'
                ? 'border-white text-white font-bold'
                : 'border-transparent hover:text-zinc-300'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>Posts</span>
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`flex items-center gap-1.5 py-4 border-t -mt-[1px] transition-colors ${
              activeTab === 'saved'
                ? 'border-white text-white font-bold'
                : 'border-transparent hover:text-zinc-300'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Saved</span>
          </button>
        </div>
      </div>

      {/* 3. POST GRID BLOCK */}
      {activeDisplayPosts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center select-none">
          <div className="w-16 h-16 rounded-full border-2 border-zinc-800 flex items-center justify-center mb-4 text-zinc-500">
            {activeTab === 'posts' ? <Grid className="w-8 h-8" /> : <Bookmark className="w-8 h-8" />}
          </div>
          <h3 className="text-base font-semibold text-white">
            {activeTab === 'posts' ? 'No Posts Yet' : 'No Saved Posts'}
          </h3>
          <p className="text-xs text-zinc-500 max-w-[280px] mt-1">
            {activeTab === 'posts'
              ? 'When you share photos, they will appear here on your profile.'
              : 'Saved photos and videos will remain visible only to you.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-1 md:gap-7 rounded-xl overflow-hidden">
          {activeDisplayPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="relative aspect-square cursor-pointer overflow-hidden group bg-zinc-950 border border-zinc-800 rounded"
            >
              <img
                src={post.imageUrl}
                alt="Profile thumbnail"
                style={{ filter: post.filterClass }}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              {/* Overlay display counters */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white text-sm md:text-base font-semibold">
                <div className="flex items-center gap-1.5">
                  <Heart className="w-5 h-5 fill-white" />
                  <span>{post.likes.length}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MessageCircle className="w-5 h-5 fill-white" />
                  <span>{post.comments.length}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. MODAL: DETAILED POST DIALOG */}
      <AnimatePresence>
        {selectedPost && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="absolute inset-0 cursor-default" onClick={() => setSelectedPost(null)} />

            <div className="relative bg-black rounded-xl overflow-hidden w-full max-w-[850px] md:h-[550px] max-h-[90vh] flex flex-col md:flex-row shadow-2xl border border-zinc-800 z-10 transition-colors">
              
              {/* Left stage: Custom photo stage with filter applied */}
              <div className="w-full md:w-[55%] h-[300px] md:h-full bg-black flex items-center justify-center relative select-none">
                <img
                  src={selectedPost.imageUrl}
                  alt="Post details"
                  style={{ filter: selectedPost.filterClass }}
                  className="w-full h-full object-cover max-h-full"
                />
              </div>

              {/* Right stage: Stats, comments and delete tools */}
              <div className="w-full md:w-[45%] h-full flex flex-col justify-between p-4 bg-black transition-colors">
                
                {/* Dialog User profile header */}
                <div className="flex items-center justify-between pb-3.5 border-b border-zinc-900 select-none">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-zinc-800">
                      <img
                        src={selectedPost.userAvatar}
                        alt={selectedPost.username}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <span className="font-bold text-xs text-white">{selectedPost.username}</span>
                      {selectedPost.location && (
                        <p className="text-[10px] text-zinc-400">{selectedPost.location}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Deletion capabilities (only display if post belongs to user) */}
                    {selectedPost.userId === currentUser.id && onDeletePost && (
                      <button
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this post?")) {
                            onDeletePost(selectedPost.id);
                            setSelectedPost(null);
                          }
                        }}
                        className="text-red-500 hover:bg-zinc-900 p-1.5 rounded transition-colors"
                        title="Delete Post"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    )}

                    <button onClick={() => setSelectedPost(null)} className="text-zinc-400 hover:text-white transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Scrolled comments panel */}
                <div className="flex-grow overflow-y-auto py-3.5 flex flex-col gap-3">
                  {/* Original Caption */}
                  <div className="text-xs">
                    <span className="font-bold text-white mr-1.5">{selectedPost.username}</span>
                    <span className="text-zinc-300">{selectedPost.caption}</span>
                  </div>

                  {selectedPost.comments.map((comm) => (
                    <div key={comm.id} className="text-xs">
                      <span className="font-bold text-white mr-1.5">{comm.username}</span>
                      <span className="text-zinc-300">{comm.text}</span>
                    </div>
                  ))}
                </div>

                {/* Lower Metrics action footer */}
                <div className="pt-2 border-t border-zinc-900 select-none">
                  
                  {/* Hearts metrics row */}
                  <div className="flex justify-between items-center mb-2.5">
                    <div className="flex items-center gap-4">
                      <button onClick={() => handleToggleLikeModal(selectedPost.id)}>
                        <Heart
                          className={`w-5.5 h-5.5 ${
                            selectedPost.likes.includes(currentUser.id)
                              ? 'text-rose-500 fill-rose-500'
                              : 'text-white hover:text-zinc-400'
                          }`}
                        />
                      </button>
                      <span className="text-xs font-semibold text-white">
                        {selectedPost.likes.length.toLocaleString()} {selectedPost.likes.length === 1 ? 'like' : 'likes'}
                      </span>
                    </div>
                  </div>

                  {/* Inline Modal Comment Composer */}
                  <form
                    onSubmit={(e) => handleAddModalComment(e, selectedPost.id)}
                    className="flex items-center gap-2"
                  >
                    <Smile className="w-5 h-5 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      className="flex-grow text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none bg-transparent"
                      value={inlineComment}
                      onChange={(e) => setInlineComment(e.target.value)}
                    />
                    <button
                      type="submit"
                      disabled={!inlineComment.trim()}
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

      {/* 5. MODAL: EDIT AVATAR IMAGE BOX */}
      <AnimatePresence>
        {showAvatarEdit && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="absolute inset-0 cursor-default" onClick={() => setShowAvatarEdit(false)} />
            <div className="relative bg-black rounded-xl max-w-sm w-full p-6 shadow-2xl border border-zinc-800 z-10 text-white transition-colors">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-sm">Update profile photo</h3>
                <button onClick={() => setShowAvatarEdit(false)} className="text-zinc-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-zinc-500 mb-4">Enter any image URL to change your profile avatar instantly.</p>
              <input
                type="text"
                className="w-full bg-zinc-900 text-white text-xs p-2.5 rounded border border-zinc-800 focus:outline-none focus:border-zinc-700 mb-4"
                placeholder="https://images.unsplash.com/photo-..."
                value={newAvatarInput}
                onChange={(e) => setNewAvatarInput(e.target.value)}
              />
              <div className="flex gap-2 justify-end text-xs">
                <button
                  type="button"
                  onClick={() => setShowAvatarEdit(false)}
                  className="px-4 py-2 hover:bg-neutral-100 dark:hover:bg-zinc-900 font-semibold rounded-lg text-neutral-600 dark:text-neutral-400"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveAvatar}
                  disabled={!newAvatarInput.trim()}
                  className="px-4 py-2 bg-[#0095f6] hover:bg-[#1877f2] disabled:opacity-30 disabled:pointer-events-none text-white font-semibold rounded-lg"
                >
                  Apply Photo
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
