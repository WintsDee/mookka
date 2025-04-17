
import { supabase } from "@/integrations/supabase/client";
import { MediaType, MediaStatus } from "@/types";
import { formatLibraryMedia } from "./formatters";

/**
 * Ajoute un média à la bibliothèque de l'utilisateur
 */
export async function addMediaToLibrary(media: any, type: MediaType, status?: MediaStatus) {
  if (!media) {
    throw new Error("Aucun média fourni");
  }

  const user = (await supabase.auth.getUser()).data.user;
  if (!user) {
    throw new Error("Utilisateur non connecté");
  }

  // Vérifier si le média existe déjà dans la base de données
  const { data: existingMedia } = await supabase
    .from('media')
    .select('id')
    .eq('external_id', media.id.toString())
    .eq('type', type)
    .maybeSingle();

  let mediaId;

  if (existingMedia) {
    // Si le média existe déjà, utiliser l'ID existant
    mediaId = existingMedia.id;
  } else {
    // Sinon, créer un nouveau média
    const { data: newMedia, error: mediaError } = await supabase
      .from('media')
      .insert({
        external_id: media.id.toString(),
        title: media.title || media.name || media.volumeInfo?.title,
        type: type,
        year: media.release_date ? parseInt(media.release_date.substring(0, 4)) : 
              media.first_air_date ? parseInt(media.first_air_date.substring(0, 4)) : 
              media.volumeInfo?.publishedDate ? parseInt(media.volumeInfo.publishedDate.substring(0, 4)) : 
              media.released ? parseInt(media.released.substring(0, 4)) : null,
        cover_image: 
          type === 'film' || type === 'serie' 
            ? (media.poster_path ? `https://image.tmdb.org/t/p/original${media.poster_path}` : null)
            : type === 'book' 
              ? (media.volumeInfo?.imageLinks?.thumbnail || null)
              : (media.background_image || null),
        description: media.overview || media.volumeInfo?.description || media.description || media.description_raw,
        genres: Array.isArray(media.genres) 
          ? media.genres.map((g: any) => typeof g === 'string' ? g : g.name) 
          : (media.volumeInfo?.categories || []),
        rating: media.vote_average || media.volumeInfo?.averageRating || media.rating || null,
        duration: 
          type === 'film' ? (media.runtime ? `${media.runtime} min` : null) :
          type === 'serie' ? (media.number_of_seasons ? `${media.number_of_seasons} saison(s)` : null) :
          type === 'book' ? (media.volumeInfo?.pageCount ? `${media.volumeInfo.pageCount} pages` : null) :
          null,
        director: type === 'film' ? (media.credits?.crew?.find((c: any) => c.job === 'Director')?.name || null) : null,
        author: type === 'book' ? (media.volumeInfo?.authors?.join(', ') || null) : null,
        publisher: type === 'game' ? (media.publishers?.[0]?.name || null) : null,
        platform: type === 'game' ? (media.platforms?.map((p: any) => p.platform.name).join(', ') || null) : null
      })
      .select('id')
      .single();

    if (mediaError) {
      console.error("Erreur lors de la création du média:", mediaError);
      throw mediaError;
    }

    mediaId = newMedia.id;
  }

  // Vérifier si l'utilisateur a déjà ce média dans sa bibliothèque
  const { data: existingUserMedia } = await supabase
    .from('user_media')
    .select('id')
    .eq('user_id', user.id)
    .eq('media_id', mediaId)
    .maybeSingle();

  if (existingUserMedia) {
    // Si le média est déjà dans la bibliothèque de l'utilisateur, mettre à jour le statut si nécessaire
    if (status) {
      const { error: updateError } = await supabase
        .from('user_media')
        .update({ 
          status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingUserMedia.id);

      if (updateError) {
        console.error("Erreur lors de la mise à jour du média utilisateur:", updateError);
        throw updateError;
      }
    }
    return existingUserMedia.id;
  } else {
    // Sinon, ajouter le média à la bibliothèque de l'utilisateur
    const { data: userMedia, error: userMediaError } = await supabase
      .from('user_media')
      .insert({
        user_id: user.id,
        media_id: mediaId,
        status: status || getDefaultStatus(type)
      })
      .select('id')
      .single();

    if (userMediaError) {
      console.error("Erreur lors de l'ajout du média à la bibliothèque:", userMediaError);
      throw userMediaError;
    }

    return userMedia.id;
  }
}

/**
 * Récupère la bibliothèque de médias de l'utilisateur
 */
export async function getUserMediaLibrary() {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from('user_media')
    .select(`
      id,
      status,
      user_rating,
      notes,
      media(*)
    `)
    .eq('user_id', user.id);

  if (error) {
    console.error("Erreur lors de la récupération de la bibliothèque:", error);
    throw error;
  }

  // Formater les données pour l'affichage
  return data.map(item => formatLibraryMedia(item));
}

/**
 * Met à jour le statut d'un média dans la bibliothèque
 */
export async function updateMediaStatus(mediaId: string, status: MediaStatus) {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) {
    throw new Error("Utilisateur non connecté");
  }

  const { error } = await supabase
    .from('user_media')
    .update({ 
      status: status,
      updated_at: new Date().toISOString()
    })
    .match({ 
      user_id: user.id,
      media_id: mediaId 
    });

  if (error) {
    console.error("Erreur lors de la mise à jour du statut:", error);
    throw error;
  }

  return true;
}

