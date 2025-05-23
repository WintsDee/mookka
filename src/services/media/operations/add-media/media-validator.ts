
import { supabase, isAuthError } from "@/integrations/supabase/client";
import { v4 as uuidv4, validate as validateUuid } from "uuid";

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
      console.log(`Vérification si le média avec external_id=${mediaId} existe dans la base de données`);
      
      // Vérifier si l'ID est déjà un UUID interne Supabase
      const isUuid = validateUuid(mediaId);
      
      const query = isUuid 
        ? supabase.from('media').select('id, title').eq('id', mediaId).maybeSingle()
        : supabase.from('media').select('id, title').eq('external_id', mediaId.toString()).maybeSingle();
      
      const { data, error } = await query;
      
      existingMediaInDb = data;
      mediaCheckError = error;
      
      if (mediaCheckError) {
        console.error(`Erreur lors de la vérification du média: ${mediaCheckError.message}`);
        
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
  
  if (existingMediaInDb) {
    console.log(`Média trouvé dans la base de données: ${existingMediaInDb.id} - "${existingMediaInDb.title}"`);
  } else {
    console.log(`Média non trouvé dans la base de données avec external_id=${mediaId}`);
  }
  
  return existingMediaInDb;
}
