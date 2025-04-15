
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
