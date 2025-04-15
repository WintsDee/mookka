
import React from "react";
import { MediaCard } from "@/components/media-card";
import { Loader2 } from "lucide-react";
import { MediaType } from "@/types";

interface SearchResultsProps {
  results: any[];
  isLoading: boolean;
  searchQuery: string;
  selectedType: MediaType | "";
  locationPathname: string;
}

export const SearchResults = ({
  results,
  isLoading,
  searchQuery,
  selectedType,
  locationPathname,
}: SearchResultsProps) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-40">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <p className="text-muted-foreground mt-2">Recherche en cours...</p>
      </div>
    );
  }

  if (results.length > 0) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 mb-24">
        {results.map((media) => (
          <MediaCard 
            key={media.id} 
            media={media} 
            size="medium" 
            from={locationPathname}
          />
        ))}
      </div>
    );
  }

  if (selectedType && searchQuery) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-center">
        <p className="text-muted-foreground">
          Aucun résultat trouvé pour "{searchQuery}"
        </p>
      </div>
    );
  }

  if (selectedType) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-center">
        <p className="text-muted-foreground">
          Commencez à taper pour rechercher des {selectedType === "film" ? "films" : 
          selectedType === "serie" ? "séries" : 
          selectedType === "book" ? "livres" : "jeux"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-40 text-center">
      <p className="text-muted-foreground">
        Sélectionnez un type de média pour commencer votre recherche
      </p>
    </div>
  );
};
