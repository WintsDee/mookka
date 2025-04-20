
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "./use-auth-state";
import { useProfileData } from "./use-profile-data";
import { useProfileSocial } from "./use-profile-social";

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

// Updated abstract images that better match the app's style
export const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=3000&auto=format&fit=crop";
export const DEFAULT_COVER = "https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=3000&auto=format&fit=crop";

export function useProfile() {
  const { session, isAuthenticated, loading: authLoading } = useAuthState();
  const { profile, loading: profileLoading, fetchProfile } = useProfileData(session?.user?.id);
  const { followUser, unfollowUser } = useProfileSocial(() => {
    if (session?.user?.id) {
      fetchProfile(session.user.id);
    }
  });
  const { toast } = useToast();

  async function updateProfile({
    username,
    full_name,
    bio,
    avatar_url,
    cover_image
  }: Partial<Profile>) {
    try {
      if (!session?.user) {
        throw new Error('Aucun utilisateur connecté');
      }
      
      const { error } = await supabase
        .from('profiles')
        .update({
          username,
          full_name,
          bio,
          avatar_url,
          cover_image,
          updated_at: new Date().toISOString()
        })
        .eq('id', session.user.id);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été mises à jour avec succès."
      });
      
      fetchProfile(session.user.id);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la mise à jour du profil.",
        variant: "destructive"
      });
    }
  }

  return {
    profile,
    loading: authLoading || profileLoading,
    isAuthenticated,
    updateProfile,
    followUser: (targetUserId: string) => followUser(targetUserId, session?.user?.id),
    unfollowUser: (targetUserId: string) => unfollowUser(targetUserId, session?.user?.id)
  };
}
