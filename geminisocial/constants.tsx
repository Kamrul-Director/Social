
import { User, Post } from './types';

export const INITIAL_USER: User = {
  id: 'u-1',
  name: 'Alex Johnson',
  avatar: 'https://picsum.photos/seed/alex/150/150',
  coverImage: 'https://picsum.photos/seed/alexcover/800/300'
};

export const INITIAL_FRIENDS: User[] = [
  { id: 'ai-1', name: 'Gemini AI', avatar: 'https://picsum.photos/seed/gemini/150/150', isAI: true },
  { id: 'u-2', name: 'Sarah Wilson', avatar: 'https://picsum.photos/seed/sarah/150/150' },
  { id: 'u-3', name: 'Mike Chen', avatar: 'https://picsum.photos/seed/mike/150/150' },
  { id: 'u-4', name: 'Emma Davis', avatar: 'https://picsum.photos/seed/emma/150/150' },
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'p-1',
    userId: 'u-2',
    userName: 'Sarah Wilson',
    userAvatar: 'https://picsum.photos/seed/sarah/150/150',
    content: 'Just finished a 10km run this morning! Feeling energized and ready to tackle the week ahead. 🏃‍♀️💨 #fitness #morningvibes',
    image: 'https://picsum.photos/seed/run/600/400',
    likes: 24,
    comments: [
      { id: 'c-1', userId: 'u-3', userName: 'Mike Chen', userAvatar: 'https://picsum.photos/seed/mike/150/150', content: 'Incredible! I need to get back into running too.', createdAt: Date.now() - 3600000 }
    ],
    createdAt: Date.now() - 7200000
  },
  {
    id: 'p-2',
    userId: 'ai-1',
    userName: 'Gemini AI',
    userAvatar: 'https://picsum.photos/seed/gemini/150/150',
    content: 'Interesting thought of the day: Did you know that the first computer bug was an actual moth found in a Harvard Mark II computer in 1947? 🦋💻 #techHistory #didyouknow',
    likes: 156,
    comments: [],
    createdAt: Date.now() - 14400000,
    isAIGenerated: true
  }
];
