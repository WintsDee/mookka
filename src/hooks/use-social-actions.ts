
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function useSocialActions(userId: string | undefined) {
  const { toast } = useToast();

  async function followUser(targetUserId: string) {
    try {
      if (!userId) {
        throw new Error('Vous devez être connecté pour suivre un utilisateur');
      }
      
      const { error } = await supabase
        .from('user_relations')
        .insert({
          follower_id: userId,
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
      if (!userId) {
        throw new Error('Vous devez être connecté pour ne plus suivre un utilisateur');
      }
      
      const { error } = await supabase
        .from('user_relations')
        .delete()
        .match({
          follower_id: userId,
          following_id: targetUserId
        });
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Utilisateur non suivi",
        description: "Vous ne suivez plus cet utilisateur."
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue.",
        variant: "destructive"
      });
    }
  }

  return {
    followUser,
    unfollowUser
  };
}
