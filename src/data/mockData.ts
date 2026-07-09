import { User, Post, Story, DirectChat } from '../types';

export const INITIAL_USER: User = {
  id: 'current_user',
  username: 'traveler_sam',
  fullName: 'Sam Wilson',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  bio: '📸 Visual Storyteller | Based in SF ✈️\nNext stop: Tokyo 🇯🇵\nCollabs: sam@travelersam.com',
  followersCount: 1420,
  followingCount: 382,
};

export const MOCK_USERS: User[] = [
  {
    id: 'user_1',
    username: 'elena_wild',
    fullName: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    bio: 'Wanderlust explorer & outdoor photographer ⛰️🌲 Let\'s protect our green home.',
    followersCount: 18500,
    followingCount: 521,
    isVerified: true,
  },
  {
    id: 'user_2',
    username: 'cafe_minimal',
    fullName: 'Liam Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: 'Coffee, architecture, and minimal design. ☕📐 Studio owner in Tokyo.',
    followersCount: 43200,
    followingCount: 219,
    isVerified: true,
  },
  {
    id: 'user_3',
    username: 'sophia.art',
    fullName: 'Sophia Martinez',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'Impressionist oil painter 🎨 California sunsets are my forever muse.',
    followersCount: 8900,
    followingCount: 412,
  },
  {
    id: 'user_4',
    username: 'pixel_architect',
    fullName: 'Marcus Vance',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    bio: 'Capturing symmetry and scale in concrete and glass. 🏙️ Nikon shooter.',
    followersCount: 5600,
    followingCount: 89,
  }
];

export const INITIAL_STORIES: Story[] = [
  {
    id: 'story_current',
    username: 'Your Story',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&auto=format&fit=crop&q=80',
    ],
    viewed: false,
  },
  {
    id: 'story_1',
    username: 'elena_wild',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80', // Mountain
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&auto=format&fit=crop&q=80', // Camping
    ],
    viewed: false,
  },
  {
    id: 'story_2',
    username: 'cafe_minimal',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80', // Pour over
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80', // Cafe interior
    ],
    viewed: false,
  },
  {
    id: 'story_3',
    username: 'sophia.art',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&auto=format&fit=crop&q=80', // Abstract painting
    ],
    viewed: false,
  },
  {
    id: 'story_4',
    username: 'pixel_architect',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80', // Skyscraper
    ],
    viewed: false,
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post_1',
    userId: 'user_1',
    username: 'elena_wild',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    location: 'Yosemite National Park',
    imageUrl: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&auto=format&fit=crop&q=80',
    caption: 'Waking up to views like this is worth every single freezing minute in the sleeping bag. 🏔️⛺️ Grateful to experience the majestic Yosemite Valley in autumn.',
    likes: ['user_2', 'user_3', 'current_user'],
    isVerified: true,
    comments: [
      {
        id: 'c1',
        username: 'cafe_minimal',
        text: 'This composition is incredible, Elena! Adding to my bucket list.',
        createdAt: '2 hours ago',
      },
      {
        id: 'c2',
        username: 'traveler_sam',
        text: 'What camera setup did you use for this? The lighting is spot on.',
        createdAt: '1 hour ago',
      }
    ],
    createdAt: '3 hours ago',
  },
  {
    id: 'post_2',
    userId: 'user_2',
    username: 'cafe_minimal',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    location: 'Tokyo, Japan',
    imageUrl: 'https://images.unsplash.com/photo-1490815022136-70754270f372?w=800&auto=format&fit=crop&q=80',
    caption: 'Afternoon light casting shadows in our micro-roastery. Finding beauty in the simple geometries of daily life. ☕️📐',
    likes: ['user_1', 'user_4'],
    isVerified: true,
    comments: [
      {
        id: 'c3',
        username: 'sophia.art',
        text: 'The color palette here is so calming. Love the sepia undertones.',
        createdAt: '4 hours ago',
      }
    ],
    createdAt: '5 hours ago',
  },
  {
    id: 'post_3',
    userId: 'user_3',
    username: 'sophia.art',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    location: 'Carmel-by-the-Sea, California',
    imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=80',
    caption: 'Finally finished my largest piece this season! 🎨 Oceanscapes always test my patience with layers, but capturing that golden Pacific light is incredibly rewarding.',
    likes: ['user_1', 'user_2', 'user_4', 'current_user'],
    comments: [
      {
        id: 'c4',
        username: 'elena_wild',
        text: 'So beautiful Sophia! You captured the movement of the waves perfectly.',
        createdAt: '6 hours ago',
      }
    ],
    createdAt: '8 hours ago',
  },
  {
    id: 'post_4',
    userId: 'user_4',
    username: 'pixel_architect',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    location: 'The Vessel, New York City',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
    caption: 'Interlocking honeycomb. Perspective and pattern in architectural design. New York never fails to surprise.',
    likes: ['user_2'],
    comments: [],
    createdAt: '1 day ago',
  }
];

