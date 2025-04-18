
import { corsHeaders } from "../cors.ts";
import { ApiConfig } from "../types.ts";

export async function fetchRAWGData(id: string | null, query: string | null, apiKey: string): Promise<any> {
  const apiUrl = id
    ? `https://api.rawg.io/api/games/${id}?key=${apiKey}`
    : `https://api.rawg.io/api/games?key=${apiKey}&search=${encodeURIComponent(query!)}&page=1&page_size=40&exclude_additions=true&search_precise=false&search_exact=false&ordering=-relevance,-rating`;

  const response = await fetch(apiUrl);
  return await response.json();
}

