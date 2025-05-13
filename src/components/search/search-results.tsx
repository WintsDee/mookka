
import React, { useState } from "react";
import { MediaCard } from "@/components/media-card";
import { Loader2, PlusCircle } from "lucide-react";
import { MediaType } from "@/types";
import { SearchEmptyState } from "@/components/search/search-empty-states";
import { Button } from "@/components/ui/button";
import { SuggestMediaDialog } from "@/components/search/suggest-media-dialog";
import { useLocation } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatePresence, motion } from "framer-motion";

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

  if (isLoading) {
    return (
      <motion.div 
        className="animate-fade-in"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-6 w-6 text-primary animate-spin opacity-70" />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 mb-24">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-[180px] w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  if (results.length > 0) {
    return (
      <motion.div 
        className="animate-fade-in"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {renderSuggestButton()}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 mb-24">
          <AnimatePresence>
            {results.map((media) => (
              <motion.div
                key={media.id || `${media.title}-${Math.random().toString(36).substring(7)}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <MediaCard 
                  media={media} 
                  size="medium" 
                  from={location.pathname + searchParams}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="animate-fade-in"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <SearchEmptyState searchQuery={searchQuery} selectedType={selectedType} />
      {searchQuery.length > 2 && renderSuggestButton()}
    </motion.div>
  );
};