export const INITIAL_CHATS: DirectChat[] = [
  {
    id: 'chat_1',
    participant: {
      username: 'elena_wild',
      fullName: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      isOnline: true,
    },
    messages: [
      {
        id: 'm1',
        senderId: 'user_1',
        text: 'Hey Sam! Are you still planning the photography trip to Yosemite next month?',
        createdAt: 'Yesterday',
      },
      {
        id: 'm2',
        senderId: 'current_user',
        text: 'Hey Elena! Yes, absolutely. I was actually looking at campsite permits this morning.',
        createdAt: 'Yesterday',
      },
      {
        id: 'm3',
        senderId: 'user_1',
        text: 'Awesome! Let me know if you need any gear. I have a spare 4-person four-season tent.',
        createdAt: 'Yesterday',
      },
      {
        id: 'm4',
        senderId: 'current_user',
        text: 'That would be life-saving! Thanks so much, I will keep you posted.',
        createdAt: '10:14 AM',
      },
      {
        id: 'm5',
        senderId: 'user_1',
        text: 'Perfect! Talk soon.',
        createdAt: '10:15 AM',
      }
    ]
  },
  {
    id: 'chat_2',
    participant: {
      username: 'cafe_minimal',
      fullName: 'Liam Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      isOnline: false,
    },
    messages: [
      {
        id: 'm6',
        senderId: 'user_2',
        text: 'Hi Sam, your photo print order is ready to ship!',
        createdAt: '2 days ago',
      },
      {
        id: 'm7',
        senderId: 'current_user',
        text: 'Wow, that was fast. Thank you Liam! I cannot wait to hang it up in the living room.',
        createdAt: '2 days ago',
      }
    ]
  },
  {
    id: 'chat_3',
    participant: {
      username: 'sophia.art',
      fullName: 'Sophia Martinez',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isOnline: true,
    },
    messages: [
      {
        id: 'm8',
        senderId: 'user_3',
        text: 'Loved your story yesterday. The beach sunset was gorgeous!',
        createdAt: '3 days ago',
      }
    ]
  }
];

export const EXPLORE_GRID_PRESETS = [
  { id: 'ex_1', imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600&auto=format&fit=crop&q=80', likes: 1200, comments: 45, isLarge: true },
  { id: 'ex_2', imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop&q=80', likes: 852, comments: 22, isLarge: false },
  { id: 'ex_3', imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80', likes: 1540, comments: 92, isLarge: false },
  { id: 'ex_4', imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&auto=format&fit=crop&q=80', likes: 934, comments: 14, isLarge: false },
  { id: 'ex_5', imageUrl: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=600&auto=format&fit=crop&q=80', likes: 622, comments: 8, isLarge: false },
  { id: 'ex_6', imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&auto=format&fit=crop&q=80', likes: 3105, comments: 114, isLarge: true },
  { id: 'ex_7', imageUrl: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=600&auto=format&fit=crop&q=80', likes: 4520, comments: 310, isLarge: false },
  { id: 'ex_8', imageUrl: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&auto=format&fit=crop&q=80', likes: 2110, comments: 84, isLarge: false },
  { id: 'ex_9', imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&auto=format&fit=crop&q=80', likes: 3410, comments: 198, isLarge: false },
  { id: 'ex_10', imageUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&auto=format&fit=crop&q=80', likes: 1120, comments: 43, isLarge: false },
];
