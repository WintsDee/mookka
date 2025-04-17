
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Background } from "@/components/ui/background";
import { MobileNav } from "@/components/mobile-nav";
import { MediaTypeSelector } from "@/components/media-type-selector";
import { MediaType } from "@/types";
import { searchMedia } from "@/services/media";
import { useDebounce } from "@/hooks/use-debounce";
import { useToast } from "@/components/ui/use-toast";
import { MobileHeader } from "@/components/mobile-header";
import { useLocation } from "react-router-dom";
import { SearchBar } from "@/components/search/search-bar";
import { SearchResults } from "@/components/search/search-results";
import { 
  getSearchPlaceholder, 
  getSelectedTypeColor, 
  formatSearchResults 
} from "@/components/search/search-utils";
import { ScrollArea } from "@/components/ui/scroll-area";

const Recherche = () => {
  const [selectedType, setSelectedType] = useState<MediaType | "">("film");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearchTerm = useDebounce(searchQuery, 500);
  const { toast } = useToast();
  const location = useLocation();
  
  // Mémoïser les props statiques pour éviter les re-rendus
  const selectedTypeColor = useMemo(() => getSelectedTypeColor(selectedType), [selectedType]);
  const searchPlaceholder = useMemo(() => getSearchPlaceholder(selectedType), [selectedType]);
  
  // Fonction fetch mémoïsée pour éviter les recréations à chaque rendu
  const fetchSearchResults = useCallback(async (term: string, type: MediaType | "") => {
    if (term && type) {
      setIsLoading(true);
      try {
        const result = await searchMedia(type as MediaType, term);
        
        if (result.results && result.results.length > 0) {
          const formattedResults = formatSearchResults(result.results, type as MediaType);
          setSearchResults(formattedResults);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Erreur de recherche:", error);
        toast({
          title: "Erreur de recherche",
          description: "Impossible de récupérer les résultats",
          variant: "destructive",
        });
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setSearchResults([]);
    }
  }, [toast]);
  
  // Effet pour déclencher la recherche
  useEffect(() => {
    if (debouncedSearchTerm || !searchQuery) {
      fetchSearchResults(debouncedSearchTerm, selectedType);
    }
  }, [debouncedSearchTerm, selectedType, fetchSearchResults, searchQuery]);
  
  // Gestionnaire de changement de type mémoïsé
  const handleTypeChange = useCallback((type: MediaType | string) => {
    setSelectedType(type as MediaType);
    // Si une recherche est déjà en cours, effectuer immédiatement la recherche avec le nouveau type
    if (searchQuery.trim().length > 0) {
      fetchSearchResults(searchQuery, type as MediaType);
    }
  }, [searchQuery, fetchSearchResults]);

  // Create a key for animation transitions
  const contentKey = `${selectedType}-${debouncedSearchTerm}`;

  return (
    <Background>
      <MobileHeader title="Recherche" />
      <div className="flex flex-col h-[calc(100vh-64px)] pb-16 pt-safe mt-16">
        <header className="px-6 mb-4">
          <MediaTypeSelector 
            selectedType={selectedType}
            onSelectType={handleTypeChange}
            className="mt-6"
          />
          
          <SearchBar 
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            isLoading={isLoading}
            isDisabled={!selectedType}
            selectedTypeColor={selectedTypeColor}
          />
        </header>
        
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full px-6">
            <div 
              key={contentKey}
              className="animate-fade-in pb-24"
            >
              <SearchResults 
                results={searchResults}
                isLoading={isLoading}
                searchQuery={searchQuery}
                selectedType={selectedType}
                from={location.pathname}
              />
            </div>
          </ScrollArea>
        </div>
      </div>
      
      <MobileNav />
    </Background>
  );
};

export default Recherche;
