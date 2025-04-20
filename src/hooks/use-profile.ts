
import { useAuthState } from "./use-auth-state";
import { useProfileData } from "./use-profile-data";
import { useSocialActions } from "./use-social-actions";
import { DEFAULT_AVATAR, DEFAULT_COVER } from "@/config/avatars/avatar-utils";

export { DEFAULT_AVATAR, DEFAULT_COVER };
export type { Profile } from "@/types/profile";

export function useProfile() {
  const { session, isAuthenticated, loading: authLoading } = useAuthState();
  const { profile, loading: profileLoading, updateProfile } = useProfileData(session?.user?.id);
  const { followUser, unfollowUser } = useSocialActions(session?.user?.id);

  return {
    profile,
    loading: authLoading || profileLoading,
    isAuthenticated,
    updateProfile,
    followUser,
    unfollowUser
  };
}
