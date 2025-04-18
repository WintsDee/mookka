
import { MediaType } from "@/types";

export function formatMediaDetails(media: any, type: MediaType): any {
  let formattedMedia: any = {};
  
  // Adding null check to prevent errors when media is undefined
  if (!media) {
    return {
      id: "unknown",
      title: "Contenu non disponible",
      type,
      coverImage: '/placeholder.svg',
      description: "Impossible de charger les détails de ce média.",
    };
  }
  
  switch (type) {
    case 'film':
      formattedMedia = {
        id: media.id?.toString() || "unknown",
        title: media.title || media.original_title || "Film sans titre",
        coverImage: media.poster_path ? `https://image.tmdb.org/t/p/original${media.poster_path}` : '/placeholder.svg',
        year: media.release_date ? media.release_date.substring(0, 4) : null,
        rating: normalizeRating(media.vote_average, 10),
        genres: media.genres?.map((g: any) => g.name) || [],
        description: media.overview || "Aucune description disponible.",
        duration: media.runtime ? `${media.runtime} min` : null,
        director: media.credits?.crew?.find((p: any) => p.job === 'Director')?.name,
        type: 'film'
      };
      break;
    case 'serie':
      formattedMedia = {
        id: media.id?.toString() || "unknown",
        title: media.name || media.original_name || "Série sans titre",
        coverImage: media.poster_path ? `https://image.tmdb.org/t/p/original${media.poster_path}` : '/placeholder.svg',
        year: media.first_air_date ? media.first_air_date.substring(0, 4) : null,
        rating: normalizeRating(media.vote_average, 10),
        genres: media.genres?.map((g: any) => g.name) || [],
        description: media.overview || "Aucune description disponible.",
        duration: media.number_of_seasons ? `${media.number_of_seasons} saison${media.number_of_seasons > 1 ? 's' : ''}` : null,
        type: 'serie'
      };
      break;
    case 'book':
      formattedMedia = {
        id: media.id || "unknown",
        title: media.volumeInfo?.title || "Livre sans titre",
        coverImage: media.volumeInfo?.imageLinks?.thumbnail || '/placeholder.svg',
        year: media.volumeInfo?.publishedDate ? media.volumeInfo.publishedDate.substring(0, 4) : null,
        genres: media.volumeInfo?.categories || [],
        description: media.volumeInfo?.description || "Aucune description disponible.",
        author: media.volumeInfo?.authors?.join(', '),
        rating: normalizeRating(media.volumeInfo?.averageRating, 5), // Google Books uses rating out of 5
        type: 'book'
      };
      break;
    case 'game':
      // Pour les jeux, si la description est en anglais, nous pouvons utiliser une description traduite si disponible
      let gameDescription = media.description_raw || media.description || "Aucune description disponible.";
      
      // Si la description est vide ou uniquement en anglais, vérifions s'il y a une version française
      if (media.locale_descriptions && media.locale_descriptions['fr']) {
        gameDescription = media.locale_descriptions['fr'];
      }
      
      formattedMedia = {
        id: media.id?.toString() || "unknown",
        title: media.name || "Jeu sans titre",
        coverImage: media.background_image || '/placeholder.svg',
        year: media.released ? media.released.substring(0, 4) : null,
        rating: normalizeRating(media.rating, 5), // RAWG uses rating out of 5
        genres: media.genres?.map((g: any) => g.name) || [],
        description: gameDescription,
        publisher: media.publishers?.length > 0 ? media.publishers[0].name : null,
        platform: media.platforms?.map((p: any) => p.platform.name).join(', '),
        type: 'game'
      };
      break;
  }
  
  return formattedMedia;
}

// Helper function to normalize ratings to a 10-point scale
function normalizeRating(rating: number | undefined, sourceScale: number): number | null {
  if (rating === undefined || rating === null) {
    return null;
  }
  
  // Convert the rating to the 10-point scale if it's not already
  if (sourceScale !== 10) {
    return parseFloat(((rating / sourceScale) * 10).toFixed(1));
  }
  
  // Already on 10-point scale, just ensure one decimal place
  return parseFloat(rating.toFixed(1));
}

