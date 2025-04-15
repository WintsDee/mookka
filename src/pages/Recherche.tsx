import React, { useState, useEffect } from "react";
import { Background } from "@/components/ui/background";
import { MobileNav } from "@/components/mobile-nav";
import { Input } from "@/components/ui/input";
import { MediaTypeSelector } from "@/components/media-type-selector";
import { MediaCard } from "@/components/media-card";
import { Search, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MediaType } from "@/types";
import { searchMedia } from "@/services/media-service";
import { useDebounce } from "@/hooks/use-debounce";
import { useToast } from "@/components/ui/use-toast";
import { MobileHeader } from "@/components/mobile-header";

const Recherche = () => {
  const [selectedType, setSelectedType] = useState<MediaType | "">("film");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearchTerm = useDebounce(searchQuery, 500);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchData = async () => {
      if (debouncedSearchTerm && selectedType) {
        setIsLoading(true);
        try {
          const result = await searchMedia(selectedType, debouncedSearchTerm);
          
          let formattedResults: any[] = [];
          
          if (result.results && result.results.length > 0) {
            formattedResults = result.results.map((item: any) => {
              // Si l'élément vient de la base de données, il est déjà formaté correctement
              if (item.fromDatabase) {
                return {
                  id: item.id,
                  title: item.title,
                  type: item.type,
                  coverImage: item.coverImage || '/placeholder.svg',
                  year: item.year,
                  rating: item.rating,
                  author: item.author,
                  fromDatabase: true
                };
              }
              
              // Sinon, formater selon le type
              switch (selectedType) {
                case 'film':
                  return {
                    id: item.id,
                    title: item.title,
                    type: selectedType,
                    coverImage: item.coverImage || '/placeholder.svg',
                    year: item.year,
                    rating: item.rating
                  };
                case 'serie':
                  return {
                    id: item.id,
                    title: item.title,
                    type: selectedType,
                    coverImage: item.coverImage || '/placeholder.svg',
                    year: item.year,
                    rating: item.rating
                  };
                case 'book':
                  return {
                    id: item.id,
                    title: item.title,
                    type: selectedType,
                    coverImage: item.coverImage || '/placeholder.svg',
                    year: item.year,
                    author: item.author
                  };
                case 'game':
                  return {
                    id: item.id,
                    title: item.title,
                    type: selectedType,
                    coverImage: item.coverImage || '/placeholder.svg',
                    year: item.year,
                    rating: item.rating
                  };
                default:
                  return item;
              }
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

    fetchData();
  }, [debouncedSearchTerm, selectedType, toast]);
  
  const getPlaceholder = () => {
    switch(selectedType) {
      case "film": return "Rechercher un film...";
      case "serie": return "Rechercher une série...";
      case "book": return "Rechercher un livre...";
      case "game": return "Rechercher un jeu...";
      default: return "Sélectionnez d'abord un type de média";
    }
  };

  const getSelectedTypeColor = () => {
    if (!selectedType) return "bg-secondary/60";
    return `bg-media-${selectedType}/10 border-media-${selectedType}/30`;
  };

  return (
    <Background>
      <MobileHeader title="Recherche" />
      <div className="pb-24 pt-safe mt-16">
        <header className="px-6 mb-4">
          <MediaTypeSelector 
            selectedType={selectedType}
            onSelectType={(type) => setSelectedType(type as MediaType)}
            className="mt-6"
          />
          
          <div className="relative mt-6">
            <Input
              placeholder={getPlaceholder()}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className={`pl-10 py-6 border-none shadow-sm ${getSelectedTypeColor()}`}
              disabled={!selectedType}
            />
            {isLoading ? (
              <Loader2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground animate-spin" size={18} />
            ) : (
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            )}
          </div>
        </header>
        
        <ScrollArea className="h-[calc(100vh-260px)] mt-6">
          {selectedType && searchResults.length > 0 ? (
            <div className="px-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {searchResults.map((media) => (
                <MediaCard key={media.id} media={media} size="medium" />
              ))}
            </div>
          ) : isLoading ? (
            <div className="flex flex-col items-center justify-center h-40">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <p className="text-muted-foreground mt-2">Recherche en cours...</p>
            </div>
          ) : selectedType && searchQuery ? (
            <div className="flex flex-col items-center justify-center h-40 text-center px-6">
              <p className="text-muted-foreground">
                Aucun résultat trouvé pour "{searchQuery}"
              </p>
            </div>
          ) : selectedType ? (
            <div className="flex flex-col items-center justify-center h-40 text-center px-6">
              <p className="text-muted-foreground">
                Commencez à taper pour rechercher des {selectedType === "film" ? "films" : 
                selectedType === "serie" ? "séries" : 
                selectedType === "book" ? "livres" : "jeux"}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-center px-6">
              <p className="text-muted-foreground">
                Sélectionnez un type de média pour commencer votre recherche
              </p>
            </div>
          )}
        </ScrollArea>
      </div>
      
      <MobileNav />
    </Background>
  );
};

export default Recherche;
