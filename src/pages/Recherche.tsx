
import React, { useState, useEffect } from "react";
import { Background } from "@/components/ui/background";
import { MobileNav } from "@/components/mobile-nav";
import { MediaTypeSelector } from "@/components/media-type-selector";
import { MediaType } from "@/types";
import { searchMedia } from "@/services/media-service";
import { useDebounce } from "@/hooks/use-debounce";
import { useToast } from "@/components/ui/use-toast";
import { MobileHeader } from "@/components/mobile-header";
import { useLocation } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SearchBar } from "@/components/search/search-bar";
import { SearchResults } from "@/components/search/search-results";
import { getSearchPlaceholder, getSelectedTypeColor, formatSearchResult } from "@/components/search/search-utils";

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
        try {
          const result = await searchMedia(selectedType, debouncedSearchTerm);
          
          let formattedResults: any[] = [];
          
          if (result.results && result.results.length > 0) {
            formattedResults = result.results.map((item: any) => {
              return formatSearchResult(item, selectedType);
            });
          }
          
          setSearchResults(formattedResults);
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
            <SearchResults 
              results={searchResults}
              isLoading={isLoading}
              searchQuery={searchQuery}
              selectedType={selectedType}
              locationPathname={location.pathname}
            />
          </ScrollArea>
        </div>
      </div>
      
      <MobileNav />
    </Background>
  );
};

export default Recherche;
