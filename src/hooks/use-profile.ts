
import { useProfileData } from './profile/use-profile-data';
import { useProfileUpdate } from './profile/use-profile-update';
import { useProfileSocial } from './profile/use-profile-social';

// Re-export these from this file only to avoid conflicts in index.ts
export { DEFAULT_AVATAR, DEFAULT_COVER } from './profile/use-profile-data';
export type { Profile } from '@/types/profile';

export function useProfile() {
  const { profile, loading, isAuthenticated } = useProfileData();
  const { updateProfile } = useProfileUpdate();
  const { followUser, unfollowUser } = useProfileSocial();
  
  return {
    profile,
    loading,
    isAuthenticated,
    updateProfile,
    followUser,
    unfollowUser
  };
}
