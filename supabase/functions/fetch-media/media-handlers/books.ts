
export const fetchTrendingBooks = async (apiKey: string) => {
  // Utiliser une requête plus large pour obtenir plus de livres populaires
  const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=subject:fiction|subject:novel&orderBy=relevance&maxResults=20&key=${apiKey}`
  const response = await fetch(apiUrl)
  const data = await response.json()
  
  if (!data.items || data.items.length === 0) {
    console.error("Aucun livre retourné par l'API Google Books");
    return [];
  }
  
  console.log(`Livres récupérés: ${data.items.length}`);
  
  return data.items?.map((item: any) => {
    // Calculer un score de popularité basé sur les ratings et les reviews
    const rawRating = item.volumeInfo?.averageRating || 0;
    const ratingsCount = item.volumeInfo?.ratingsCount || 0;
    // Formule améliorée pour calculer la popularité: note * nombre d'avis
    const popularity = rawRating * (ratingsCount + 1) * 100; // Augmenté le multiplicateur pour donner plus de poids aux livres
    
    return {
      id: item.id,
      title: item.volumeInfo?.title,
      type: 'book',
      coverImage: item.volumeInfo?.imageLinks?.thumbnail || '/placeholder.svg',
      year: item.volumeInfo?.publishedDate ? parseInt(item.volumeInfo.publishedDate.substring(0, 4)) : null,
      author: item.volumeInfo?.authors?.[0],
      rating: rawRating ? rawRating * 2 : null, // Convertir en échelle /10 comme les autres médias
      genres: item.volumeInfo?.categories,
      popularity: popularity,
      releaseDate: item.volumeInfo?.publishedDate
    };
  }) || []
}

export const fetchBookById = async (apiKey: string, id: string) => {
  try {
    console.log(`Récupération du livre avec ID=${id} depuis Google Books`);
    
    // Vérifier si l'ID est valide
    if (!id || id === 'undefined' || id === 'null') {
      throw new Error("ID de livre invalide");
    }
    
    // Vérifier si l'ID est un UUID Supabase
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    
    if (isUUID) {
      console.log(`L'ID ${id} semble être un UUID Supabase et non un ID Google Books. Tentative de conversion...`);
      
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
      
      // Utiliser l'ID externe pour la requête Google Books
      id = supabaseMediaData[0].external_id;
      console.log(`ID externe Google Books récupéré: ${id}`);
    }
    
    const apiUrl = `https://www.googleapis.com/books/v1/volumes/${id}?key=${apiKey}`
    console.log(`Requête à l'API Google Books: ${apiUrl}`);
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      console.error(`Erreur API Google Books: ${response.status} ${response.statusText}`);
      throw new Error(`L'API a répondu avec le statut ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data || !data.id || !data.volumeInfo) {
      console.error("Réponse API invalide:", data);
      throw new Error("Réponse API invalide: données de livre incomplètes");
    }
    
    console.log(`Données de livre reçues avec succès pour l'ID ${id}`, { 
      hasId: !!data.id, 
      title: data.volumeInfo?.title 
    });
    
    return data;
  } catch (error) {
    console.error(`Erreur lors de la récupération du livre avec l'ID ${id}:`, error);
    throw error;
  }
}
