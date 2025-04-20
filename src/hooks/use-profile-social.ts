
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useProfileSocial(onProfileUpdate: () => void) {
  const { toast } = useToast();

  async function followUser(targetUserId: string, currentUserId: string | undefined) {
    if (!currentUserId) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour suivre un utilisateur",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('user_relations')
        .insert({
          follower_id: currentUserId,
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
      
      onProfileUpdate();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue.",
        variant: "destructive"
      });
    }
  }
  
  async function unfollowUser(targetUserId: string, currentUserId: string | undefined) {
    if (!currentUserId) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour ne plus suivre un utilisateur",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('user_relations')
        .delete()
        .match({
          follower_id: currentUserId,
          following_id: targetUserId
        });
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Utilisateur non suivi",
        description: "Vous ne suivez plus cet utilisateur."
      });
      
      onProfileUpdate();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue.",
        variant: "destructive"
      });
    }
  }

  return { followUser, unfollowUser };
}
