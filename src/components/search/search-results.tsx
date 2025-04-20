
import React, { useState } from "react";
import { MediaCard } from "@/components/media-card";
import { Loader2, PlusCircle } from "lucide-react";
import { MediaType } from "@/types";
import { SearchEmptyState } from "@/components/search/search-empty-states";
import { Button } from "@/components/ui/button";
import { SuggestMediaDialog } from "@/components/search/suggest-media-dialog";
import { useLocation } from "react-router-dom";

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
  const [suggestDialogOpen, setSuggestDialogOpen] = useState(false);
  const location = useLocation();
  const searchParams = location.search;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-40">
        <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
        <p className="text-muted-foreground">Recherche en cours...</p>
      </div>
    );
  }

  const renderSuggestButton = () => {
    if (!selectedType) return null;
    
    return (
      <div className="w-full flex justify-center my-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setSuggestDialogOpen(true)}
          className={`border-media-${selectedType}/30 text-media-${selectedType} hover:bg-media-${selectedType}/10`}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Suggérer un {selectedType === "film" ? "film" : 
                        selectedType === "serie" ? "série" : 
                        selectedType === "book" ? "livre" : "jeu"}
        </Button>
        <SuggestMediaDialog 
          open={suggestDialogOpen} 
          onOpenChange={setSuggestDialogOpen} 
          mediaType={selectedType} 
        />
      </div>
    );
  };

  if (results.length > 0) {
    return (
      <>
        {renderSuggestButton()}
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
      </>
    );
  }

  return (
    <>
      <SearchEmptyState searchQuery={searchQuery} selectedType={selectedType} />
      {searchQuery.length > 2 && renderSuggestButton()}
    </>
  );
}
