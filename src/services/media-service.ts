
import { supabase } from "@/integrations/supabase/client";
import { Media, MediaType } from "@/types";

export async function searchMedia(type: MediaType, query: string): Promise<any> {
  try {
    const { data, error } = await supabase.functions.invoke('fetch-media', {
      body: { type, query }
    });

    if (error) {
      console.error("Erreur lors de la recherche de médias:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Erreur dans searchMedia:", error);
    throw error;
  }
}

export async function getMediaById(type: MediaType, id: string): Promise<any> {
  try {
    const { data, error } = await supabase.functions.invoke('fetch-media', {
      body: { type, id }
    });

    if (error) {
      console.error("Erreur lors de la récupération du média:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Erreur dans getMediaById:", error);
    throw error;
  }
}

export async function addMediaToLibrary(media: any, type: MediaType): Promise<Media> {
  // Formater les données du média selon le type
  let formattedMedia: any = {
    external_id: media.id || '',
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
    .eq('external_id', media.id)
    .eq('type', type)
    .single();

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

  // Maintenant, ajouter l'entrée dans user_media
  const { data: userMedia, error: userMediaError } = await supabase
    .from('user_media')
    .insert({
      user_id: (await supabase.auth.getUser()).data.user?.id,
      media_id: mediaId,
      status: 'to-watch'
    })
    .single();

  if (userMediaError) {
    // Si l'erreur est due à une contrainte d'unicité, ce n'est pas grave
    if (userMediaError.code !== '23505') { // 23505 est le code pour "unique_violation"
      console.error("Erreur lors de l'ajout du média à la bibliothèque:", userMediaError);
      throw userMediaError;
    }
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
    status: 'to-watch',
    duration: formattedMedia.duration,
    director: formattedMedia.director,
    author: formattedMedia.author,
    publisher: formattedMedia.publisher,
    platform: formattedMedia.platform
  };
}
