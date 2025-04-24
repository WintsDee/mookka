
import React, { useState } from "react";
import { Background } from "@/components/ui/background";
import { MobileNav } from "@/components/mobile-nav";
import { MediaCard } from "@/components/media-card";
import { MediaType, Media } from "@/types";
import { Button } from "@/components/ui/button";
import { MobileHeader } from "@/components/mobile-header";
import { useNavigate } from "react-router-dom";
import { LibrarySearch } from "@/components/library/library-search";
import { getUserMediaLibrary } from "@/services/media/operations";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Book, Film, Tv, Gamepad } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Bibliotheque = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<MediaType | "all">("all");
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const { data: userMedia = [], isLoading } = useQuery({
    queryKey: ['userMediaLibrary'],
    queryFn: getUserMediaLibrary
  });

  const filteredMedia = userMedia
    .filter(media => 
      selectedType === "all" || media.type === selectedType
    )
    .filter(media => 
      searchTerm === "" || 
      media.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (media.genres && media.genres.some(genre => 
        genre.toLowerCase().includes(searchTerm.toLowerCase())
      ))
    );

  const mediaTypes = [
    { id: "all", label: "Tous", icon: null },
    { id: "book", label: "Livres", icon: Book },
    { id: "film", label: "Films", icon: Film },
    { id: "serie", label: "Séries", icon: Tv },
    { id: "game", label: "Jeux", icon: Gamepad }
  ];

  return (
    <Background>
      <MobileHeader title="Ma Bibliothèque" />
      <div className="pb-24 h-full overflow-y-auto">
        <header className="fixed top-16 left-0 right-0 bg-background/95 backdrop-blur-sm z-40 px-4 pt-4 pb-2">
          <div className="flex items-center gap-4 mb-4">
            <LibrarySearch
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onSearch={() => {
                if (searchTerm && filteredMedia.length === 0) {
                  navigate(`/recherche?q=${encodeURIComponent(searchTerm)}&type=${selectedType === "all" ? "" : selectedType}`);
                }
              }}
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {mediaTypes.map((type) => (
              <Button
                key={type.id}
                variant={selectedType === type.id ? "default" : "outline"}
                onClick={() => setSelectedType(type.id as MediaType | "all")}
                size="sm"
                className={cn(
                  "flex items-center gap-2 whitespace-nowrap min-w-fit",
                  isMobile && type.id !== "all" && "px-3"
                )}
              >
                {type.icon && <type.icon className="h-4 w-4" />}
                {(!isMobile || type.id === "all") && type.label}
              </Button>
            ))}
          </div>
        </header>

        <div className="mt-36 px-4">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <p>Chargement de votre bibliothèque...</p>
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground mb-4">
                Aucun média dans votre bibliothèque
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
                <div key={media.id} className="relative">
                  <Badge 
                    className="absolute top-2 right-2 z-10 bg-background/80 backdrop-blur-sm"
                    variant="outline"
                  >
                    {media.status === 'completed' ? 'Terminé' : 
                     media.status?.includes('watching') || media.status?.includes('reading') || media.status?.includes('playing') ? 'En cours' : 
                     'À faire'}
                  </Badge>
                  <MediaCard media={media} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <MobileNav />
    </Background>
  );
};

export default Bibliotheque;
