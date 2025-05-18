
import { supabase, isAuthError } from "@/integrations/supabase/client";

/**
 * Vérifie que l'utilisateur est authentifié et renvoie son ID
 */
export async function validateUserSession(): Promise<string> {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError) {
    console.error("Authentication error:", sessionError);
    
    // Tenter une actualisation du token si possible
    try {
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
      
      if (refreshError || !refreshData.session) {
        throw new Error("Utilisateur non authentifié - Veuillez vous reconnecter");
      }
      
      console.log("Session refreshed successfully");
      return refreshData.session.user.id;
    } catch (refreshError) {
      console.error("Session refresh failed:", refreshError);
      throw new Error("Session expirée - Veuillez vous reconnecter");
    }
  }
  
  if (!sessionData?.session?.user) {
    console.error("No user found in session");
    throw new Error("Session utilisateur introuvable - Veuillez vous reconnecter");
  }
  
  return sessionData.session.user.id;
}
