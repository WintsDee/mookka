import React, { useState, useEffect } from "react";
import { Background } from "@/components/ui/background";
import { MobileNav } from "@/components/mobile-nav";
import { MediaCard } from "@/components/media-card";
import { MediaRecommendations } from "@/components/media-recommendations";
import { mockMedia } from "@/data/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MediaType, Media, MediaStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { MobileHeader } from "@/components/mobile-header";
import { useLocation, useNavigate } from "react-router-dom";
import { LibrarySearch } from "@/components/library/library-search";
import { LibraryFilters } from "@/components/library/library-filters";
import { getUserMediaLibrary } from "@/services/media/operations";
import { useQuery } from "@tanstack/react-query";

interface UserMedia extends Omit<Media, 'status'> {
  added_at?: string;
  user_rating?: number;
  status?: MediaStatus | string;
}

const Bibliotheque = () => {
  const [filter, setFilter] = useState<MediaType | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "title" | "rating">("date");
  const [showCompleted, setShowCompleted] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  
  const { data: userMedia = [], isLoading, error } = useQuery({
    queryKey: ['userMediaLibrary'],
    queryFn: getUserMediaLibrary
  });

  const filteredMedia = userMedia
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
      const mediaA = a as UserMedia;
      const mediaB = b as UserMedia;
      
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "rating":
          return ((mediaB.user_rating || 0) - (mediaA.user_rating || 0));
        case "date":
        default:
          if (mediaA.added_at && mediaB.added_at) {
            return new Date(mediaB.added_at).getTime() - new Date(mediaA.added_at).getTime();
          } else {
            return (b.year || 0) - (a.year || 0);
          }
      }
    });

  const handleEmptyResults = () => {
    if (searchTerm && filteredMedia.length === 0) {
      navigate(`/recherche?q=${encodeURIComponent(searchTerm)}&type=${filter === "all" ? "" : filter}`);
    }
  };

  return (
    <Background>
      <MobileHeader title="Ma Bibliothèque" />
      <div className="pb-24">
        <header className="fixed top-16 left-0 right-0 bg-background/95 backdrop-blur-sm z-40 px-6 pt-4 pb-2">
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
        
        <ScrollArea className="h-[calc(100vh-220px)] px-6 mt-32">
          <div className="space-y-8 py-6">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <p>Chargement de votre bibliothèque...</p>
              </div>
            ) : filteredMedia.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground mb-4">
                  Votre bibliothèque est vide. Commencez à ajouter des médias !
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/recherche')}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Ajouter un média
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {filteredMedia.map((media) => (
                  <MediaCard
                    key={media.id}
                    media={media}
                  />
                ))}
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
