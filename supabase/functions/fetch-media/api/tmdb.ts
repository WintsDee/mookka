
import { corsHeaders } from "../cors.ts";
import { ApiConfig } from "../types.ts";

export async function fetchTMDBData(type: 'film' | 'serie', id: string | null, query: string | null, apiKey: string): Promise<any> {
  const mediaType = type === 'film' ? 'movie' : 'tv';
  let apiUrl: string;

  if (id) {
    const appendParams = type === 'serie' 
      ? 'credits,seasons,episode_groups,external_ids,content_ratings,videos,watch/providers' 
      : 'credits,external_ids,videos,watch/providers,release_dates';
      
    apiUrl = `https://api.themoviedb.org/3/${mediaType}/${id}?api_key=${apiKey}&language=fr-FR&include_adult=false&append_to_response=${appendParams}`;
  } else {
    apiUrl = `https://api.themoviedb.org/3/search/${mediaType}?api_key=${apiKey}&language=fr-FR&query=${encodeURIComponent(query!)}&page=1&include_adult=false&append_to_response=credits`;
  }

  const response = await fetch(apiUrl);
  return await response.json();
}

