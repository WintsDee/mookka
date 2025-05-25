
import { supabase } from "@/integrations/supabase/client";

/**
 * Cache de session pour éviter les appels répétés
 */
let sessionCache: { userId: string; timestamp: number } | null = null;
const SESSION_CACHE_TTL = 2 * 60 * 1000; // 2 minutes

/**
 * Validation d'authentification optimisée avec cache
 */
export async function validateUserSessionOptimized(): Promise<string> {
  // Vérifier le cache d'abord
  if (sessionCache && (Date.now() - sessionCache.timestamp < SESSION_CACHE_TTL)) {
    return sessionCache.userId;
  }

  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) {
    console.error("Erreur d'authentification:", error);
    sessionCache = null;
    throw new Error("Erreur d'authentification - Veuillez vous reconnecter");
  }
  
  if (!user) {
    sessionCache = null;
    throw new Error("Utilisateur non connecté - Veuillez vous connecter");
  }

  // Mettre en cache
  sessionCache = {
    userId: user.id,
    timestamp: Date.now()
  };

  return user.id;
}

/**
 * Invalide le cache de session
 */
export function invalidateSessionCache(): void {
  sessionCache = null;
}
