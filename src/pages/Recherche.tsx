
import React, { useState, useEffect } from "react";
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
  
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (debouncedSearchTerm && selectedType) {
        setIsLoading(true);
        console.log(`Fetching search results for "${debouncedSearchTerm}" in ${selectedType}`);
        
        try {
          const result = await searchMedia(selectedType as MediaType, debouncedSearchTerm);
          
          if (result.results && result.results.length > 0) {
            console.log(`Search returned ${result.results.length} results`);
            const formattedResults = formatSearchResults(result.results, selectedType as MediaType);
            setSearchResults(formattedResults);
          } else {
            console.log("Search returned no results");
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
    };

    fetchSearchResults();
  }, [debouncedSearchTerm, selectedType, toast]);

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
