
import { supabase } from "@/integrations/supabase/client";
import { Media, MediaType } from "@/types";
import { 
  formatFilmMedia,
  formatSerieMedia,
  formatBookMedia,
  formatGameMedia
} from './formatters';
import { 
  ensureMediaExists,
  addToUserLibrary
} from './db/media-operations';

export async function addMediaToLibrary(media: any, type: MediaType): Promise<Media> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("Vous devez être connecté pour ajouter un média à votre bibliothèque");
    }

    let formattedMedia;
    switch (type) {
      case 'film':
        formattedMedia = formatFilmMedia(media);
        break;
      case 'serie':
        formattedMedia = formatSerieMedia(media);
        break;
      case 'book':
        formattedMedia = formatBookMedia(media);
        break;
      case 'game':
        formattedMedia = formatGameMedia(media);
        break;
      default:
        throw new Error(`Type de média non supporté: ${type}`);
    }
    
    const mediaId = await ensureMediaExists(formattedMedia);
    return await addToUserLibrary(user.id, mediaId, formattedMedia);
    
  } catch (error) {
    console.error("Erreur dans addMediaToLibrary:", error);
    throw error;
  }
}
