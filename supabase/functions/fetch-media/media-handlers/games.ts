
export const fetchTrendingGames = async (apiKey: string) => {
  const currentYear = new Date().getFullYear()
  const apiUrl = `https://api.rawg.io/api/games?key=${apiKey}&dates=${currentYear-1}-01-01,${currentYear}-12-31&ordering=-added&page_size=8`
  
  const response = await fetch(apiUrl)
  const data = await response.json()
  
  return data.results?.map((item: any) => ({
    id: item.id,
    title: item.name,
    type: 'game',
    coverImage: item.background_image,
    year: item.released ? parseInt(item.released.substring(0, 4)) : null,
    rating: item.rating,
    genres: item.genres?.map((g: any) => g.name)
  })) || []
}

export const fetchGameById = async (apiKey: string, id: string) => {
  try {
    console.log(`Récupération du jeu avec ID=${id} depuis l'API RAWG`);
    
    // Vérifier si l'ID est un UUID Supabase (format e338e2b4-e9d7-4b56-a7aa-af4e2ef63397)
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    
    if (isUUID) {
      console.log(`L'ID ${id} semble être un UUID Supabase et non un ID RAWG. Tentative de conversion...`);
      
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
      
      // Utiliser l'ID externe pour la requête RAWG
      id = supabaseMediaData[0].external_id;
      console.log(`ID externe RAWG récupéré: ${id}`);
    }
    
    // Vérifier si l'ID est valide
    if (!id || id === 'undefined' || id === 'null') {
      throw new Error("ID de jeu invalide");
    }
    
    // Maintenant que nous avons le bon ID, procédons à la requête RAWG
    const apiUrl = `https://api.rawg.io/api/games/${id}?key=${apiKey}&language=fr`;
    console.log(`Requête à l'API RAWG: ${apiUrl}`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 secondes timeout
    
    try {
      const response = await fetch(apiUrl, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        console.error(`Erreur API RAWG: ${response.status} ${response.statusText}`);
        throw new Error(`L'API RAWG a répondu avec le statut ${response.status}`);
      }
      
      const data = await response.json();
      
      // Valider la présence des données essentielles
      if (!data || !data.id) {
        console.error("Réponse API invalide:", data);
        throw new Error("Réponse API invalide: données de jeu incomplètes");
      }
      
      // S'assurer que le jeu a un nom
      if (!data.name || data.name.trim() === '') {
        data.name = `Jeu #${id}`;
        console.log(`Nom manquant, utilisation d'un nom par défaut: ${data.name}`);
      }
      
      console.log(`Données de jeu reçues avec succès pour l'ID ${id}`, { 
        hasId: !!data.id, 
        name: data.name 
      });
      
      return data;
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        throw new Error("Délai d'attente de l'API RAWG dépassé");
      }
      throw fetchError;
    }
  } catch (error) {
    console.error(`Erreur lors de la récupération du jeu avec l'ID ${id}:`, error);
    throw error;
  }
}
