
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      // Pour la phase de test, on considère que l'utilisateur est authentifié
      // En mode production, décommentez le code ci-dessous
      /*
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
      */
      
      // Pour le test, on passe toujours à true
      setIsAuthenticated(true);
    };

    checkAuth();

    // Pour la phase de test, on n'écoute pas les changements d'authentification
    // En mode production, décommentez le code ci-dessous
    /*
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsAuthenticated(!!session);
      }
    );

    return () => subscription.unsubscribe();
    */
    
    // Version pour les tests
    return () => {}; // Cleanup vide pour les tests
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Pour la phase de test, on ne redirige jamais vers la page d'authentification
  return <>{children}</>;
}
