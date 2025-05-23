
export const fetchTrendingFilms = async (apiKey: string) => {
  const apiUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=fr-FR&page=1`
  const response = await fetch(apiUrl)
  const data = await response.json()
  
  // Fetch genres to map IDs to names
  const genresResponse = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=fr-FR`)
  const genresData = await genresResponse.json()
  const genreMap = Object.fromEntries(genresData.genres?.map((g: any) => [g.id, g.name]) || [])
  
  return data.results?.slice(0, 8).map((item: any) => ({
    id: item.id,
    title: item.title,
    type: 'film',
    coverImage: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
    year: item.release_date ? parseInt(item.release_date.substring(0, 4)) : null,
    rating: item.vote_average,
    genres: item.genre_ids?.map((id: number) => genreMap[id] || `Genre ${id}`),
    popularity: item.popularity
  })) || []
}

export const fetchFilmById = async (apiKey: string, id: string) => {
  try {
    console.log(`Récupération du film avec ID=${id} depuis TMDB`);
    
    // Vérifier si l'ID est valide
    if (!id || id === 'undefined' || id === 'null') {
      throw new Error("ID de film invalide");
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
    
    const appendParams = 'credits,external_ids,videos,watch/providers,release_dates'
    const apiUrl = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=fr-FR&include_adult=false&append_to_response=${appendParams}`
    console.log(`Requête à l'API TMDB pour le film: ${apiUrl}`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 secondes timeout
    
    try {
      const response = await fetch(apiUrl, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        console.error(`Erreur API TMDB: ${response.status} ${response.statusText}`);
        throw new Error(`L'API a répondu avec le statut ${response.status}`);
      }
      
      const data = await response.json();
      
      // Valider la présence des données essentielles
      if (!data || !data.id) {
        console.error("Réponse API invalide:", data);
        throw new Error("Réponse API invalide: données de film incomplètes");
      }
      
      // S'assurer que le film a un titre
      if (!data.title && !data.original_title) {
        data.title = `Film #${id}`;
        console.log(`Titre manquant, utilisation d'un titre par défaut: ${data.title}`);
      } else if (!data.title) {
        data.title = data.original_title;
        console.log(`Titre français manquant, utilisation du titre original: ${data.title}`);
      }
      
      console.log(`Données de film reçues avec succès pour l'ID ${id}`, { 
        hasId: !!data.id, 
        title: data.title 
      });
      
      return data;
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        throw new Error("Délai d'attente de l'API TMDB dépassé");
      }
      throw fetchError;
    }
  } catch (error) {
    console.error(`Erreur lors de la récupération du film avec l'ID ${id}:`, error);
    throw error;
  }
}
