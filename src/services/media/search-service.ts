
import { supabase } from "@/integrations/supabase/client";
import { MediaType } from "@/types";
import { formatBookSearchResult, formatFilmSearchResult, formatSerieSearchResult, formatGameSearchResult } from "./formatters";
import { filterAdultContent } from "./filters";

// Amélioration du cache avec LRU (Least Recently Used) pour optimiser la mémoire
class LRUCache<T> {
  private capacity: number;
  private cache: Map<string, T>;
  
  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map<string, T>();
  }

  get(key: string): T | undefined {
    if (!this.cache.has(key)) return undefined;
    
    // Refresh the key's position in the map by deleting and re-adding it
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value!);
    
    return value;
  }

  put(key: string, value: T): void {
    // If key exists, remove it first to refresh position
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } 
    // If at capacity, remove the oldest entry
    else if (this.cache.size >= this.capacity) {
      this.cache.delete(this.cache.keys().next().value);
    }
    
    this.cache.set(key, value);
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }
  
  delete(key: string): boolean {
    return this.cache.delete(key);
  }
  
  clear(): void {
    this.cache.clear();
  }
  
  // Make keys accessible to allow iteration
  keys(): IterableIterator<string> {
    return this.cache.keys();
  }
}

// Cache pour stocker les résultats de recherche avec meilleure gestion de la mémoire
const searchCache = new LRUCache<{ results: any[], timestamp: number, totalPages: number, totalResults: number }>(50); // Limiter à 50 requêtes en cache
const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes

/**
 * Génère une clé de cache pour la recherche
 */
function getCacheKey(type: MediaType, query: string, page: number): string {
  return `${type}:${query}:${page}`;
}

/**
 * Nettoie les entrées de cache expirées
 */
function cleanupCache(): void {
  const now = Date.now();
  for (const key of Array.from(searchCache.keys() || [])) {
    const entry = searchCache.get(key);
    if (entry && now - entry.timestamp > CACHE_DURATION) {
      searchCache.delete(key);
    }
  }
}

// Exécuter la purge de cache périodiquement pour éviter la consommation excessive de mémoire
let cleanupInterval: NodeJS.Timeout | null = null;
if (typeof window !== 'undefined' && !cleanupInterval) {
  cleanupInterval = setInterval(cleanupCache, CACHE_DURATION);
}

/**
 * Recherche de médias par type et terme de recherche avec optimisations de performance
 */
export async function searchMedia(type: MediaType, query: string, page: number = 1, adultContentAllowed: boolean = false) {
  if (!query) {
    return { results: [], total_pages: 0, total_results: 0 };
  }

  // Nettoyer périodiquement le cache
  cleanupCache();

  const cacheKey = getCacheKey(type, query, page);
  const cachedResult = searchCache.get(cacheKey);

  // Si résultat en cache et non expiré, l'utiliser
  if (cachedResult) {
    // Filtrer le contenu pour adultes si nécessaire (au cas où les préférences ont changé)
    const filteredResults = filterAdultContent(cachedResult.results, adultContentAllowed);
    return {
      results: filteredResults,
      total_pages: cachedResult.totalPages,
      total_results: cachedResult.totalResults
    };
  }

  try {
    let results: any[] = [];
    let totalPages = 0;
    let totalResults = 0;

    // Appeler la fonction Edge de recherche appropriée selon le type avec un timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 secondes de timeout
    
    try {
      const { data, error } = await supabase.functions.invoke(`search-${type}`, {
        body: { query, page }
      });

      clearTimeout(timeoutId);

      if (error) {
        console.error(`Erreur lors de la recherche de ${type}:`, error);
        throw error;
      }

      if (data) {
        results = data.results || [];
        totalPages = data.total_pages || 0;
        totalResults = data.total_results || 0;

        // Filtrer le contenu pour adultes si nécessaire
        results = filterAdultContent(results, adultContentAllowed);

        // Formater les résultats selon le type
        switch (type) {
          case 'film':
            results = results.map(formatFilmSearchResult);
            break;
          case 'serie':
            results = results.map(formatSerieSearchResult);
            break;
          case 'book':
            results = results.map(formatBookSearchResult);
            break;
          case 'game':
            results = results.map(formatGameSearchResult);
            break;
        }

        // Mettre en cache les résultats
        searchCache.put(cacheKey, {
          results: [...results], // Copie pour éviter les modifications par référence
          timestamp: Date.now(),
          totalPages,
          totalResults
        });
      }
    } catch (e: any) {
      clearTimeout(timeoutId);
      if (e.name === 'AbortError') {
        console.warn(`La requête de recherche pour ${type} a expiré`);
        throw new Error(`La recherche a pris trop de temps. Veuillez réessayer.`);
      }
      throw e;
    }

    return {
      results,
      total_pages: totalPages,
      total_results: totalResults
    };
  } catch (error) {
    console.error(`Erreur lors de la recherche de ${type}:`, error);
    throw error;
  }
}

// Cache pour les détails des médias avec LRU pour limiter l'utilisation mémoire
const detailsCache = new LRUCache<{ data: any, timestamp: number }>(100);

/**
 * Récupère les détails d'un média par son ID avec gestion optimisée du cache
 */
export async function getMediaById(type: MediaType, id: string) {
  try {
    const cacheKey = `${type}:${id}`;
    const cachedDetails = detailsCache.get(cacheKey);
    
    // Si données en cache et non expirées, les utiliser
    if (cachedDetails && (Date.now() - cachedDetails.timestamp < CACHE_DURATION)) {
      return cachedDetails.data;
    }
    
    // Vérifier si le média existe déjà dans notre base de données
    const { data: existingMedia } = await supabase
      .from('media')
      .select('*')
      .eq('external_id', id)
      .eq('type', type)
      .maybeSingle();

    if (existingMedia) {
      // Mettre en cache et retourner
      detailsCache.put(cacheKey, {
        data: existingMedia,
        timestamp: Date.now()
      });
      return existingMedia;
    }

    // Sinon, appeler l'API externe via la fonction Edge correspondante avec timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 secondes de timeout
    
    try {
      const { data, error } = await supabase.functions.invoke(`get-${type}-details`, {
        body: { id }
      });

      clearTimeout(timeoutId);

      if (error) {
        console.error(`Erreur lors de la récupération des détails de ${type}:`, error);
        throw error;
      }
      
      // Mettre en cache les résultats
      if (data) {
        detailsCache.put(cacheKey, {
          data,
          timestamp: Date.now()
        });
      }

      return data;
    } catch (e: any) {
      clearTimeout(timeoutId);
      if (e.name === 'AbortError') {
        console.warn(`La requête de détails pour ${type}:${id} a expiré`);
        throw new Error(`La récupération des détails a pris trop de temps. Veuillez réessayer.`);
      }
      throw e;
    }
  } catch (error) {
    console.error(`Erreur lors de la récupération des détails de ${type}:`, error);
    throw error;
  }
}
