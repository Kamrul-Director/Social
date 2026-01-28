
export interface User {
  id: string;
  name: string;
  avatar: string;
  coverImage?: string;
  isAI?: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: number;
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  image?: string;
  likes: number;
  comments: Comment[];
  createdAt: number;
  isAIGenerated?: boolean;
}

export interface AppState {
  currentUser: User;
  posts: Post[];
  friends: User[];
}
