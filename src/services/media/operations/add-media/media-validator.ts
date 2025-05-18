
import { supabase, isAuthError } from "@/integrations/supabase/client";

/**
 * Vérifie si un média existe déjà dans la base de données
 * Inclut une gestion des tentatives en cas d'erreur d'authentification
 */
export async function checkExistingMedia(mediaId: string): Promise<{ id: string, title: string } | null> {
  const MAX_RETRIES = 2;
  let retryCount = 0;
  let existingMediaInDb = null;
  let mediaCheckError = null;
  
  while (retryCount <= MAX_RETRIES) {
    try {
      const { data, error } = await supabase
        .from('media')
        .select('id, title')
        .eq('id', mediaId)
        .maybeSingle();
      
      existingMediaInDb = data;
      mediaCheckError = error;
      
      if (mediaCheckError) {
        if (isAuthError(mediaCheckError)) {
          // Problème d'authentification, on essaie de rafraîchir le token
          if (retryCount < MAX_RETRIES) {
            console.log(`Auth error detected, attempting retry ${retryCount + 1}/${MAX_RETRIES}`);
            await supabase.auth.refreshSession();
            retryCount++;
            continue;
          } else {
            throw new Error("Problème d'authentification persistant - Veuillez vous reconnecter");
          }
        } else {
          throw mediaCheckError;
        }
      }
      
      // Si pas d'erreur, sortir de la boucle
      break;
    } catch (error) {
      console.error(`Retry ${retryCount}/${MAX_RETRIES} failed:`, error);
      if (retryCount >= MAX_RETRIES) throw error;
      retryCount++;
    }
  }
  
  if (mediaCheckError) {
    console.error("Error checking media existence after retries:", mediaCheckError);
    throw new Error("Erreur d'accès à la base de données - Veuillez réessayer");
  }
  
  return existingMediaInDb;
}
