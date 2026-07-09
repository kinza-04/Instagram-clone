export interface User {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
  bio?: string;
  followersCount: number;
  followingCount: number;
  isVerified?: boolean;
}

export interface Comment {
  id: string;
  username: string;
  text: string;
  createdAt: string;
}

export interface Post {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  location?: string;
  imageUrl: string;
  filterClass?: string; // Tailwind filter name or preset name
  caption: string;
  likes: string[]; // List of userIds who liked it
  comments: Comment[];
  createdAt: string;
  isVerified?: boolean;
}

export interface Story {
  id: string;
  username: string;
  userAvatar: string;
  images: string[];
  viewed?: boolean;
}

export interface DirectMessage {
  id: string;
  senderId: string;
  text: string;
  createdAt: string;
}

export interface DirectChat {
  id: string;
  participant: {
    username: string;
    fullName: string;
    avatar: string;
    isOnline: boolean;
  };
  messages: DirectMessage[];
}
