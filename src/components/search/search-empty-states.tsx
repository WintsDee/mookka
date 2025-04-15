
import React from "react";
import { MediaType } from "@/types";
import { Search, AlertCircle, BookOpen, Film, Tv, Gamepad } from "lucide-react";

interface SearchEmptyStateProps {
  searchQuery: string;
  selectedType: MediaType | "";
}

export const NoResultsState = ({ searchQuery }: { searchQuery: string }) => (
  <div className="flex flex-col items-center justify-center h-40 text-center">
    <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
    <p className="text-muted-foreground">
      Aucun résultat trouvé pour "<span className="font-medium">{searchQuery}</span>"
    </p>
  </div>
);

export const StartTypingState = ({ selectedType }: { selectedType: MediaType }) => {
  const getTypeIcon = () => {
    switch (selectedType) {
      case "film":
        return <Film className="h-10 w-10 mb-2 text-media-film" />;
      case "serie":
        return <Tv className="h-10 w-10 mb-2 text-media-serie" />;
      case "book":
        return <BookOpen className="h-10 w-10 mb-2 text-media-book" />;
      case "game":
        return <Gamepad className="h-10 w-10 mb-2 text-media-game" />;
      default:
        return <Search className="h-10 w-10 mb-2 text-muted-foreground" />;
    }
  };

  const getTypeText = () => {
    switch (selectedType) {
      case "film":
        return "films";
      case "serie":
        return "séries";
      case "book":
        return "livres";
      case "game":
        return "jeux";
      default:
        return "médias";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-40 text-center">
      {getTypeIcon()}
      <p className="text-muted-foreground">
        Commencez à taper pour rechercher des <span className="font-medium">{getTypeText()}</span>
      </p>
    </div>
  );
};

export const SelectTypeState = () => (
  <div className="flex flex-col items-center justify-center h-40 text-center">
    <Search className="h-10 w-10 text-muted-foreground mb-2" />
    <p className="text-muted-foreground">
      Sélectionnez un type de média pour commencer votre recherche
    </p>
  </div>
);

export const SearchEmptyState = ({ searchQuery, selectedType }: SearchEmptyStateProps) => {
  if (selectedType && searchQuery) {
    return <NoResultsState searchQuery={searchQuery} />;
  }
  
  if (selectedType) {
    return <StartTypingState selectedType={selectedType} />;
  }
  
  return <SelectTypeState />;
};
