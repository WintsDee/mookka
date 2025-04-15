
import { supabase } from "@/integrations/supabase/client";

export interface NewsItem {
  id: string;
  title: string;
  link: string;
  source: string;
  date: string;
  image: string;
  category: 'film' | 'serie' | 'book' | 'game' | 'general';
  description?: string;
}

export interface NewsFilter {
  type?: 'film' | 'serie' | 'book' | 'game' | 'general';
  source?: string;
}

/**
 * Fetch news items from the Supabase Edge Function
 * @param filters - Optional filters (type, source)
 * @param forceRefresh - Whether to bypass cache and fetch fresh data
 * @returns Array of news items
 */
export async function fetchNews(
  filters?: NewsFilter, 
  forceRefresh = false
): Promise<{news: NewsItem[], meta: any}> {
  try {
    const queryParams = new URLSearchParams();
    
    // Add filters to query params
    if (filters?.type) {
      queryParams.append('type', filters.type);
    }
    
    if (filters?.source) {
      queryParams.append('source', filters.source);
    }
    
    // Add refresh parameter if needed
    if (forceRefresh) {
      queryParams.append('refresh', 'true');
    }
    
    const { data, error } = await supabase.functions.invoke(
      'fetch-news' + (queryParams.toString() ? `?${queryParams.toString()}` : '')
    );

    if (error) {
      console.error("Erreur lors de la récupération des actualités:", error);
      throw error;
    }

    if (!data || !data.news || !Array.isArray(data.news)) {
      console.error("Format de données invalide:", data);
      return { news: [], meta: { error: 'Format invalide' } };
    }

    // Vérification que chaque élément contient les propriétés requises
    const validatedNews = data.news.map((item: any) => ({
      id: item.id || `item-${Math.random().toString(36).substring(7)}`,
      title: item.title || "Titre non disponible",
      link: item.link || "#",
      source: item.source || "Source inconnue",
      date: item.date || new Date().toISOString(),
      image: item.image || "",
      category: item.category || "general",
      description: item.description || ""
    }));

    return { 
      news: validatedNews,
      meta: data.meta || {}
    };
  } catch (error) {
    console.error("Erreur dans fetchNews:", error);
    return { news: [], meta: { error: error } };
  }
}

/**
 * Get all available news sources
 * @returns Array of news source names
 */
export async function getNewsSources(): Promise<string[]> {
  try {
    const { news } = await fetchNews();
    
    // Extract unique sources
    const sources = new Set<string>();
    news.forEach(item => {
      if (item.source) {
        sources.add(item.source);
      }
    });
    
    return Array.from(sources).sort();
  } catch (error) {
    console.error("Erreur lors de la récupération des sources:", error);
    return [];
  }
}
