
import { supabase } from "@/integrations/supabase/client";
import { Media, MediaType, MediaStatus } from "@/types";
import { formatLibraryMedia } from '../formatters';

export async function addMediaToLibrary(
  media: any, 
  type: MediaType, 
  status?: MediaStatus,
  notes?: string
): Promise<Media> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("Vous devez être connecté pour ajouter un média à votre bibliothèque");
    }
    
    // Création d'un objet formaté avec les données du média
    let formattedMedia: any = {
      external_id: media.id?.toString() || '',
      title: '',
      type: type,
      genres: [],
    };

    // Formater les données selon le type de média
    switch (type) {
      case 'film':
        formattedMedia = {
          ...formattedMedia,
          title: media.title || '',
          cover_image: media.poster_path ? `https://image.tmdb.org/t/p/w500${media.poster_path}` : null,
          year: media.release_date ? parseInt(media.release_date.substring(0, 4)) : null,
          rating: media.vote_average || null,
          genres: media.genres ? media.genres.map((g: any) => g.name) : [],
          description: media.overview || '',
          duration: media.runtime ? `${media.runtime} min` : '',
          director: media.director || '',
        };
        break;
      case 'serie':
        formattedMedia = {
          ...formattedMedia,
          title: media.name || '',
          cover_image: media.poster_path ? `https://image.tmdb.org/t/p/w500${media.poster_path}` : null,
          year: media.first_air_date ? parseInt(media.first_air_date.substring(0, 4)) : null,
          rating: media.vote_average || null,
          genres: media.genres ? media.genres.map((g: any) => g.name) : [],
          description: media.overview || '',
          duration: media.number_of_seasons ? `${media.number_of_seasons} saison(s)` : '',
        };
        break;
      case 'book':
        formattedMedia = {
          ...formattedMedia,
          title: media.volumeInfo?.title || '',
          cover_image: media.volumeInfo?.imageLinks?.thumbnail || null,
          year: media.volumeInfo?.publishedDate ? parseInt(media.volumeInfo.publishedDate.substring(0, 4)) : null,
          genres: media.volumeInfo?.categories || [],
          description: media.volumeInfo?.description || '',
          author: media.volumeInfo?.authors ? media.volumeInfo.authors.join(', ') : '',
        };
        break;
      case 'game':
        formattedMedia = {
          ...formattedMedia,
          title: media.name || '',
          cover_image: media.background_image || null,
          year: media.released ? parseInt(media.released.substring(0, 4)) : null,
          rating: media.rating || null,
          genres: media.genres ? media.genres.map((g: any) => g.name) : [],
          description: media.description_raw || '',
          publisher: media.publishers && media.publishers.length > 0 ? media.publishers[0].name : '',
          platform: media.platforms ? media.platforms.map((p: any) => p.platform.name).join(', ') : '',
        };
        break;
    }

    // S'assurer que tous les champs sont corrects
    if (!formattedMedia.title) {
      formattedMedia.title = "Sans titre";
    }
    
    // Utiliser une transaction pour garantir la cohérence des données
    const { data: existingMedia, error: fetchError } = await supabase
      .from('media')
      .select('id')
      .eq('external_id', formattedMedia.external_id)
      .eq('type', type)
      .maybeSingle();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error("Erreur lors de la vérification du média:", fetchError);
      throw fetchError;
    }

    let mediaId;

    if (existingMedia) {
      mediaId = existingMedia.id;
      
      // Mettre à jour les données du média si nécessaire
      await supabase
        .from('media')
        .update({
          rating: formattedMedia.rating,
          cover_image: formattedMedia.cover_image,
          description: formattedMedia.description,
          updated_at: new Date().toISOString()
        })
        .eq('id', mediaId);
    } else {
      const { data: newMedia, error: insertError } = await supabase
        .from('media')
        .insert(formattedMedia)
        .select('id')
        .single();

      if (insertError) {
        console.error("Erreur lors de l'insertion du média:", insertError);
        throw insertError;
      }

      mediaId = newMedia.id;
    }

    // Vérifier si l'utilisateur a déjà ce média dans sa bibliothèque
    const { data: existingUserMedia, error: userMediaCheckError } = await supabase
      .from('user_media')
      .select('id, status, user_rating, notes')
      .eq('user_id', user.id)
      .eq('media_id', mediaId)
      .maybeSingle();
      
    if (userMediaCheckError && userMediaCheckError.code !== 'PGRST116') {
      console.error("Erreur lors de la vérification du média de l'utilisateur:", userMediaCheckError);
      throw userMediaCheckError;
    }
    
    if (existingUserMedia) {
      // Si le média existe déjà, mettre à jour son statut et ses notes
      await supabase
        .from('user_media')
        .update({
          status: status || existingUserMedia.status,
          notes: notes !== undefined ? notes : existingUserMedia.notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingUserMedia.id);
      
      return {
        id: mediaId,
        type: type,
        title: formattedMedia.title,
        coverImage: formattedMedia.cover_image,
        year: formattedMedia.year,
        rating: formattedMedia.rating,
        genres: formattedMedia.genres,
        description: formattedMedia.description,
        status: status || existingUserMedia.status as any,
        duration: formattedMedia.duration,
        director: formattedMedia.director,
        author: formattedMedia.author,
        publisher: formattedMedia.publisher,
        platform: formattedMedia.platform
      };
    }

    // Ajouter le média à la bibliothèque de l'utilisateur avec le statut spécifié
    const { data: userMedia, error: userMediaInsertError } = await supabase
      .from('user_media')
      .insert({
        user_id: user.id,
        media_id: mediaId,
        status: status || getDefaultStatusForType(type),
        notes: notes || '',
        added_at: new Date().toISOString()
      })
      .select('*')
      .single();

    if (userMediaInsertError) {
      console.error("Erreur lors de l'ajout du média à la bibliothèque:", userMediaInsertError);
      throw userMediaInsertError;
    }

    // Retourner les données complètes du média
    return {
      id: mediaId,
      type: type,
      title: formattedMedia.title,
      coverImage: formattedMedia.cover_image,
      year: formattedMedia.year,
      rating: formattedMedia.rating,
      genres: formattedMedia.genres,
      description: formattedMedia.description,
      status: userMedia.status as any,
      duration: formattedMedia.duration,
      director: formattedMedia.director,
      author: formattedMedia.author,
      publisher: formattedMedia.publisher,
      platform: formattedMedia.platform
    };
  } catch (error) {
    console.error("Erreur dans addMediaToLibrary:", error);
    throw error;
  }
}

// Fonction utilitaire pour obtenir le statut par défaut selon le type de média
function getDefaultStatusForType(type: MediaType): MediaStatus {
  switch (type) {
    case 'film':
    case 'serie':
      return 'to-watch';
    case 'book':
      return 'to-read';
    case 'game':
      return 'to-play';
    default:
      return 'to-watch';
  }
}
