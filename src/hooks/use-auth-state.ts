
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
    let mounted = true;
    
    // Mettre en place l'écouteur d'événements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (mounted) {
          setSession(session);
          
          // Récupérer le profil utilisateur si connecté
          if (session?.user) {
            // Utiliser setTimeout pour éviter les problèmes de deadlock
            setTimeout(() => {
              if (mounted) {
                fetchProfile(session.user.id);
              }
            }, 0);
          } else {
            setProfile(null);
          }
          
          setLoading(false);
        }
      }
    );
    
    // Vérifier si une session existe déjà
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        setSession(data.session);
        
        // Récupérer le profil si connecté
        if (data.session?.user) {
          fetchProfile(data.session.user.id);
        }
        
        setLoading(false);
      }
    });
    
    return () => {
      mounted = false;
      subscription.unsubscribe();
    }
  }, []);

  return {
    session,
    isAuthenticated: !!session?.user,
    loading: loading || profileLoading,
    profile,
    user: session?.user || null
  };
}
