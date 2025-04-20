
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Profile } from "./use-profile";

export function useAuthState() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<{ user: User } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  
  // Fonction pour récupérer le profil utilisateur
  async function fetchProfile(userId: string) {
    if (!userId) return;
    
    try {
      setProfileLoading(true);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
        
      if (error) {
        console.error('Erreur lors de la récupération du profil:', error);
        return;
      }
      
      setProfile(data);
    } catch (error) {
      console.error('Erreur inattendue:', error);
    } finally {
      setProfileLoading(false);
    }
  }
  
  useEffect(() => {
    // Mettre en place l'écouteur d'événements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setLoading(false);
        
        // Récupérer le profil utilisateur si connecté
        if (session?.user) {
          // Utiliser setTimeout pour éviter les problèmes de deadlock
          setTimeout(() => {
            fetchProfile(session.user.id);
          }, 0);
        }
      }
    );
    
    // Vérifier si une session existe déjà
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
      
      // Récupérer le profil si connecté
      if (data.session?.user) {
        fetchProfile(data.session.user.id);
      }
    });
    
    return () => subscription.unsubscribe();
  }, []);

  return {
    session,
    isAuthenticated: !!session?.user,
    loading: loading || profileLoading,
    profile,
    user: session?.user || null
  };
}
