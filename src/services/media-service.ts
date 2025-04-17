
import { supabase } from "@/integrations/supabase/client";
import { Media, MediaType } from "@/types";

/**
 * Add media to user's library
 */
export async function addMediaToLibrary(media: any, type: MediaType): Promise<Media> {
  try {
    // Vérifier que l'utilisateur est connecté
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("Vous devez être connecté pour ajouter un média à votre bibliothèque");
    }
    
    // Formater les données du média selon le type
    let formattedMedia: any = {
      external_id: media.id.toString() || '',
      title: '',
      type: type,
      genres: [],
    };

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

    // D'abord vérifier si le média existe déjà dans la base de données
    const { data: existingMedia, error: fetchError } = await supabase
      .from('media')
      .select('id')
      .eq('external_id', media.id.toString())
      .eq('type', type)
      .maybeSingle();

    let mediaId;

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 signifie "no rows returned"
      console.error("Erreur lors de la vérification du média:", fetchError);
      throw fetchError;
    }

    if (existingMedia) {
      // Le média existe déjà, utiliser son ID
      mediaId = existingMedia.id;
    } else {
      // Le média n'existe pas, l'insérer
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
      .select('id')
      .eq('user_id', user.id)
      .eq('media_id', mediaId)
      .maybeSingle();
      
    if (userMediaCheckError && userMediaCheckError.code !== 'PGRST116') {
      console.error("Erreur lors de la vérification du média de l'utilisateur:", userMediaCheckError);
      throw userMediaCheckError;
    }
    
    if (existingUserMedia) {
      // L'utilisateur a déjà ce média, renvoyer les détails
      return {
        id: mediaId,
        type: type,
        title: formattedMedia.title,
        coverImage: formattedMedia.cover_image,
        year: formattedMedia.year,
        rating: formattedMedia.rating,
        genres: formattedMedia.genres,
        description: formattedMedia.description,
        status: 'to-watch' as const,
        duration: formattedMedia.duration,
        director: formattedMedia.director,
        author: formattedMedia.author,
        publisher: formattedMedia.publisher,
        platform: formattedMedia.platform
      };
    }

    // Ajouter l'entrée dans user_media
    const { data: userMedia, error: userMediaInsertError } = await supabase
      .from('user_media')
      .insert({
        user_id: user.id,
        media_id: mediaId,
        status: 'to-watch'
      })
      .select('*')
      .single();

    if (userMediaInsertError) {
      console.error("Erreur lors de l'ajout du média à la bibliothèque:", userMediaInsertError);
      throw userMediaInsertError;
    }

    return {
      id: mediaId,
      type: type,
      title: formattedMedia.title,
      coverImage: formattedMedia.cover_image,
      year: formattedMedia.year,
      rating: formattedMedia.rating,
      genres: formattedMedia.genres,
      description: formattedMedia.description,
      status: userMedia.status as 'to-watch' | 'watching' | 'completed',
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

/**
 * Récupérer les médias de la bibliothèque de l'utilisateur
 */
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
        media:media_id (
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
          platform
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
    
    return data.map((item) => {
      const media = item.media;
      return {
        id: media.id,
        title: media.title,
        type: media.type,
        coverImage: media.cover_image,
        year: media.year,
        rating: media.rating,
        genres: media.genres,
        description: media.description,
        status: item.status,
        duration: media.duration,
        director: media.director,
        author: media.author,
        publisher: media.publisher,
        platform: media.platform
      };
    });
  } catch (error) {
    console.error("Erreur dans getUserMediaLibrary:", error);
    throw error;
  }
}

/**
 * Mettre à jour le statut d'un média dans la bibliothèque
 */
export async function updateMediaStatus(mediaId: string, status: string): Promise<void> {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error("Utilisateur non connecté");
    }
    
    const { error } = await supabase
      .from('user_media')
      .update({ status })
      .eq('user_id', user.user.id)
      .eq('media_id', mediaId);
      
    if (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      throw error;
    }
  } catch (error) {
    console.error("Erreur dans updateMediaStatus:", error);
    throw error;
  }
}

/**
 * Supprimer un média de la bibliothèque
 */
export async function removeMediaFromLibrary(mediaId: string): Promise<void> {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error("Utilisateur non connecté");
    }
    
    const { error } = await supabase
      .from('user_media')
      .delete()
      .eq('user_id', user.user.id)
      .eq('media_id', mediaId);
      
    if (error) {
      console.error("Erreur lors de la suppression du média:", error);
      throw error;
    }
  } catch (error) {
    console.error("Erreur dans removeMediaFromLibrary:", error);
    throw error;
  }
}
