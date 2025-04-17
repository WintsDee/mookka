
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useProfileData } from "./use-profile-data";

export function useProfileSocial() {
  const { profile, session, fetchProfile } = useProfileData();
  const { toast } = useToast();
  
  async function followUser(targetUserId: string) {
    try {
      if (!session?.user) {
        throw new Error('Vous devez être connecté pour suivre un utilisateur');
      }
      
      const { error } = await supabase
        .from('user_relations')
        .insert({
          follower_id: session.user.id,
          following_id: targetUserId
        });
        
      if (error) {
        if (error.code === '23505') {
          throw new Error('Vous suivez déjà cet utilisateur');
        }
        throw error;
      }
      
      toast({
        title: "Utilisateur suivi",
        description: "Vous suivez maintenant cet utilisateur."
      });
      
      // Rafraîchir le profil pour mettre à jour les compteurs
      fetchProfile(session.user.id);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue.",
        variant: "destructive"
      });
    }
  }
  
  async function unfollowUser(targetUserId: string) {
    try {
      if (!session?.user) {
        throw new Error('Vous devez être connecté pour ne plus suivre un utilisateur');
      }
      
      const { error } = await supabase
        .from('user_relations')
        .delete()
        .match({
          follower_id: session.user.id,
          following_id: targetUserId
        });
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Utilisateur non suivi",
        description: "Vous ne suivez plus cet utilisateur."
      });
      
      // Rafraîchir le profil pour mettre à jour les compteurs
      fetchProfile(session.user.id);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue.",
        variant: "destructive"
      });
    }
  }
  
  return {
    profile,
    followUser,
    unfollowUser
  };
}
