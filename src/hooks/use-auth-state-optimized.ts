
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

export function useAuthStateOptimized() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Mémoriser les callbacks pour éviter les re-renders
  const handleAuthChange = useCallback((_event: string, currentSession: Session | null) => {
    setSession(currentSession);
    setUser(currentSession?.user || null);
    
    if (_event === 'SIGNED_OUT') {
      console.log('Utilisateur déconnecté');
      // Nettoyer les caches
      localStorage.removeItem('supabase.auth.token');
    } else if (_event === 'TOKEN_REFRESHED') {
      console.log('Token rafraîchi');
    }
  }, []);

  const handleSessionError = useCallback((error: any) => {
    console.error("Erreur session:", error);
    toast({
      title: "Session expirée",
      description: "Veuillez vous reconnecter.",
      variant: "destructive",
    });
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    let mounted = true;

    // Listener d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);
    
    // Récupération session initiale
    supabase.auth.getSession()
      .then(({ data, error }) => {
        if (!mounted) return;
        
        if (error) {
          handleSessionError(error);
          return;
        }
        
        setSession(data.session);
        setUser(data.session?.user || null);
        setLoading(false);
      })
      .catch(handleSessionError);
    
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [handleAuthChange, handleSessionError]);

  return {
    session,
    user,
    isAuthenticated: !!session?.user,
    loading,
  };
}
