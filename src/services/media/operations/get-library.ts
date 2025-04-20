
import { supabase } from "@/integrations/supabase/client";
import { Media } from "@/types";
import { formatLibraryMedia } from '../formatters';

export async function getUserMediaLibrary(): Promise<Media[]> {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      return [];
    }
    
    const { data, error } = await supabase
      .from('user_media')
      .select(`
        id,
        status,
        added_at,
        user_rating,
        notes,
        media_id,
        media (
          id,
          title,
          type,
          year,
          rating,
          genres,
          description,
          cover_image,
          duration,
          director,
          author,
          publisher,
          platform,
          external_id
        )
      `)
      .eq('user_id', user.user.id)
      .order('added_at', { ascending: false });
      
    if (error) {
      console.error("Erreur lors de la récupération de la bibliothèque:", error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    console.log("Raw library data:", data);
    
    return data.map(item => {
      // Assurez-vous que le média existe avant de formatter
      if (!item.media) {
        console.warn("Média manquant pour l'entrée:", item);
        return null;
      }
      return formatLibraryMedia(item);
    }).filter(Boolean) as Media[];
  } catch (error) {
    console.error("Erreur dans getUserMediaLibrary:", error);
    throw error;
  }
}
