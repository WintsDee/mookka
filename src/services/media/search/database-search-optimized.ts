
import { supabase } from "@/integrations/supabase/client";
import { MediaType } from "@/types";

/**
 * Cache des recherches récentes
 */
const searchCache = new Map<string, { results: any[]; timestamp: number }>();
const SEARCH_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Recherche optimisée dans la base de données locale
 */
export async function searchLocalDatabaseOptimized(
  type: MediaType, 
  query: string,
  limit: number = 20
): Promise<any[]> {
  const cacheKey = `${type}-${query}-${limit}`;
  
  // Vérifier le cache
  const cached = searchCache.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp < SEARCH_CACHE_TTL)) {
    console.log(`Cache hit pour recherche: ${cacheKey}`);
    return cached.results;
  }

  try {
    // Recherche optimisée avec index
    const { data: localMedia, error } = await supabase
      .from('media')
      .select('id, title, type, year, rating, cover_image, author, director')
      .eq('type', type)
      .or(`title.ilike.%${query}%, author.ilike.%${query}%, director.ilike.%${query}%`)
      .order('rating', { ascending: false, nullsLast: true })
      .limit(limit);
    
    if (error) {
      console.error("Erreur recherche locale:", error);
      return [];
    }

    const results = localMedia || [];
    
    // Mettre en cache
    searchCache.set(cacheKey, {
      results,
      timestamp: Date.now()
    });

    console.log(`Recherche locale: ${results.length} résultats pour "${query}"`);
    return results;
  } catch (error) {
    console.error("Erreur dans searchLocalDatabaseOptimized:", error);
    return [];
  }
}

/**
 * Nettoie le cache de recherche expiré
 */
export function cleanSearchCache(): void {
  const now = Date.now();
  for (const [key, value] of searchCache.entries()) {
    if (now - value.timestamp > SEARCH_CACHE_TTL) {
      searchCache.delete(key);
    }
  }
}

// Nettoyer le cache toutes les 10 minutes
setInterval(cleanSearchCache, 10 * 60 * 1000);
