
import { useAuthState } from "./use-auth-state";
import { useProfileData } from "./use-profile-data";
import { useSocialActions } from "./use-social-actions";
import { DEFAULT_AVATAR, DEFAULT_COVER } from "@/config/avatars/avatar-utils";
import { useToast } from "@/hooks/use-toast";

export { DEFAULT_AVATAR, DEFAULT_COVER };
export type { Profile } from "@/types/profile";

export function useProfile() {
  const { session, user, isAuthenticated, loading: authLoading } = useAuthState();
  const { profile, loading: profileLoading, updateProfile } = useProfileData(user?.id);
  const { followUser, unfollowUser } = useSocialActions(user?.id);
  const { toast } = useToast();

  // Vérifier l'état de l'authentification et afficher un avertissement si nécessaire
  const checkAuthStatus = () => {
    if (!isAuthenticated && !authLoading) {
      toast({
        title: "Non connecté",
        description: "Vous devez être connecté pour accéder à cette fonctionnalité.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  return {
    profile,
    user,
    session,
    loading: authLoading || profileLoading,
    isAuthenticated,
    updateProfile,
    followUser,
    unfollowUser,
    checkAuthStatus
  };
}
