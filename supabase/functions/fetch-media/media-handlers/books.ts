
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
  const apiUrl = `https://www.googleapis.com/books/v1/volumes/${id}?key=${apiKey}`
  const response = await fetch(apiUrl)
  const data = await response.json()
  
  if (!data || !data.volumeInfo) {
    console.error("Aucun livre trouvé avec cet ID");
    return null;
  }
  
  return {
    id: data.id,
    title: data.volumeInfo?.title,
    type: 'book',
    coverImage: data.volumeInfo?.imageLinks?.thumbnail || '/placeholder.svg',
    year: data.volumeInfo?.publishedDate ? parseInt(data.volumeInfo.publishedDate.substring(0, 4)) : null,
    author: data.volumeInfo?.authors?.[0],
    rating: data.volumeInfo?.averageRating ? data.volumeInfo.averageRating * 2 : null,
    genres: data.volumeInfo?.categories,
    description: data.volumeInfo?.description,
    publisher: data.volumeInfo?.publisher,
    pageCount: data.volumeInfo?.pageCount,
    language: data.volumeInfo?.language,
    externalData: data
  };
}

// Nouvelle fonction pour rechercher des livres par titre ou auteur
export const searchBooks = async (apiKey: string, query: string) => {
  // Recherche plus précise qui combine titres et auteurs
  const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=20&key=${apiKey}`
  
  try {
    console.log(`Recherche de livres avec la requête: ${query}`);
    const response = await fetch(apiUrl)
    const data = await response.json()
    
    if (!data.items || data.items.length === 0) {
      console.log("Aucun livre trouvé pour cette recherche");
      return { items: [] };
    }
    
    console.log(`Nombre de livres trouvés: ${data.items.length}`);
    
    // Retourner les résultats bruts pour être traités par le service de recherche
    return data;
  } catch (error) {
    console.error("Erreur lors de la recherche de livres:", error);
    return { items: [] };
  }
}
