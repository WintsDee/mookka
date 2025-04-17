
import { supabase } from "@/integrations/supabase/client";
import { Media, MediaType, MediaStatus } from "@/types";

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
        status: 'to-watch' as MediaStatus,
        duration: formattedMedia.duration,
        director: formattedMedia.director,
        author: formattedMedia.author,
        publisher: formattedMedia.publisher,
        platform: formattedMedia.platform
      };
    }

    // Déterminer le statut initial en fonction du type de média
    let initialStatus: MediaStatus = 'to-watch';
    if (type === 'book') {
      initialStatus = 'to-read';
    } else if (type === 'game') {
      initialStatus = 'to-play';
    }

    // Ajouter l'entrée dans user_media
    const { data: userMedia, error: userMediaInsertError } = await supabase
      .from('user_media')
      .insert({
        user_id: user.id,
        media_id: mediaId,
        status: initialStatus
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
      status: userMedia.status as MediaStatus,
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
        type: media.type as MediaType,  // Type assertion
        coverImage: media.cover_image,
        year: media.year,
        rating: media.rating,
        genres: media.genres,
        description: media.description,
        status: item.status as MediaStatus,  // Type assertion
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
export async function updateMediaStatus(mediaId: string, status: MediaStatus): Promise<void> {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error("Utilisateur non connecté");
    }
    
    const { error } = await supabase
      .from('user_media')
      .update({ status, updated_at: new Date().toISOString() })
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

/**
 * Mettre à jour la note et la critique d'un média
 */
export async function updateMediaRating(mediaId: string, rating: number, review: string): Promise<void> {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error("Utilisateur non connecté");
    }
    
    // Vérifier si le média existe déjà dans la bibliothèque de l'utilisateur
    const { data: existingMedia, error: checkError } = await supabase
      .from('user_media')
      .select('id')
      .eq('user_id', user.user.id)
      .eq('media_id', mediaId)
      .maybeSingle();
      
    if (checkError && checkError.code !== 'PGRST116') {
      console.error("Erreur lors de la vérification du média:", checkError);
      throw checkError;
    }
    
    if (existingMedia) {
      // Mettre à jour la note et la critique
      const { error: updateError } = await supabase
        .from('user_media')
        .update({ 
          user_rating: rating, 
          notes: review,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingMedia.id);
        
      if (updateError) {
        console.error("Erreur lors de la mise à jour de la note:", updateError);
        throw updateError;
      }
    } else {
      // Si le média n'est pas dans la bibliothèque, l'ajouter avec la note et la critique
      const { error: insertError } = await supabase
        .from('user_media')
        .insert({
          user_id: user.user.id,
          media_id: mediaId,
          user_rating: rating,
          notes: review,
          status: 'completed' as MediaStatus // Si l'utilisateur note, il a probablement terminé
        });
        
      if (insertError) {
        console.error("Erreur lors de l'ajout de la note:", insertError);
        throw insertError;
      }
    }
  } catch (error) {
    console.error("Erreur dans updateMediaRating:", error);
    throw error;
  }
}

/**
 * Récupérer la note et la critique d'un média
 */
export async function getMediaRating(mediaId: string): Promise<{ rating: number, review: string } | null> {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      return null;
    }
    
    const { data, error } = await supabase
      .from('user_media')
      .select('user_rating, notes')
      .eq('user_id', user.user.id)
      .eq('media_id', mediaId)
      .maybeSingle();
      
    if (error && error.code !== 'PGRST116') {
      console.error("Erreur lors de la récupération de la note:", error);
      throw error;
    }
    
    if (!data) {
      return null;
    }
    
    return {
      rating: data.user_rating || 0,
      review: data.notes || ''
    };
  } catch (error) {
    console.error("Erreur dans getMediaRating:", error);
    throw error;
  }
}
