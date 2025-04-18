
import { supabase } from "@/integrations/supabase/client";
import { Media } from "@/types";

export async function ensureMediaExists(formattedMedia: any) {
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

export async function addToUserLibrary(userId: string, mediaId: string, formattedMedia: any): Promise<Media> {
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
