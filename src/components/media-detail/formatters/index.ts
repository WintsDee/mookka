
import { MediaType } from "@/types";
import { formatFilmDetails, getFilmAdditionalInfo } from "./film-formatter";
import { formatSerieDetails, getSerieAdditionalInfo } from "./serie-formatter";
import { formatBookDetails, getBookAdditionalInfo } from "./book-formatter";
import { formatGameDetails, getGameAdditionalInfo } from "./game-formatter";

export function formatMediaDetails(media: any, type: MediaType): any {
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
      return formatFilmDetails(media);
    case 'serie':
      return formatSerieDetails(media);
    case 'book':
      return formatBookDetails(media);
    case 'game':
      return formatGameDetails(media);
  }
}

export function getAdditionalMediaInfo(media: any, formattedMedia: any, type: MediaType): any {
  const info: any = {
    mediaType: type,
    releaseDate: formattedMedia.year ? `${formattedMedia.year}` : undefined,
    duration: formattedMedia.duration
  };
  
  switch(type) {
    case 'film':
      return { ...info, ...getFilmAdditionalInfo(media, formattedMedia) };
    case 'serie':
      return { ...info, ...getSerieAdditionalInfo(media) };
    case 'book':
      return { ...info, ...getBookAdditionalInfo(media, formattedMedia) };
    case 'game':
      return { ...info, ...getGameAdditionalInfo(media, formattedMedia) };
  }
  
  return info;
}
