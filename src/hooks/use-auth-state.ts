
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export function useAuthState() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<{ user: User } | null>(null);
  
  useEffect(() => {
    // Mettre en place l'écouteur d'événements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setLoading(false);
      }
    );
    
    // Vérifier si une session existe déjà
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    
    return () => subscription.unsubscribe();
  }, []);

  return {
    session,
    isAuthenticated: !!session?.user,
    loading
  };
}
