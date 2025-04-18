
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

export async function fetchNews(type?: string, forceRefresh = false): Promise<NewsItem[]> {
  try {
    let queryParams = '';
    
    // Add type parameter if defined
    if (type) {
      queryParams += `?type=${type}`;
    }
    
    // Add refresh parameter if enabled
    if (forceRefresh) {
      queryParams += queryParams ? '&refresh=true' : '?refresh=true';
    }
    
    console.log(`Fetching news with params: ${queryParams}`);
    const { data, error } = await supabase.functions.invoke('fetch-news' + queryParams);

    if (error) {
      console.error("Erreur lors de la récupération des actualités:", error);
      throw error;
    }

    if (!data || !data.news || !Array.isArray(data.news)) {
      console.error("Format de données invalide:", data);
      return [];
    }

    // Filter news to only include articles from the last 48 hours
    const now = new Date();
    const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);
    
    // Validate and filter news items
    const validatedNews = data.news
      .map((item: any) => ({
        id: item.id || `item-${Math.random().toString(36).substring(7)}`,
        title: item.title || "Titre non disponible",
        link: item.link || "#",
        source: item.source || "Source inconnue",
        date: item.date || new Date().toISOString(),
        image: item.image || "",
        category: item.category || "general",
        description: item.description || ""
      }))
      .filter((item: NewsItem) => {
        const itemDate = new Date(item.date);
        return !isNaN(itemDate.getTime()) && itemDate >= fortyEightHoursAgo;
      });

    return validatedNews;
  } catch (error) {
    console.error("Erreur dans fetchNews:", error);
    return [];
  }
}
