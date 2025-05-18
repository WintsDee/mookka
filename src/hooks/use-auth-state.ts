
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

export function useAuthState() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Établir d'abord le listener d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        // Mise à jour synchrone de l'état - pas d'appels Supabase ici pour éviter un deadlock
        setSession(currentSession);
        setUser(currentSession?.user || null);
        
        if (_event === 'SIGNED_OUT') {
          console.log('Utilisateur déconnecté');
        } else if (_event === 'TOKEN_REFRESHED') {
          console.log('Token rafraîchi avec succès');
        } else if (_event === 'USER_UPDATED') {
          console.log('Profil utilisateur mis à jour');
        }
      }
    );
    
    // Ensuite, vérifier la session existante
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user || null);
      setLoading(false);
      
      // Si aucune session active mais des données locales, afficher un avertissement
      if (!data.session && localStorage.getItem('supabase.auth.token')) {
        toast({
          title: "Session expirée",
          description: "Votre session a expiré. Veuillez vous reconnecter.",
          variant: "destructive",
        });
        localStorage.removeItem('supabase.auth.token');
      }
    }).catch(error => {
      console.error("Erreur lors de la récupération de la session:", error);
      setLoading(false);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    session,
    user,
    isAuthenticated: !!session?.user,
    loading,
  };
}
