
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Profile } from "@/types/profile";

// Updated abstract images that better match the app's style
export const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=3000&auto=format&fit=crop";
export const DEFAULT_COVER = "https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=3000&auto=format&fit=crop";

export function useProfileData() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<{ user: User } | null>(null);
  
  useEffect(() => {
    // Vérifier s'il y a une session existante
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session?.user) {
        fetchProfile(data.session.user.id);
      } else {
        setLoading(false);
      }
    });
    
    // Écouter les changements d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session?.user) {
          fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );
    
    return () => subscription.unsubscribe();
  }, []);
  
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
  
  return {
    profile,
    loading,
    isAuthenticated: !!session?.user,
    session,
    fetchProfile
  };
}
