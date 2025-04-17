
export type Profile = {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  cover_image: string | null;
  bio: string | null;
  following_count: number;
  followers_count: number;
  created_at: string;
  updated_at: string;
};
