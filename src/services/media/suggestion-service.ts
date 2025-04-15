
import { supabase } from "@/integrations/supabase/client";
import { MediaType } from "@/types";

interface SuggestionData {
  title: string;
  type: MediaType | "";
  year?: string;
  description?: string;
  cover_url?: string;
  director?: string;
  creator?: string;
  author?: string;
  publisher?: string;
  platform?: string;
}

export async function submitMediaSuggestion(data: SuggestionData) {
  const suggestionData = {
    title: data.title,
    type: data.type,
    year: data.year ? parseInt(data.year) : null,
    description: data.description,
    cover_url: data.cover_url,
    director: data.director,
    creator: data.creator,
    author: data.author,
    publisher: data.publisher,
    platform: data.platform,
    status: 'pending'
  };

  const { data: result, error } = await supabase
    .from('media_suggestions')
    .insert(suggestionData);

  if (error) throw error;
  return result;
}
