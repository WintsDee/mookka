
import { Profile } from "@/hooks/use-profile";

// Types pour les demandes d'amitié
export interface FriendRequest {
  id: string;
  senderId: string;
  username: string;
  avatarUrl: string;
  createdAt: string;
}

// Types pour les amis
export interface Friend {
  id: string;
  username: string;
  avatarUrl: string;
  status: string;
}

// Types pour les activités sociales
export interface SocialActivity {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  action: string;
  actionType: string;
  media: {
    id: string;
    title: string;
    type: string;
    coverImage?: string;
  };
  timestamp: string;
  likes: number;
  comments: number;
  hasLiked: boolean;
  note?: string;
  rating?: number;
}

export interface ActivityComment {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
}

// Configuration des paramètres de partage social
export interface SocialShareSettings {
  shareRatings: boolean;
  shareReviews: boolean;
  shareCollections: boolean;
  shareProgress: boolean;
  shareLibraryAdditions: boolean;
}

export const DEFAULT_SHARE_SETTINGS: SocialShareSettings = {
  shareRatings: true,
  shareReviews: true,
  shareCollections: true,
  shareProgress: true,
  shareLibraryAdditions: true
};
