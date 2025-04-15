
import { MediaType } from "@/types";

export function formatMediaDetails(media: any, type: MediaType): any {
  let formattedMedia: any = {};
  
  switch (type) {
    case 'film':
      formattedMedia = {
        id: media.id.toString(),
        title: media.title,
        coverImage: media.poster_path ? `https://image.tmdb.org/t/p/original${media.poster_path}` : '/placeholder.svg',
        year: media.release_date ? media.release_date.substring(0, 4) : null,
        rating: media.vote_average || null,
        genres: media.genres?.map((g: any) => g.name) || [],
        description: media.overview,
        duration: media.runtime ? `${media.runtime} min` : null,
        director: media.credits?.crew?.find((p: any) => p.job === 'Director')?.name,
        type: 'film'
      };
      break;
    case 'serie':
      formattedMedia = {
        id: media.id.toString(),
        title: media.name,
        coverImage: media.poster_path ? `https://image.tmdb.org/t/p/original${media.poster_path}` : '/placeholder.svg',
        year: media.first_air_date ? media.first_air_date.substring(0, 4) : null,
        rating: media.vote_average || null,
        genres: media.genres?.map((g: any) => g.name) || [],
        description: media.overview,
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
        description: media.volumeInfo?.description,
        author: media.volumeInfo?.authors?.join(', '),
        type: 'book'
      };
      break;
    case 'game':
      formattedMedia = {
        id: media.id.toString(),
        title: media.name,
        coverImage: media.background_image || '/placeholder.svg',
        year: media.released ? media.released.substring(0, 4) : null,
        rating: media.rating || null,
        genres: media.genres?.map((g: any) => g.name) || [],
        description: media.description_raw,
        publisher: media.publishers?.length > 0 ? media.publishers[0].name : null,
        platform: media.platforms?.map((p: any) => p.platform.name).join(', '),
        type: 'game'
      };
      break;
  }
  
  return formattedMedia;
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
      break;
    case 'serie':
      info.seasons = media.number_of_seasons;
      info.episodes = media.number_of_episodes;
      info.cast = media.credits?.cast?.slice(0, 10).map((actor: any) => actor.name);
      break;
    case 'book':
      info.author = formattedMedia.author;
      info.publisher = media.volumeInfo?.publisher;
      info.pages = media.volumeInfo?.pageCount;
      break;
    case 'game':
      info.developer = media.developers?.[0]?.name;
      info.publisher = formattedMedia.publisher;
      info.platform = formattedMedia.platform;
      break;
  }
  
  return info;
}
