
export async function handleRAWGGames(query?: string, id?: string) {
  const apiKey = Deno.env.get('RAWG_API_KEY') ?? '';
  
  const url = id
    ? `https://api.rawg.io/api/games/${id}?key=${apiKey}`
    : `https://api.rawg.io/api/games?key=${apiKey}&search=${encodeURIComponent(query!)}&page=1&page_size=40&exclude_additions=true&search_precise=false&search_exact=false&ordering=-relevance,-rating`;
    
  const response = await fetch(url);
  const data = await response.json();
  
  return data;
}