/**
 * Retire un média de la bibliothèque
 */
export async function removeMediaFromLibrary(mediaId: string) {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) {
    throw new Error("Utilisateur non connecté");
  }

  const { error } = await supabase
    .from('user_media')
    .delete()
    .match({
      user_id: user.id,
      media_id: mediaId
    });

  if (error) {
    console.error("Erreur lors de la suppression du média:", error);
    throw error;
  }

  return true;
}

/**
 * Met à jour la note et la critique d'un média
 */
export async function updateMediaRating(mediaId: string, rating: number, review: string = "") {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) {
    throw new Error("Utilisateur non connecté");
  }

  // Vérifier si le média est dans la bibliothèque de l'utilisateur
  const { data } = await supabase
    .from('user_media')
    .select('id')
    .eq('user_id', user.id)
    .eq('media_id', mediaId)
    .maybeSingle();

  if (data) {
    // Mettre à jour la note et la critique
    const { error } = await supabase
      .from('user_media')
      .update({ 
        user_rating: rating,
        notes: review,
        updated_at: new Date().toISOString()
      })
      .eq('id', data.id);

    if (error) {
      console.error("Erreur lors de la mise à jour de la note:", error);
      throw error;
    }
  } else {
    // Le média n'est pas dans la bibliothèque, l'ajouter d'abord
    const { error } = await supabase
      .from('user_media')
      .insert({
        user_id: user.id,
        media_id: mediaId,
        user_rating: rating,
        notes: review
      });

    if (error) {
      console.error("Erreur lors de l'ajout du média et de la note:", error);
      throw error;
    }
  }

  return true;
}

/**
 * Récupère la note et la critique d'un média
 */
export async function getMediaRating(mediaId: string) {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from('user_media')
    .select('user_rating, notes')
    .eq('user_id', user.id)
    .eq('media_id', mediaId)
    .maybeSingle();

  if (error) {
    console.error("Erreur lors de la récupération de la note:", error);
    throw error;
  }

  if (!data) {
    return null;
  }

  return {
    rating: data.user_rating || 0,
    review: data.notes || ""
  };
}

/**
 * Vérifie si un média est dans la bibliothèque de l'utilisateur
 */
export async function isMediaInLibrary(mediaId: string) {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) {
    return false;
  }

  const { data, error } = await supabase
    .from('user_media')
    .select('id')
    .eq('user_id', user.id)
    .eq('media_id', mediaId)
    .maybeSingle();

  if (error) {
    console.error("Erreur lors de la vérification de la bibliothèque:", error);
    throw error;
  }

  return !!data;
}

// Fonction utilitaire pour obtenir le statut par défaut en fonction du type de média
function getDefaultStatus(type: MediaType): MediaStatus {
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
