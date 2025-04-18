
export const fetchTrendingBooks = async (apiKey: string) => {
  // Utiliser des livres populaires, pas seulement les plus récents
  const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=subject:fiction&orderBy=relevance&maxResults=15&key=${apiKey}`
  const response = await fetch(apiUrl)
  const data = await response.json()
  
  return data.items?.map((item: any) => {
    // Calculer un score de popularité basé sur les ratings et les reviews
    const rawRating = item.volumeInfo?.averageRating || 0;
    const ratingsCount = item.volumeInfo?.ratingsCount || 0;
    // Formule simple pour calculer la popularité: note * nombre d'avis
    const popularity = rawRating * (ratingsCount + 1) * 10;
    
    return {
      id: item.id,
      title: item.volumeInfo?.title,
      type: 'book',
      coverImage: item.volumeInfo?.imageLinks?.thumbnail,
      year: item.volumeInfo?.publishedDate ? parseInt(item.volumeInfo.publishedDate.substring(0, 4)) : null,
      author: item.volumeInfo?.authors?.[0],
      rating: rawRating ? rawRating * 2 : null, // Convertir en échelle /10 comme les autres médias
      genres: item.volumeInfo?.categories,
      popularity: popularity // Ajouter le score de popularité
    };
  }) || []
}

export const fetchBookById = async (apiKey: string, id: string) => {
  const apiUrl = `https://www.googleapis.com/books/v1/volumes/${id}?key=${apiKey}`
  const response = await fetch(apiUrl)
  return await response.json()
}
