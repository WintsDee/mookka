
import { MediaType } from "@/types";

export interface Activity {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  action: string;
  media: {
    id: string;
    title: string;
    type: MediaType;
  };
  timestamp: string;
}

export interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
}
