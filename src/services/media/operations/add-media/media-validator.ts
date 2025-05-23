
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
      
      // Double vérification: essayer d'abord par ID externe, puis par ID interne si c'est un UUID
      let query;
      
      if (isUuid) {
        // Si c'est un UUID, chercher d'abord par ID interne
        console.log("Recherche par ID interne (UUID):", mediaId);
        const { data: internalData, error: internalError } = await supabase
          .from('media')
          .select('id, title, external_id')
          .eq('id', mediaId);
          
        if (internalError) {
          console.error("Erreur lors de la recherche par ID interne:", internalError);
        } else if (internalData && internalData.length > 0) {
          existingMediaInDb = internalData[0];
          console.log(`Média trouvé dans la base de données par ID interne: ${existingMediaInDb.id} - "${existingMediaInDb.title}"`);
          break;
        }
      }
      
      // Si pas trouvé par ID interne ou si ce n'est pas un UUID, chercher par ID externe
      console.log("Recherche par ID externe:", mediaId);
      const { data: externalData, error: externalError } = await supabase
        .from('media')
        .select('id, title, external_id')
        .eq('external_id', mediaId.toString());
      
      if (externalError) {
        mediaCheckError = externalError;
        console.error(`Erreur lors de la recherche par ID externe: ${externalError.message}`);
        
        if (isAuthError(externalError)) {
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
          throw externalError;
        }
      }
      
      if (externalData && externalData.length > 0) {
        existingMediaInDb = externalData[0];
        console.log(`Média trouvé dans la base de données par ID externe: ${existingMediaInDb.id} - "${existingMediaInDb.title}"`);
        break;
      }
      
      // Si nous n'avons pas trouvé en cherchant par l'ID externe et que c'est un ID numérique (typiquement API externe)
      // tentons également une recherche en tant que nombre
      if (!isUuid && !isNaN(Number(mediaId)) && !existingMediaInDb) {
        console.log("Recherche par ID externe numérique:", Number(mediaId));
        const { data: numericData, error: numericError } = await supabase
          .from('media')
          .select('id, title, external_id')
          .eq('external_id', Number(mediaId).toString());
        
        if (numericError) {
          console.error(`Erreur lors de la vérification numérique du média: ${numericError.message}`);
        } else if (numericData && numericData.length > 0) {
          existingMediaInDb = numericData[0];
          console.log(`Média trouvé dans la base de données (recherche numérique): ${existingMediaInDb.id} - "${existingMediaInDb.title}"`);
          break;
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
  
  if (!existingMediaInDb) {
    console.log(`Média non trouvé dans la base de données avec external_id=${mediaId}`);
  }
  
  return existingMediaInDb;
}
