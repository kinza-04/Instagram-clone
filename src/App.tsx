import { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { Post, Story, DirectChat, User } from './types';
import { 
  INITIAL_USER, 
  INITIAL_POSTS, 
  INITIAL_STORIES, 
  INITIAL_CHATS 
} from './data/mockData';

// Import all sub-components
import LandingPage from './components/LandingPage';
import Navbar from './components/Navbar';
import FeedPage from './components/FeedPage';
import StoryViewer from './components/StoryViewer';
import ExplorePage from './components/ExplorePage';
import DirectPage from './components/DirectPage';
import SearchPanel from './components/SearchPanel';
import CreatePostModal from './components/CreatePostModal';
import ProfilePage from './components/ProfilePage';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('ig_current_user');
    return stored ? JSON.parse(stored) : null;
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    const stored = localStorage.getItem('ig_posts');
    return stored ? JSON.parse(stored) : INITIAL_POSTS;
  });

  const [stories, setStories] = useState<Story[]>(() => {
    const stored = localStorage.getItem('ig_stories');
    return stored ? JSON.parse(stored) : INITIAL_STORIES;
  });

  const [chats, setChats] = useState<DirectChat[]>(() => {
    const stored = localStorage.getItem('ig_chats');
    return stored ? JSON.parse(stored) : INITIAL_CHATS;
  });

  const [savedPostIds, setSavedPostIds] = useState<string[]>(() => {
    const stored = localStorage.getItem('ig_saved_posts');
    return stored ? JSON.parse(stored) : [];
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const stored = localStorage.getItem('ig_dark_mode');
    return stored ? JSON.parse(stored) : true;
  });

  const [activeTab, setActiveTab] = useState<'home' | 'explore' | 'messages' | 'profile'>('home');
  const [activeStoryIdx, setActiveStoryIdx] = useState<number | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ig_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('ig_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('ig_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('ig_stories', JSON.stringify(stories));
  }, [stories]);

  useEffect(() => {
    localStorage.setItem('ig_chats', JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    localStorage.setItem('ig_saved_posts', JSON.stringify(savedPostIds));
  }, [savedPostIds]);

  useEffect(() => {
    localStorage.setItem('ig_dark_mode', JSON.stringify(darkMode));
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLogin = (username: string) => {
    const newUser: User = {
      ...INITIAL_USER,
      username: username || INITIAL_USER.username,
      fullName: username === 'meta_guest' ? 'Meta Guest' : INITIAL_USER.fullName,
    };
    setCurrentUser(newUser);
    setActiveTab('home');
  };

  const handleSignup = (username: string, fullName: string) => {
    const newUser: User = {
      id: `user_${Date.now()}`,
      username,
      fullName,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      followersCount: 0,
      followingCount: 0,
    };
    setCurrentUser(newUser);
    setActiveTab('home');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.clear();
    setPosts(INITIAL_POSTS);
    setStories(INITIAL_STORIES);
    setChats(INITIAL_CHATS);
    setSavedPostIds([]);
  };

  const handleToggleLike = (postId: string) => {
    if (!currentUser) return;
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        const alreadyLiked = post.likes.includes(currentUser.id);
        return {
          ...post,
          likes: alreadyLiked
            ? post.likes.filter((uid) => uid !== currentUser.id)
            : [...post.likes, currentUser.id],
        };
      })
    );
  };

  const handleAddComment = (postId: string, text: string) => {
    if (!currentUser) return;
    const newComment = {
      id: `c_${Date.now()}`,
      username: currentUser.username,
      text,
      createdAt: 'Just now',
    };
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        return {
          ...post,
          comments: [...post.comments, newComment],
        };
      })
    );
  };

  const handleToggleSave = (postId: string) => {
    setSavedPostIds((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };

  const handlePostCreated = (newPostData: Omit<Post, 'id' | 'likes' | 'comments' | 'createdAt'>) => {
    const newPost: Post = {
      ...newPostData,
      id: `post_${Date.now()}`,
      likes: [],
      comments: [],
      createdAt: 'Just now',
    };
    setPosts((prev) => [newPost, ...prev]);
  };

  const handleDeletePost = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    setSavedPostIds((prev) => prev.filter((id) => id !== postId));
  };

  const handleStoryViewed = (storyId: string) => {
    setStories((prev) =>
      prev.map((story) => (story.id === storyId ? { ...story, viewed: true } : story))
    );
  };

  const handleSendMessage = (chatId: string, text: string, senderId: string) => {
    const newMessage = {
      id: `msg_${Date.now()}`,
      senderId,
      text,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id !== chatId) return chat;
        return {
          ...chat,
          messages: [...chat.messages, newMessage],
        };
      })
    );
  };

  const handleReceiveReply = (chatId: string, text: string) => {
    const chat = chats.find(c => c.id === chatId);
    if (!chat) return;

    const newMessage = {
      id: `msg_${Date.now() + 1}`,
      senderId: chat.participant.username,
      text,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChats((prev) =>
      prev.map((c) => {
        if (c.id !== chatId) return c;
        return {
          ...c,
          messages: [...c.messages, newMessage],
        };
      })
    );
  };

  const handleUpdateBio = (newBio: string) => {
    if (!currentUser) return;
    setCurrentUser({
      ...currentUser,
      bio: newBio,
    });
  };

  const handleUpdateAvatar = (newAvatarUrl: string) => {
    if (!currentUser) return;
    setCurrentUser({
      ...currentUser,
      avatar: newAvatarUrl,
    });
    setPosts((prev) =>
      prev.map((p) => (p.userId === currentUser.id ? { ...p, userAvatar: newAvatarUrl } : p))
    );
  };

  const unreadMessagesCount = chats.reduce((total, chat) => {
    const lastMsg = chat.messages[chat.messages.length - 1];
    if (lastMsg && lastMsg.senderId !== currentUser?.id) {
      return total + 1;
    }
    return total;
  }, 0);

  if (!currentUser) {
    return <LandingPage onLogin={handleLogin} onSignup={handleSignup} />;
  }

  return (
    <div className="min-h-screen bg-black text-white transition-colors duration-200">
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setIsSearchOpen(false);
        }}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onOpenSearch={() => setIsSearchOpen(!isSearchOpen)}
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode(!darkMode)}
        onLogout={handleLogout}
        unreadCount={unreadMessagesCount}
      />

      <div className="pt-14 pb-16 md:pt-0 md:pb-0 md:pl-[245px] relative">
        <main className="min-h-screen">
          {activeTab === 'home' && (
            <FeedPage
              currentUser={currentUser}
              posts={posts}
              stories={stories}
              onToggleLike={handleToggleLike}
              onAddComment={handleAddComment}
              onOpenStory={(idx) => setActiveStoryIdx(idx)}
              onToggleSave={handleToggleSave}
              savedPostIds={savedPostIds}
            />
          )}

          {activeTab === 'explore' && (
            <ExplorePage currentUser={currentUser} />
          )}

          {activeTab === 'messages' && (
            <DirectPage
              currentUser={currentUser}
              chats={chats}
              onSendMessage={handleSendMessage}
              onReceiveReply={handleReceiveReply}
            />
          )}

          {activeTab === 'profile' && (
            <ProfilePage
              currentUser={currentUser}
              posts={posts}
              onUpdateBio={handleUpdateBio}
              onUpdateAvatar={handleUpdateAvatar}
              onDeletePost={handleDeletePost}
              onToggleLikePost={handleToggleLike}
              onAddCommentToPost={handleAddComment}
              savedPostIds={savedPostIds}
            />
          )}
        </main>

        <AnimatePresence>
          {isSearchOpen && (
            <SearchPanel
              posts={posts}
              onClose={() => setIsSearchOpen(false)}
              onNavigateToUser={(user) => {
                if (user === currentUser.username) {
                  setActiveTab('profile');
                } else {
                  const post = posts.find(p => p.username === user);
                  if (post) {
                    const el = document.getElementById(`feed-post-${post.id}`);
                    el?.scrollIntoView({ behavior: 'smooth' });
                    setActiveTab('home');
                  }
                }
              }}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isCreateModalOpen && (
            <CreatePostModal
              currentUser={currentUser}
              onClose={() => setIsCreateModalOpen(false)}
              onPostCreated={handlePostCreated}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {activeStoryIdx !== null && (
            <StoryViewer
              stories={stories}
              initialStoryIndex={activeStoryIdx}
              onClose={() => setActiveStoryIdx(null)}
              onStoryViewed={handleStoryViewed}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
