
export const fetchTrendingSeries = async (apiKey: string) => {
  const apiUrl = `https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&language=fr-FR&page=1`
  const response = await fetch(apiUrl)
  const data = await response.json()
  
  // Fetch genres to map IDs to names
  const genresResponse = await fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${apiKey}&language=fr-FR`)
  const genresData = await genresResponse.json()
  const genreMap = Object.fromEntries(genresData.genres?.map((g: any) => [g.id, g.name]) || [])
  
  return data.results?.slice(0, 8).map((item: any) => ({
    id: item.id,
    title: item.name,
    type: 'serie',
    coverImage: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
    year: item.first_air_date ? parseInt(item.first_air_date.substring(0, 4)) : null,
    rating: item.vote_average,
    genres: item.genre_ids?.map((id: number) => genreMap[id] || `Genre ${id}`),
    popularity: item.popularity
  })) || []
}

export const fetchSerieById = async (apiKey: string, id: string) => {
  try {
    console.log(`Récupération de la série avec ID=${id} depuis TMDB`);
    
    // Vérifier si l'ID est valide
    if (!id || id === 'undefined' || id === 'null') {
      throw new Error("ID de série invalide");
    }
    
    // Vérifier si l'ID est un UUID Supabase
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    
    if (isUUID) {
      console.log(`L'ID ${id} semble être un UUID Supabase et non un ID TMDB. Tentative de conversion...`);
      
      // Si c'est un UUID, essayons de récupérer d'abord l'ID externe depuis Supabase
      const supabaseUrl = Deno.env.get("SUPABASE_URL");
      const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY");
      
      if (!supabaseUrl || !supabaseKey) {
        throw new Error("Variables d'environnement Supabase manquantes");
      }
      
      const supabaseMediaResponse = await fetch(
        `${supabaseUrl}/rest/v1/media?id=eq.${id}&select=external_id`,
        {
          headers: {
            "Content-Type": "application/json",
            "apikey": supabaseKey,
            "Authorization": `Bearer ${supabaseKey}`
          }
        }
      );
      
      if (!supabaseMediaResponse.ok) {
        throw new Error(`Erreur lors de la récupération du média Supabase: ${supabaseMediaResponse.status}`);
      }
      
      const supabaseMediaData = await supabaseMediaResponse.json();
      
      if (supabaseMediaData.length === 0 || !supabaseMediaData[0].external_id) {
        throw new Error(`Aucun ID externe trouvé pour le média Supabase avec l'ID ${id}`);
      }
      
      // Utiliser l'ID externe pour la requête TMDB
      id = supabaseMediaData[0].external_id;
      console.log(`ID externe TMDB récupéré: ${id}`);
    }
    
    const appendParams = 'credits,seasons,episode_groups,external_ids,content_ratings,videos,watch/providers'
    const apiUrl = `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&language=fr-FR&include_adult=false&append_to_response=${appendParams}`
    console.log(`Requête à l'API TMDB pour la série: ${apiUrl}`);
    
    const response = await fetch(apiUrl)
    
    if (!response.ok) {
      console.error(`Erreur API TMDB: ${response.status} ${response.statusText}`);
      throw new Error(`L'API a répondu avec le statut ${response.status}`);
    }
    
    const data = await response.json()
    
    if (!data || !data.id || !data.name) {
      console.error("Réponse API invalide:", data);
      throw new Error("Réponse API invalide: données de série incomplètes");
    }
    
    console.log(`Données de série reçues avec succès pour l'ID ${id}`, { 
      hasId: !!data.id, 
      name: data.name 
    });
    
    return data;
  } catch (error) {
    console.error(`Erreur lors de la récupération de la série avec l'ID ${id}:`, error);
    throw error;
  }
}
