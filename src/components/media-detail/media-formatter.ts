import { MediaType } from "@/types";

export function formatMediaDetails(media: any, type: MediaType): any {
  let formattedMedia: any = {};
  
  switch (type) {
    case 'film':
      formattedMedia = {
        id: media.id.toString(),
        title: media.title || media.original_title,
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
        id: media.id.toString(),
        title: media.name || media.original_name,
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
        id: media.id,
        title: media.volumeInfo?.title,
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
        id: media.id.toString(),
        title: media.name,
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
      info.cast = media.cast?.map((actor: any) => actor.name);
      info.creators = media.created_by?.map((creator: any) => creator.name).join(', ');
      info.status = translateStatus(media.status);
      info.networks = media.networks?.map((n: any) => n.name).join(', ');
      info.originalTitle = media.original_name;
      info.language = media.original_language?.toUpperCase();
      info.nextEpisode = media.next_episode_to_air ? new Date(media.next_episode_to_air.air_date).toLocaleDateString('fr-FR') : undefined;
      info.awards = media.awards || [];
      info.type = media.type;
      info.genres = media.genres?.map((g: any) => g.name);
      info.episodeRuntime = media.episode_run_time?.[0];
      info.firstAirDate = media.first_air_date;
      info.lastAirDate = media.last_air_date;
      info.inProduction = media.in_production;
      info.keywords = media.keywordsList;
      info.voteAverage = media.vote_average;
      info.voteCount = media.vote_count;
      info.popularity = media.popularity;
      info.seasonsDetailed = media.seasons?.map((season: any) => ({
        id: season.id,
        name: season.name,
        overview: season.overview,
        seasonNumber: season.season_number,
        episodeCount: season.episode_count,
        airDate: season.air_date,
        episodes: season.episodes?.map((episode: any) => ({
          id: episode.id,
          number: episode.number,
          title: episode.title,
          overview: episode.overview,
          airDate: episode.airDate,
          stillPath: episode.stillPath,
          runtime: episode.runtime,
          voteAverage: episode.voteAverage,
          crew: episode.crew,
          guestStars: episode.guestStars
        }))
      }));
      
      // French specific data if available
      if (media.frenchData) {
        info.frenchTitle = media.frenchData.name;
        info.frenchOverview = media.frenchData.overview;
        info.frenchTagline = media.frenchData.tagline;
      }
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
