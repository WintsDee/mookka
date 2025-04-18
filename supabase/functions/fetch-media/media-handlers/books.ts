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

// Nouvelle fonction pour rechercher des livres par titre ou auteur avec gestion d'erreur améliorée
export const searchBooks = async (apiKey: string, query: string) => {
  // Recherche plus précise qui combine titres et auteurs
  const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=20&key=${apiKey}`
  
  try {
    console.log(`Recherche de livres avec la requête: ${query}`);
    const response = await fetch(apiUrl)
    const data = await response.json()
    
    // Vérifier si on a reçu une erreur de quota dépassé
    if (data.error && data.error.code === 429) {
      console.error("Quota Google Books API dépassé, utilisant données de secours");
      return { 
        items: getFallbackBookResults(query),
        quotaExceeded: true 
      };
    }
    
    if (!data.items || data.items.length === 0) {
      console.log("Aucun livre trouvé pour cette recherche");
      return { items: [] };
    }
    
    console.log(`Nombre de livres trouvés: ${data.items.length}`);
    
    // Retourner les résultats bruts pour être traités par le service de recherche
    return data;
  } catch (error) {
    console.error("Erreur lors de la recherche de livres:", error);
    // En cas d'erreur, utiliser les données de secours
    return { 
      items: getFallbackBookResults(query),
      error: true 
    };
  }
}

// Fonction qui retourne des résultats de livres de secours basés sur la requête
function getFallbackBookResults(query: string) {
  const fallbackBooks = [
    {
      id: 'fallback-book-1',
      volumeInfo: {
        title: 'Le Comte de Monte-Cristo',
        authors: ['Alexandre Dumas'],
        publishedDate: '1844',
        description: 'Un classique de la littérature française sur la vengeance et la rédemption.',
        imageLinks: {
          thumbnail: 'https://m.media-amazon.com/images/I/71TIqLkCJBL._AC_UF1000,1000_QL80_.jpg'
        },
        categories: ['Fiction', 'Classique'],
        averageRating: 4.5,
        ratingsCount: 1000
      }
    },
    {
      id: 'fallback-book-2',
      volumeInfo: {
        title: 'Les Misérables',
        authors: ['Victor Hugo'],
        publishedDate: '1862',
        description: 'L\'histoire de Jean Valjean, un ancien forçat qui devient force du bien malgré les difficultés de la société.',
        imageLinks: {
          thumbnail: 'https://m.media-amazon.com/images/I/71qtG6bH2GL._AC_UF1000,1000_QL80_.jpg'
        },
        categories: ['Fiction', 'Classique'],
        averageRating: 4.7,
        ratingsCount: 1200
      }
    },
    {
      id: 'fallback-book-3',
      volumeInfo: {
        title: 'Harry Potter à l\'école des sorciers',
        authors: ['J.K. Rowling'],
        publishedDate: '1997',
        description: 'Le premier tome de la célèbre série Harry Potter.',
        imageLinks: {
          thumbnail: 'https://m.media-amazon.com/images/I/81m1s4wIPML._AC_UF1000,1000_QL80_.jpg'
        },
        categories: ['Fiction', 'Fantasy', 'Jeunesse'],
        averageRating: 4.8,
        ratingsCount: 2000
      }
    },
    {
      id: 'fallback-book-4',
      volumeInfo: {
        title: 'Le Petit Prince',
        authors: ['Antoine de Saint-Exupéry'],
        publishedDate: '1943',
        description: 'Un conte poétique qui aborde les thèmes de l\'amitié, de l\'amour et du sens de la vie.',
        imageLinks: {
          thumbnail: 'https://m.media-amazon.com/images/I/71MEW1K2U0L._AC_UF1000,1000_QL80_.jpg'
        },
        categories: ['Fiction', 'Classique', 'Jeunesse'],
        averageRating: 4.9,
        ratingsCount: 1800
      }
    },
    {
      id: 'fallback-book-5',
      volumeInfo: {
        title: 'L\'Étranger',
        authors: ['Albert Camus'],
        publishedDate: '1942',
        description: 'Un roman existentialiste sur l\'absurdité de la vie humaine.',
        imageLinks: {
          thumbnail: 'https://m.media-amazon.com/images/I/61+-mY1d7UL._AC_UF1000,1000_QL80_.jpg'
        },
        categories: ['Fiction', 'Philosophie'],
        averageRating: 4.4,
        ratingsCount: 900
      }
    }
  ];
  
  // Filtrer les livres de secours en fonction de la requête
  const queryLower = query.toLowerCase();
  return fallbackBooks.filter(book => {
    const title = book.volumeInfo.title.toLowerCase();
    const author = book.volumeInfo.authors[0].toLowerCase();
    
    return title.includes(queryLower) || author.includes(queryLower) ||
           // Si la requête est courte ou vague, retourner tous les livres
           query.length < 3;
  });
}
