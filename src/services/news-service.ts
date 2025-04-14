
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

export async function fetchNews(type?: string): Promise<NewsItem[]> {
  try {
    const queryParams = type ? `?type=${type}` : '';
    const { data, error } = await supabase.functions.invoke('fetch-news' + queryParams);

    if (error) {
      console.error("Erreur lors de la récupération des actualités:", error);
      throw error;
    }

    if (!data || !data.news || !Array.isArray(data.news)) {
      console.error("Format de données invalide:", data);
      return [];
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

    return validatedNews;
  } catch (error) {
    console.error("Erreur dans fetchNews:", error);
    return [];
  }
}
