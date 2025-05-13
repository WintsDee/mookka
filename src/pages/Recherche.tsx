
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
  
  // Use a callback to prevent recreation of the search function on every render
  const fetchSearchResults = useCallback(async (query: string, type: MediaType) => {
    // Cancel any previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();
    
    setIsLoading(true);
    console.log(`Fetching search results for "${query}" in ${type}`);
    
    try {
      const result = await searchMedia(type as MediaType, query);
      
      if (result.results && result.results.length > 0) {
        console.log(`Search returned ${result.results.length} results`);
        const formattedResults = formatSearchResults(result.results, type as MediaType);
        setSearchResults(formattedResults);
      } else {
        console.log("Search returned no results");
        setSearchResults([]);
      }
    } catch (error) {
      // Ignore aborted requests
      if (error.name === 'AbortError') {
        console.log('Search request was cancelled');
        return;
      }
      
      console.error("Erreur de recherche:", error);
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
    // Only run search when there's an actual query and type selected
    if (!debouncedSearchTerm || !selectedType) {
      // Don't clear results immediately when query is empty
      if (!debouncedSearchTerm && searchResults.length > 0) {
        // Optionally clear results after a short delay to prevent flickering
        const timer = setTimeout(() => {
          setSearchResults([]);
        }, 200);
        return () => clearTimeout(timer);
      }
      
      setIsLoading(false);
      return;
    }

    fetchSearchResults(debouncedSearchTerm, selectedType as MediaType);
    
    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [debouncedSearchTerm, selectedType, fetchSearchResults, searchResults.length]);

  return (
    <Background>
      <MobileHeader title="Recherche" />
      <div className="flex flex-col h-[calc(100vh-64px)] pb-16 pt-safe mt-16">
        <header className="px-6 mb-4">
          <MediaTypeSelector 
            selectedType={selectedType}
            onSelectType={(type) => setSelectedType(type as MediaType)}
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
