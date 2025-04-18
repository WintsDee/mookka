
import { supabase } from "@/integrations/supabase/client";
import { Media, MediaType } from "@/types";

export async function addMediaToLibrary(media: any, type: MediaType): Promise<Media> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("Vous devez être connecté pour ajouter un média à votre bibliothèque");
    }
    
    const formattedMedia = formatMediaForInsertion(media, type);
    const mediaId = await ensureMediaExists(formattedMedia);
    return await addToUserLibrary(user.id, mediaId, formattedMedia);
    
  } catch (error) {
    console.error("Erreur dans addMediaToLibrary:", error);
    throw error;
  }
}

function formatMediaForInsertion(media: any, type: MediaType) {
  const base = {
    external_id: media.id.toString() || '',
    title: '',
    type: type,
    genres: [],
  };

  switch (type) {
    case 'film':
      return {
        ...base,
        title: media.title || '',
        cover_image: media.poster_path ? `https://image.tmdb.org/t/p/w500${media.poster_path}` : null,
        year: media.release_date ? parseInt(media.release_date.substring(0, 4)) : null,
        rating: media.vote_average || null,
        genres: media.genres ? media.genres.map((g: any) => g.name) : [],
        description: media.overview || '',
        duration: media.runtime ? `${media.runtime} min` : '',
        director: media.director || '',
      };
    case 'serie':
      return {
        ...base,
        title: media.name || '',
        cover_image: media.poster_path ? `https://image.tmdb.org/t/p/w500${media.poster_path}` : null,
        year: media.first_air_date ? parseInt(media.first_air_date.substring(0, 4)) : null,
        rating: media.vote_average || null,
        genres: media.genres ? media.genres.map((g: any) => g.name) : [],
        description: media.overview || '',
        duration: media.number_of_seasons ? `${media.number_of_seasons} saison(s)` : '',
      };
    case 'book':
      return {
        ...base,
        title: media.volumeInfo?.title || '',
        cover_image: media.volumeInfo?.imageLinks?.thumbnail || null,
        year: media.volumeInfo?.publishedDate ? parseInt(media.volumeInfo.publishedDate.substring(0, 4)) : null,
        genres: media.volumeInfo?.categories || [],
        description: media.volumeInfo?.description || '',
        author: media.volumeInfo?.authors ? media.volumeInfo.authors.join(', ') : '',
      };
    case 'game':
      return {
        ...base,
        title: media.name || '',
        cover_image: media.background_image || null,
        year: media.released ? parseInt(media.released.substring(0, 4)) : null,
        rating: media.rating || null,
        genres: media.genres ? media.genres.map((g: any) => g.name) : [],
        description: media.description_raw || '',
        publisher: media.publishers && media.publishers.length > 0 ? media.publishers[0].name : '',
        platform: media.platforms ? media.platforms.map((p: any) => p.platform.name).join(', ') : '',
      };
    default:
      return base;
  }
}

async function ensureMediaExists(formattedMedia: any) {
  const { data: existingMedia, error: fetchError } = await supabase
    .from('media')
    .select('id')
    .eq('external_id', formattedMedia.external_id)
    .eq('type', formattedMedia.type)
    .maybeSingle();

  if (fetchError && fetchError.code !== 'PGRST116') {
    throw fetchError;
  }

  if (existingMedia) {
    return existingMedia.id;
  }

  const { data: newMedia, error: insertError } = await supabase
    .from('media')
    .insert(formattedMedia)
    .select('id')
    .single();

  if (insertError) {
    throw insertError;
  }

  return newMedia.id;
}

async function addToUserLibrary(userId: string, mediaId: string, formattedMedia: any): Promise<Media> {
  const { data: existingUserMedia, error: userMediaCheckError } = await supabase
    .from('user_media')
    .select('id')
    .eq('user_id', userId)
    .eq('media_id', mediaId)
    .maybeSingle();

  if (userMediaCheckError && userMediaCheckError.code !== 'PGRST116') {
    throw userMediaCheckError;
  }

  if (!existingUserMedia) {
    const { error: userMediaInsertError } = await supabase
      .from('user_media')
      .insert({
        user_id: userId,
        media_id: mediaId,
        status: 'to-watch'
      });

    if (userMediaInsertError) {
      throw userMediaInsertError;
    }
  }

  return {
    id: mediaId,
    type: formattedMedia.type,
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
