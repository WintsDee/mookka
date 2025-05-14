
import React, { useState, useEffect } from "react";
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
  const [visibleResults, setVisibleResults] = useState<any[]>([]);

  // Animation smooth des résultats entre deux états
  useEffect(() => {
    if (results.length > 0) {
      setVisibleResults(results);
    } else if (!isLoading && searchQuery.length > 0) {
      // Ne vide les résultats que si on a effectivement une requête sans résultat
      setVisibleResults([]);
    }
    // Ne pas vider les résultats si on est en train de charger
  }, [results, isLoading, searchQuery]);

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

  // État de chargement
  if (isLoading) {
    return (
      <motion.div 
        className="animate-fade-in"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        key="loading-state"
      >
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-6 w-6 text-primary animate-spin opacity-70" />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 mb-24">
          {[...Array(8)].map((_, index) => (
            <div key={`skeleton-${index}`} className="space-y-2">
              <Skeleton className="h-[180px] w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  // Résultats trouvés
  if (visibleResults.length > 0) {
    return (
      <motion.div 
        className="animate-fade-in"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        key="results-state"
      >
        {renderSuggestButton()}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 mb-24">
          <AnimatePresence mode="wait">
            {visibleResults.map((media) => (
              <motion.div
                key={`media-${media.id || `${media.title}-${Math.random().toString(36).substring(7)}`}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                layout
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

  // Si on a une requête mais pas de résultats (état vide)
  if (searchQuery.length > 0 && !isLoading) {
    return (
      <motion.div 
        className="animate-fade-in"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        key="empty-state"
      >
        <SearchEmptyState searchQuery={searchQuery} selectedType={selectedType} />
        {searchQuery.length > 2 && renderSuggestButton()}
      </motion.div>
    );
  }

  // État initial (pas de requête)
  return (
    <motion.div 
      className="animate-fade-in"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      key="initial-state"
    >
      {selectedType && (
        <div className="text-center py-8 text-muted-foreground">
          <p>Recherchez un {
            selectedType === "film" ? "film" : 
            selectedType === "serie" ? "série" : 
            selectedType === "book" ? "livre" : "jeu"
          } en tapant dans la barre ci-dessus</p>
        </div>
      )}
    </motion.div>
  );
};
