
import React, { useState } from "react";
import { Background } from "@/components/ui/background";
import { MobileNav } from "@/components/mobile-nav";
import { MediaCard } from "@/components/media-card";
import { MediaType, Media, MediaStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { MobileHeader } from "@/components/mobile-header";
import { useNavigate } from "react-router-dom";
import { LibrarySearch } from "@/components/library/library-search";
import { getUserMediaLibrary } from "@/services/media";
import { useQuery } from "@tanstack/react-query";
import { PlusCircle, Book, Film, Tv, Gamepad } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const Bibliotheque = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<MediaType | "all">("all");
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const { data: userMedia = [], isLoading } = useQuery({
    queryKey: ['userMediaLibrary'],
    queryFn: getUserMediaLibrary
  });

  // Filtrer les médias par type et recherche
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

  // Grouper les médias par statut
  const groupedMedia = {
    inProgress: filteredMedia.filter(media => 
      media.status === "watching" || 
      media.status === "reading" || 
      media.status === "playing"
    ),
    todo: filteredMedia.filter(media => 
      media.status === "to-watch" || 
      media.status === "to-read" || 
      media.status === "to-play"
    ),
    completed: filteredMedia.filter(media => media.status === "completed")
  };

  const mediaTypes = [
    { id: "all", label: "Tous", icon: null },
    { id: "book", label: "Livres", icon: Book },
    { id: "film", label: "Films", icon: Film },
    { id: "serie", label: "Séries", icon: Tv },
    { id: "game", label: "Jeux", icon: Gamepad }
  ];

  const StatusSection = ({ title, medias }: { title: string, medias: Media[] }) => {
    if (medias.length === 0) return null;
    
    return (
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {medias.map((media) => (
            <MediaCard 
              key={media.id} 
              media={media} 
              from="/bibliotheque"
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <Background>
      <MobileHeader title="Ma Bibliothèque" />
      <div className="flex flex-col h-screen pb-24">
        {/* Header fixe avec filtres */}
        <header className="fixed top-16 left-0 right-0 bg-background/95 backdrop-blur-sm z-40 px-4 pt-4 pb-4 shadow-sm">
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
          
          {/* Filtres de type de média adaptés pour mobile */}
          <div className="flex justify-between gap-2 w-full overflow-x-auto pb-2 scrollbar-hide">
            {mediaTypes.map((type) => (
              <Button
                key={type.id}
                variant={selectedType === type.id ? "default" : "outline"}
                onClick={() => setSelectedType(type.id as MediaType | "all")}
                size="sm"
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 min-w-0 rounded-full",
                  isMobile && type.id !== "all" && "px-3",
                  selectedType === type.id ? "shadow-md" : ""
                )}
              >
                {type.icon && <type.icon className="h-4 w-4 flex-shrink-0" />}
                {(!isMobile || type.id === "all") && (
                  <span className="truncate">{type.label}</span>
                )}
              </Button>
            ))}
          </div>
        </header>

        {/* Contenu de la bibliothèque avec espace suffisant pour éviter le chevauchement */}
        <div className="mt-48 px-4 flex-1 overflow-y-auto pb-16">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <p>Chargement de votre bibliothèque...</p>
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground mb-4">
                Aucun média dans votre bibliothèque
                {selectedType !== "all" && ` de type ${selectedType}`}
                {searchTerm && ` correspondant à "${searchTerm}"`}
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
            <>
              {/* Affichage par sections de statut */}
              <StatusSection 
                title="En cours" 
                medias={groupedMedia.inProgress} 
              />
              <StatusSection 
                title="À faire" 
                medias={groupedMedia.todo} 
              />
              <StatusSection 
                title="Terminé" 
                medias={groupedMedia.completed} 
              />
            </>
          )}
        </div>
      </div>
      <MobileNav />
    </Background>
  );
};

export default Bibliotheque;
