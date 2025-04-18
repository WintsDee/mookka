
import { normalizeRating } from './utils';

export function formatBookDetails(media: any) {
  return {
    id: media.id || "unknown",
    title: media.volumeInfo?.title || "Livre sans titre",
    coverImage: media.volumeInfo?.imageLinks?.thumbnail || '/placeholder.svg',
    year: media.volumeInfo?.publishedDate ? media.volumeInfo.publishedDate.substring(0, 4) : null,
    genres: media.volumeInfo?.categories || [],
    description: media.volumeInfo?.description || "Aucune description disponible.",
    author: media.volumeInfo?.authors?.join(', '),
    rating: normalizeRating(media.volumeInfo?.averageRating, 5),
    type: 'book'
  };
}

export function getBookAdditionalInfo(media: any, formattedMedia: any) {
  return {
    author: formattedMedia.author,
    publisher: media.volumeInfo?.publisher,
    pages: media.volumeInfo?.pageCount,
    isbn: media.volumeInfo?.industryIdentifiers?.find((id: any) => id.type === 'ISBN_13')?.identifier,
    isbn10: media.volumeInfo?.industryIdentifiers?.find((id: any) => id.type === 'ISBN_10')?.identifier,
    language: media.volumeInfo?.language?.toUpperCase(),
    printType: translatePrintType(media.volumeInfo?.printType),
    maturityRating: translateMaturityRating(media.volumeInfo?.maturityRating),
    publishDate: media.volumeInfo?.publishedDate,
    awards: media.awards || [],
    metacritic: media.volumeInfo?.averageRating 
      ? normalizeRating(media.volumeInfo.averageRating, 5) 
      : undefined
  };
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
