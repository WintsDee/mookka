
import { supabase, isAuthError } from "@/integrations/supabase/client";
import { validate as validateUuid } from "uuid";

/**
 * Cache pour éviter les requêtes répétées
 */
const mediaCache = new Map<string, { id: string, title: string } | null>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const cacheTimestamps = new Map<string, number>();

/**
 * Vérifie si un média existe déjà dans la base de données (version optimisée)
 */
export async function checkExistingMediaOptimized(mediaId: string): Promise<{ id: string, title: string } | null> {
  // Vérifier le cache d'abord
  const cacheKey = mediaId;
  const cachedResult = mediaCache.get(cacheKey);
  const cacheTime = cacheTimestamps.get(cacheKey);
  
  if (cachedResult !== undefined && cacheTime && (Date.now() - cacheTime < CACHE_TTL)) {
    console.log(`Cache hit pour média ${mediaId}`);
    return cachedResult;
  }

  try {
    console.log(`Vérification du média ${mediaId} dans la base de données`);
    
    const isUuid = validateUuid(mediaId);
    let query = supabase.from('media').select('id, title, external_id');
    
    if (isUuid) {
      // Si c'est un UUID, chercher par ID interne
      query = query.eq('id', mediaId);
    } else {
      // Si ce n'est pas un UUID, chercher par external_id
      query = query.eq('external_id', String(mediaId));
    }
    
    const { data, error } = await query.maybeSingle();
    
    if (error) {
      if (isAuthError(error)) {
        await supabase.auth.refreshSession();
        // Retry une seule fois
        const { data: retryData, error: retryError } = await query.maybeSingle();
        if (retryError) {
          throw new Error("Problème d'authentification - Veuillez vous reconnecter");
        }
        // Mettre en cache le résultat du retry
        mediaCache.set(cacheKey, retryData);
        cacheTimestamps.set(cacheKey, Date.now());
        return retryData;
      } else {
        throw error;
      }
    }
    
    // Mettre en cache le résultat
    mediaCache.set(cacheKey, data);
    cacheTimestamps.set(cacheKey, Date.now());
    
    return data;
  } catch (error) {
    console.error(`Erreur lors de la vérification du média ${mediaId}:`, error);
    throw error;
  }
}

/**
 * Nettoie le cache expiré
 */
export function cleanMediaCache(): void {
  const now = Date.now();
  for (const [key, timestamp] of cacheTimestamps.entries()) {
    if (now - timestamp > CACHE_TTL) {
      mediaCache.delete(key);
      cacheTimestamps.delete(key);
    }
  }
}

// Nettoyer le cache toutes les 10 minutes
setInterval(cleanMediaCache, 10 * 60 * 1000);
