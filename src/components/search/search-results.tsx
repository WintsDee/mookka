
import React from "react";
import { MediaCard } from "@/components/media-card";
import { Loader2 } from "lucide-react";
import { MediaType } from "@/types";
import { SearchEmptyState } from "@/components/search/search-empty-states";

interface SearchResultsProps {
  results: any[];
  isLoading: boolean;
  searchQuery: string;
  selectedType: MediaType | "";
  from: string;
}

export const SearchResults = ({
  results,
  isLoading,
  searchQuery,
  selectedType,
  from,
}: SearchResultsProps) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-40">
        <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
        <p className="text-muted-foreground">Recherche en cours...</p>
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
            from={from}
          />
        ))}
      </div>
    );
  }

  return <SearchEmptyState searchQuery={searchQuery} selectedType={selectedType} />;
};
