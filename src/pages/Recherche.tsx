
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Background } from "@/components/ui/background";
import { MobileNav } from "@/components/mobile-nav";
import { MediaTypeSelector } from "@/components/media-type-selector";
import { MediaType } from "@/types";
import { searchMedia } from "@/services/media";
import { useDebounce } from "@/hooks/use-debounce";
import { useToast } from "@/hooks/use-toast";
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
  const abortControllerRef = useRef<AbortController | null>(null);
  const previousSearchTerm = useRef<string>("");
  const resultsCache = useRef<Record<string, any[]>>({});
  
  // Use a callback to prevent recreation of the search function on every render
  const fetchSearchResults = useCallback(async (query: string, type: MediaType) => {
    // Ne pas rechercher si la requête est vide
    if (!query.trim()) return;
    
    // Créer une clé de cache unique pour cette combinaison requête/type
    const cacheKey = `${type}:${query}`;
    
    // Si nous avons déjà des résultats pour cette requête exacte, les utiliser
    if (resultsCache.current[cacheKey]) {
      console.log(`Using cached results for "${query}" in ${type}`);
      setSearchResults(resultsCache.current[cacheKey]);
      setIsLoading(false);
      return;
    }
    
    // Cancel any previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();
    
    setIsLoading(true);
    console.log(`Fetching search results for "${query}" in ${type}`);
    
    try {
      // Pass the abort signal to the search function
      const result = await searchMedia(type as MediaType, query, abortControllerRef.current.signal);
      
      // Ne pas réinitialiser les résultats pendant la recherche
      if (result.results && Array.isArray(result.results)) {
        console.log(`Search returned ${result.results.length} results`);
        const formattedResults = formatSearchResults(result.results, type as MediaType);
        
        // Stocker dans le cache et mettre à jour l'affichage
        resultsCache.current[cacheKey] = formattedResults;
        setSearchResults(formattedResults);
      } else {
        console.log("Search returned no results");
        
        // Même pour les recherches sans résultat, on enregistre un tableau vide
        resultsCache.current[cacheKey] = [];
        setSearchResults([]);
      }
    } catch (error: any) {
      // Ignore aborted requests
      if (error.name === 'AbortError') {
        console.log('Search request was cancelled');
        return;
      }
      
      console.error("Search error:", error);
      toast({
        title: "Erreur de recherche",
        description: "Impossible de récupérer les résultats",
        variant: "destructive",
      });
      // Don't clear existing results on error - maintain state
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Separate effect for handling search term changes
  useEffect(() => {
    // Si le terme est vide, on efface les résultats après un court délai pour éviter les clignotements
    if (!debouncedSearchTerm) {
      if (searchResults.length > 0) {
        // Seulement effacer si on passe d'une requête à vide
        const timer = setTimeout(() => {
          setSearchResults([]);
          // On vide aussi le terme précédent pour marquer un nouveau cycle de recherche
          previousSearchTerm.current = "";
        }, 300);
        return () => clearTimeout(timer);
      }
      return;
    }

    // Vérifie si une requête est valide avant de la traiter
    if (!selectedType || debouncedSearchTerm === previousSearchTerm.current) {
      return;
    }

    // Mise à jour du terme précédent
    previousSearchTerm.current = debouncedSearchTerm;
    
    // Lancer la recherche avec le terme débounced
    fetchSearchResults(debouncedSearchTerm, selectedType as MediaType);
    
    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [debouncedSearchTerm, selectedType, fetchSearchResults]);

  // Gère le changement de type de média
  const handleTypeChange = useCallback((type: MediaType | "") => {
    setSelectedType(type as MediaType);
    // Si on a déjà une requête, relancer la recherche immédiatement avec le nouveau type
    if (searchQuery) {
      // On réinitialise les résultats uniquement si on change de type pour éviter le clignotement
      setIsLoading(true);
    }
  }, [searchQuery]);

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
            placeholder={getSearchPlaceholder(selectedType)}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            isLoading={isLoading}
            isDisabled={!selectedType}
            selectedTypeColor={getSelectedTypeColor(selectedType)}
          />
        </header>
        
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full px-6">
            <div className="pb-24">
              <SearchResults 
                key={`search-results-${selectedType}`}
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
