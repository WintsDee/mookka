
import React, { useState } from "react";
import { Background } from "@/components/ui/background";
import { MobileNav } from "@/components/mobile-nav";
import { MediaCard } from "@/components/media-card";
import { MediaRecommendations } from "@/components/media-recommendations";
import { mockMedia } from "@/data/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, FilterIcon, Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MediaType } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MobileHeader } from "@/components/mobile-header";
import { useLocation } from "react-router-dom";

const Bibliotheque = () => {
  const [filter, setFilter] = useState<MediaType | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  
  // Filtrer les médias en fonction du type sélectionné et du terme de recherche
  const filteredMedia = mockMedia
    .filter(media => filter === "all" || media.type === filter)
    .filter(media => 
      searchTerm === "" || 
      media.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (media.genres && media.genres.some(genre => 
        genre.toLowerCase().includes(searchTerm.toLowerCase())
      ))
    );
  
  // Grouper les médias par statut
  const mediaByStatus = {
    current: filteredMedia.filter(m => m.status === "watching"),
    pending: filteredMedia.filter(m => m.status === "to-watch"),
    completed: filteredMedia.filter(m => m.status === "completed")
  };

  return (
    <Background>
      <MobileHeader title="Ma Bibliothèque" />
      <div className="pb-24 pt-safe mt-16">
        <header className="px-6 mb-6">
          <div className="mt-4 relative">
            <Input
              type="text"
              placeholder="Rechercher dans ma bibliothèque..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            
            <Button variant="outline" size="icon" className="absolute right-0 top-0">
              <FilterIcon className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="mt-4">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="w-full grid grid-cols-5">
                <TabsTrigger 
                  value="all" 
                  onClick={() => setFilter("all")}
                  className="text-xs"
                >
                  Tout
                </TabsTrigger>
                <TabsTrigger 
                  value="film" 
                  onClick={() => setFilter("film")}
                  className="text-xs"
                >
                  Films
                </TabsTrigger>
                <TabsTrigger 
                  value="serie" 
                  onClick={() => setFilter("serie")}
                  className="text-xs"
                >
                  Séries
                </TabsTrigger>
                <TabsTrigger 
                  value="book" 
                  onClick={() => setFilter("book")}
                  className="text-xs"
                >
                  Livres
                </TabsTrigger>
                <TabsTrigger 
                  value="game" 
                  onClick={() => setFilter("game")}
                  className="text-xs"
                >
                  Jeux
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </header>
        
        <ScrollArea className="h-[calc(100vh-220px)] px-6">
          <div className="space-y-8 pb-24">
            {/* En cours de visionnage/lecture/jeu */}
            {mediaByStatus.current.length > 0 && (
              <MediaRecommendations 
                title="En cours" 
                medias={mediaByStatus.current}
                onSeeMore={() => console.log("Voir plus - En cours")}
                from={location.pathname}
              />
            )}
            
            {/* À voir/lire/jouer */}
            {mediaByStatus.pending.length > 0 && (
              <MediaRecommendations 
                title="À découvrir" 
                medias={mediaByStatus.pending}
                onSeeMore={() => console.log("Voir plus - À découvrir")}
                from={location.pathname}
              />
            )}
            
            {/* Terminés */}
            {mediaByStatus.completed.length > 0 && (
              <MediaRecommendations 
                title="Terminés" 
                medias={mediaByStatus.completed}
                onSeeMore={() => console.log("Voir plus - Terminés")}
                from={location.pathname}
              />
            )}
            
            {/* Si aucun résultat */}
            {filteredMedia.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground mb-4 text-center">
                  Aucun média trouvé pour cette recherche.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm("");
                    setFilter("all");
                  }}
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
      
      <MobileNav />
    </Background>
  );
};

export default Bibliotheque;
