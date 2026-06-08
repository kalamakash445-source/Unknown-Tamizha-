export interface Story {
  id: string;
  title: string;
  subtitle?: string;
  thumbnail?: string;
  content: string;
  category: "mystery" | "horror" | "ancient-secrets" | "history";
  readsCount: number;
  creatorName: string;
  isTrending?: boolean;
  createdAt: any; // Firestore Timestamp or string
}

export interface Comment {
  id: string;
  storyId: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  commentText: string;
  createdAt: any;
}

export interface Bookmark {
  id: string;
  userId: string;
  storyId: string;
  createdAt: any;
}

export interface ReadingProgress {
  id: string;
  userId: string;
  storyId: string;
  scrollPercent: number;
  updatedAt: any;
}

export interface Newsletter {
  id: string;
  email: string;
  createdAt: any;
}
