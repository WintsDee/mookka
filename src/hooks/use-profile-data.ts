
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "./use-profile";
import { useToast } from "@/components/ui/use-toast";

export function useProfileData(userId: string | undefined) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      fetchProfile(userId);
    } else {
      setLoading(false);
    }
  }, [userId]);

  async function fetchProfile(userId: string) {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
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

  return { profile, loading, fetchProfile };
}