export function getAdditionalMediaInfo(media: any, formattedMedia: any, type: MediaType): any {
  const info: any = {
    mediaType: type,
    releaseDate: formattedMedia.year ? `${formattedMedia.year}` : undefined,
    duration: formattedMedia.duration
  };
  
  switch(type) {
    case 'film':
      info.director = formattedMedia.director;
      info.studio = media.production_companies?.[0]?.name;
      info.cast = media.credits?.cast?.slice(0, 10).map((actor: any) => actor.name);
      info.originalTitle = media.original_title;
      info.language = media.original_language?.toUpperCase();
      info.budget = media.budget ? `${(media.budget / 1000000).toFixed(1)}M €` : undefined;
      info.revenue = media.revenue ? `${(media.revenue / 1000000).toFixed(1)}M €` : undefined;
      info.productionCountries = media.production_countries?.map((c: any) => c.name).join(', ');
      info.awards = media.awards || [];
      break;
      
    case 'serie':
      info.seasons = media.number_of_seasons;
      info.episodes = media.number_of_episodes;
      info.cast = media.credits?.cast?.slice(0, 10).map((actor: any) => actor.name);
      info.creators = media.created_by?.map((creator: any) => creator.name).join(', ');
      info.status = translateStatus(media.status); // Traduire le statut
      info.networks = media.networks?.map((n: any) => n.name).join(', ');
      info.originalTitle = media.original_name;
      info.language = media.original_language?.toUpperCase();
      info.nextEpisode = media.next_episode_to_air ? new Date(media.next_episode_to_air.air_date).toLocaleDateString('fr-FR') : undefined;
      info.awards = media.awards || [];
      break;
      
    case 'book':
      info.author = formattedMedia.author;
      info.publisher = media.volumeInfo?.publisher;
      info.pages = media.volumeInfo?.pageCount;
      info.isbn = media.volumeInfo?.industryIdentifiers?.find((id: any) => id.type === 'ISBN_13')?.identifier;
      info.isbn10 = media.volumeInfo?.industryIdentifiers?.find((id: any) => id.type === 'ISBN_10')?.identifier;
      info.language = media.volumeInfo?.language?.toUpperCase();
      info.printType = translatePrintType(media.volumeInfo?.printType);
      info.maturityRating = translateMaturityRating(media.volumeInfo?.maturityRating);
      info.publishDate = media.volumeInfo?.publishedDate;
      info.awards = media.awards || [];
      // Add normalized metacritic score if available
      info.metacritic = media.volumeInfo?.averageRating 
        ? normalizeRating(media.volumeInfo.averageRating, 5) 
        : undefined;
      break;
      
    case 'game':
      info.developer = media.developers?.[0]?.name;
      info.publisher = formattedMedia.publisher;
      info.platform = formattedMedia.platform;
      info.esrbRating = translateEsrbRating(media.esrb_rating?.name);
      info.metacritic = media.metacritic ? normalizeRating(media.metacritic, 100) : undefined; // Metacritic uses 100-point scale
      info.genres = media.genres?.map((g: any) => g.name).join(', ');
      info.releaseDate = media.released;
      info.website = media.website;
      info.tags = media.tags?.slice(0, 5).map((t: any) => t.name);
      info.awards = media.awards || [];
      break;
  }
  
  return info;
}

// Fonctions de traduction pour divers champs
function translateStatus(status: string): string {
  if (!status) return "";
  
  const statusMap: Record<string, string> = {
    'Ended': 'Terminée',
    'Canceled': 'Annulée',
    'Returning Series': 'En cours',
    'In Production': 'En production',
    'Planned': 'Planifiée',
    'Pilot': 'Pilote',
    'Pilot Ordered': 'Pilote commandé'
  };
  
  return statusMap[status] || status;
}

function translatePrintType(printType: string): string {
  if (!printType) return "";
  
  const printTypeMap: Record<string, string> = {
    'BOOK': 'Livre',
    'MAGAZINE': 'Magazine',
    'COMICS': 'Bande dessinée',
    'NEWSPAPER': 'Journal',
    'EBOOK': 'Livre électronique'
  };
  
  return printTypeMap[printType] || printType;
}

function translateMaturityRating(rating: string): string {
  if (!rating) return "";
  
  const ratingMap: Record<string, string> = {
    'NOT_MATURE': 'Tout public',
    'MATURE': 'Mature'
  };
  
  return ratingMap[rating] || rating;
}

function translateEsrbRating(rating: string): string {
  if (!rating) return "";
  
  const ratingMap: Record<string, string> = {
    'Everyone': 'Tout public',
    'Everyone 10+': '10 ans et plus',
    'Teen': 'Adolescents',
    'Mature': '17 ans et plus',
    'Adults Only': 'Adultes uniquement',
    'Rating Pending': 'Évaluation en cours'
  };
  
  return ratingMap[rating] || rating;
}
