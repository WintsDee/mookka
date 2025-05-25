
import { supabase, isAuthError } from "@/integrations/supabase/client";
import { v4 as uuidv4, validate as validateUuid } from "uuid";

/**
 * Vérifie si un média existe déjà dans la base de données
 */
export async function checkExistingMedia(mediaId: string): Promise<{ id: string, title: string } | null> {
  const MAX_RETRIES = 2;
  let retryCount = 0;
  let existingMediaInDb = null;
  
  while (retryCount <= MAX_RETRIES) {
    try {
      console.log(`Vérification si le média avec ID=${mediaId} existe dans la base de données (tentative ${retryCount + 1})`);
      
      // Déterminer si l'ID est un UUID interne ou un ID externe
      const isUuid = validateUuid(mediaId);
      
      if (isUuid) {
        // Si c'est un UUID, chercher par ID interne
        console.log("Recherche par ID interne (UUID):", mediaId);
        const { data: internalData, error: internalError } = await supabase
          .from('media')
          .select('id, title, external_id')
          .eq('id', mediaId)
          .maybeSingle();
          
        if (internalError) {
          if (isAuthError(internalError)) {
            if (retryCount < MAX_RETRIES) {
              console.log(`Auth error detected, attempting retry ${retryCount + 1}/${MAX_RETRIES}`);
              await supabase.auth.refreshSession();
              retryCount++;
              continue;
            } else {
              throw new Error("Problème d'authentification persistant - Veuillez vous reconnecter");
            }
          } else {
            console.error("Erreur lors de la recherche par ID interne:", internalError);
            throw internalError;
          }
        }
        
        if (internalData) {
          existingMediaInDb = internalData;
          console.log(`Média trouvé par ID interne: ${existingMediaInDb.id} - "${existingMediaInDb.title}"`);
          break;
        }
      } else {
        // Si ce n'est pas un UUID, chercher par ID externe
        console.log("Recherche par ID externe:", mediaId);
        const { data: externalData, error: externalError } = await supabase
          .from('media')
          .select('id, title, external_id')
          .eq('external_id', mediaId.toString())
          .maybeSingle();
        
        if (externalError) {
          if (isAuthError(externalError)) {
            if (retryCount < MAX_RETRIES) {
              console.log(`Auth error detected, attempting retry ${retryCount + 1}/${MAX_RETRIES}`);
              await supabase.auth.refreshSession();
              retryCount++;
              continue;
            } else {
              throw new Error("Problème d'authentification persistant - Veuillez vous reconnecter");
            }
          } else {
            console.error("Erreur lors de la recherche par ID externe:", externalError);
            throw externalError;
          }
        }
        
        if (externalData) {
          existingMediaInDb = externalData;
          console.log(`Média trouvé par ID externe: ${existingMediaInDb.id} - "${existingMediaInDb.title}"`);
          break;
        }
        
        // Si pas trouvé en tant que string, essayer en tant que nombre
        if (!isNaN(Number(mediaId))) {
          console.log("Recherche par ID externe numérique:", Number(mediaId));
          const { data: numericData, error: numericError } = await supabase
            .from('media')
            .select('id, title, external_id')
            .eq('external_id', Number(mediaId).toString())
            .maybeSingle();
          
          if (numericError) {
            console.error(`Erreur lors de la vérification numérique du média: ${numericError.message}`);
          } else if (numericData) {
            existingMediaInDb = numericData;
            console.log(`Média trouvé par ID externe numérique: ${existingMediaInDb.id} - "${existingMediaInDb.title}"`);
            break;
          }
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
  
  if (!existingMediaInDb) {
    console.log(`Média non trouvé dans la base de données avec ID=${mediaId}`);
  }
  
  return existingMediaInDb;
}
