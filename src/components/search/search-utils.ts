
import { MediaType } from "@/types";

export function getSearchPlaceholder(selectedType: MediaType | ""): string {
  switch(selectedType) {
    case "film": return "Rechercher un film...";
    case "serie": return "Rechercher une série...";
    case "book": return "Rechercher un livre...";
    case "game": return "Rechercher un jeu...";
    default: return "Sélectionnez d'abord un type de média";
  }
}

export function getSelectedTypeColor(selectedType: MediaType | ""): string {
  if (!selectedType) return "bg-secondary/60";
  return `bg-media-${selectedType}/10 border-media-${selectedType}/30`;
}

export function formatSearchResult(item: any, selectedType: MediaType): any {
  if (item.fromDatabase) {
    return {
      id: item.id,
      title: item.title,
      type: item.type,
      coverImage: item.coverImage || '/placeholder.svg',
      year: item.year,
      rating: item.rating,
      author: item.author,
      fromDatabase: true
    };
  }
  
  switch (selectedType) {
    case 'film':
      return {
        id: item.id,
        title: item.title,
        type: selectedType,
        coverImage: item.coverImage || '/placeholder.svg',
        year: item.year,
        rating: item.rating
      };
    case 'serie':
      return {
        id: item.id,
        title: item.title,
        type: selectedType,
        coverImage: item.coverImage || '/placeholder.svg',
        year: item.year,
        rating: item.rating
      };
    case 'book':
      return {
        id: item.id,
        title: item.title,
        type: selectedType,
        coverImage: item.coverImage || '/placeholder.svg',
        year: item.year,
        author: item.author
      };
    case 'game':
      return {
        id: item.id,
        title: item.title,
        type: selectedType,
        coverImage: item.coverImage || '/placeholder.svg',
        year: item.year,
        rating: item.rating
      };
    default:
      return item;
  }
}
