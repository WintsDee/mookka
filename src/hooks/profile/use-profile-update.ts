
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useProfileData } from "./use-profile-data";
import { Profile } from "@/types/profile";

export function useProfileUpdate() {
  const { profile, session, fetchProfile } = useProfileData();
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
      
      // Rafraîchir les données du profil
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
    updateProfile
  };
}
