import { Timestamp } from "firebase/firestore";

export interface Comment {
  id: string;
  text: string;
  userId: string;
  userInfo: {
    username: string;
    profilePicUrl: string | null;
  };
  createdAt: Timestamp;
  likes: {
    by: string[];
    count: number;
  };
}

export interface UserPost {
  id: string;
  text: string;
  mediaUrl?: string;
  mediaType?: "photo" | "video";
  thumbnailUrl?: string;
  posterInfo: {
    userId: string;
    username: string;
    profilePicUrl?: string;
    verified?: boolean;
  };
  likes: {
    by: string[];
    count: number;
  };
  comments: {
    count: number;
  };
  shares: {
    count: number;
  };
  createdAt: Timestamp;
}
