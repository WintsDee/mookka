
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Profile } from "@/types/profile";

export function useProfileData(userId: string | undefined) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      fetchProfile(userId);
    } else {
      setLoading(false);
    }
  }, [userId]);

  async function fetchProfile(id: string) {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) {
        console.error('Erreur lors de la récupération du profil:', error);
        return;
      }
      
      setProfile(data);
    } catch (error) {
      console.error('Erreur inattendue:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile(updates: Partial<Profile>) {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été mises à jour avec succès."
      });
      
      // Refresh profile data
      fetchProfile(userId);
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
    loading,
    updateProfile
  };
}
