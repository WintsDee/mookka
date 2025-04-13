
import React, { useState } from "react";
import { Background } from "@/components/ui/background";
import { MobileNav } from "@/components/mobile-nav";
import { Input } from "@/components/ui/input";
import { MediaTypeSelector } from "@/components/media-type-selector";
import { MediaCard } from "@/components/media-card";
import { mockMedia } from "@/data/mockData";
import { Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MediaType } from "@/types";

const Recherche = () => {
  const [selectedType, setSelectedType] = useState<MediaType | "">("film");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  // Filtrer les médias en fonction du type et de la recherche
  const filteredMedia = mockMedia.filter(media => {
    const matchesType = selectedType ? media.type === selectedType : true;
    const matchesSearch = searchQuery 
      ? media.title.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesType && matchesSearch;
  });
  
  // Déterminer le placeholder en fonction du type sélectionné
  const getPlaceholder = () => {
    switch(selectedType) {
      case "film": return "Rechercher un film...";
      case "serie": return "Rechercher une série...";
      case "book": return "Rechercher un livre...";
      case "game": return "Rechercher un jeu...";
      default: return "Sélectionnez d'abord un type de média";
    }
  };

  return (
    <Background>
      <div className="pb-24 pt-6">
        <header className="px-6 mb-4">
          <h1 className="text-2xl font-bold mb-6">Recherche</h1>
          
          <div className="relative">
            <Input
              placeholder={getPlaceholder()}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="pl-10 py-6 bg-secondary/60 border-none shadow-sm"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          </div>
        </header>
        
        <MediaTypeSelector 
          selectedType={selectedType}
          onSelectType={(type) => setSelectedType(type as MediaType)}
        />
        
        <ScrollArea className="h-[calc(100vh-260px)] mt-6">
          {selectedType && filteredMedia.length > 0 ? (
            <div className="px-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {filteredMedia.map((media) => (
                <MediaCard key={media.id} media={media} size="medium" />
              ))}
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
