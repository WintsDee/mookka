
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

    return data?.news || [];
  } catch (error) {
    console.error("Erreur dans fetchNews:", error);
    return [];
  }
}
