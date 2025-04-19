
import React, { useState } from "react";
import { Background } from "@/components/ui/background";
import { MobileNav } from "@/components/mobile-nav";
import { MediaCard } from "@/components/media-card";
import { MediaRecommendations } from "@/components/media-recommendations";
import { mockMedia } from "@/data/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MediaType } from "@/types";
import { Button } from "@/components/ui/button";
import { MobileHeader } from "@/components/mobile-header";
import { useLocation, useNavigate } from "react-router-dom";
import { LibrarySearch } from "@/components/library/library-search";
import { LibraryFilters } from "@/components/library/library-filters";

const Bibliotheque = () => {
  const [filter, setFilter] = useState<MediaType | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "title" | "rating">("date");
  const [showCompleted, setShowCompleted] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Filtrer les médias en fonction du type sélectionné, du terme de recherche et des filtres
  const filteredMedia = mockMedia
    .filter(media => filter === "all" || media.type === filter)
    .filter(media => showCompleted || media.status !== "completed")
    .filter(media => 
      searchTerm === "" || 
      media.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (media.genres && media.genres.some(genre => 
        genre.toLowerCase().includes(searchTerm.toLowerCase())
      ))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "date":
        default:
          return new Date(b.added_at || 0).getTime() - new Date(a.added_at || 0).getTime();
      }
    });

  // Gérer la redirection vers la recherche globale si aucun résultat n'est trouvé
  const handleEmptyResults = () => {
    if (searchTerm && filteredMedia.length === 0) {
      navigate(`/recherche?q=${encodeURIComponent(searchTerm)}&type=${filter === "all" ? "" : filter}`);
    }
  };

  return (
    <Background>
      <MobileHeader title="Ma Bibliothèque" />
      <div className="pb-24 pt-safe mt-20">
        <header className="px-6">
          <div className="flex items-center gap-4">
            <LibrarySearch
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (e.target.value === "") {
                  handleEmptyResults();
                }
              }}
              onSearch={handleEmptyResults}
            />
            <LibraryFilters
              sortBy={sortBy}
              onSortChange={setSortBy}
              showCompleted={showCompleted}
              onShowCompletedChange={setShowCompleted}
            />
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
            {filteredMedia.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground mb-4">
                  Votre bibliothèque est vide. Commencez à ajouter des médias !
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/recherche')} // Navigate to recherche page
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Ajouter un média
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
