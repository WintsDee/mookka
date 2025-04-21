
import React, { useState, useEffect } from "react";
import { Background } from "@/components/ui/background";
import { MobileNav } from "@/components/mobile-nav";
import { MediaCard } from "@/components/media-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Eye, Clock, Check } from "lucide-react";
import { MediaType, Media, MediaStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { MobileHeader } from "@/components/mobile-header";
import { useNavigate } from "react-router-dom";
import { LibrarySearch } from "@/components/library/library-search";
import { LibraryFilters } from "@/components/library/library-filters";
import { getUserMediaLibrary } from "@/services/media/operations";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";

const Bibliotheque = () => {
  const [filter, setFilter] = useState<MediaType | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "title" | "rating">("date");
  const navigate = useNavigate();
  
  const { data: userMedia = [], isLoading } = useQuery({
    queryKey: ['userMediaLibrary'],
    queryFn: getUserMediaLibrary
  });

  const getStatusLabel = (status: MediaStatus, mediaType: MediaType) => {
    if (status === 'to-watch' || status === 'to-read' || status === 'to-play') {
      switch (mediaType) {
        case 'film':
        case 'serie':
          return 'À voir';
        case 'book':
          return 'À lire';
        case 'game':
          return 'À jouer';
        default:
          return 'À faire';
      }
    }
    return status === 'watching' || status === 'reading' || status === 'playing' 
      ? 'En cours' 
      : 'Terminé';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'to-watch':
      case 'to-read':
      case 'to-play':
        return <Eye className="h-4 w-4" />;
      case 'watching':
      case 'reading':
      case 'playing':
        return <Clock className="h-4 w-4" />;
      case 'completed':
        return <Check className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const filteredMedia = userMedia
    .filter(media => filter === "all" || media.type === filter)
    .filter(media => 
      searchTerm === "" || 
      media.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (media.genres && media.genres.some(genre => 
        genre.toLowerCase().includes(searchTerm.toLowerCase())
      ))
    )
    .sort((a, b) => {
      const mediaA = a as Media & { added_at?: string; user_rating?: number };
      const mediaB = b as Media & { added_at?: string; user_rating?: number };
      
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "rating":
          return ((mediaB.user_rating || 0) - (mediaA.user_rating || 0));
        case "date":
        default:
          if (mediaA.added_at && mediaB.added_at) {
            return new Date(mediaB.added_at).getTime() - new Date(mediaA.added_at).getTime();
          }
          return (b.year || 0) - (a.year || 0);
      }
    });

  const renderMediaGrid = (status: string) => {
    const statusMedia = filteredMedia.filter(media => {
      if (status === 'to-do') {
        return ['to-watch', 'to-read', 'to-play'].includes(media.status || '');
      }
      if (status === 'in-progress') {
        return ['watching', 'reading', 'playing'].includes(media.status || '');
      }
      return media.status === 'completed';
    });

    if (statusMedia.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground mb-4">
            Aucun média dans cette catégorie
          </p>
          <Button 
            variant="outline" 
            onClick={() => navigate('/recherche')}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Ajouter un média
          </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {statusMedia.map((media) => (
          <div key={media.id} className="relative">
            <Badge 
              className="absolute top-2 right-2 z-10 bg-background/80 backdrop-blur-sm"
              variant="outline"
            >
              {getStatusLabel(media.status as MediaStatus, media.type)}
            </Badge>
            <MediaCard media={media} />
          </div>
        ))}
      </div>
    );
  };

  return (
    <Background>
      <MobileHeader title="Ma Bibliothèque" />
      <div className="pb-24 h-full overflow-hidden">
        <header className="fixed top-16 left-0 right-0 bg-background/95 backdrop-blur-sm z-40 px-6 pt-4 pb-2">
          <div className="flex items-center gap-4">
            <LibrarySearch
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onSearch={() => {
                if (searchTerm && filteredMedia.length === 0) {
                  navigate(`/recherche?q=${encodeURIComponent(searchTerm)}&type=${filter === "all" ? "" : filter}`);
                }
              }}
            />
            <LibraryFilters
              sortBy={sortBy}
              onSortChange={setSortBy}
              filter={filter}
              onFilterChange={setFilter}
            />
          </div>
          
          <div className="mt-4">
            <Tabs defaultValue="to-do" className="w-full">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger 
                  value="to-do" 
                  className="flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  <span className="hidden sm:inline">À faire</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="in-progress"
                  className="flex items-center gap-2"
                >
                  <Clock className="h-4 w-4" />
                  <span className="hidden sm:inline">En cours</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="completed"
                  className="flex items-center gap-2"
                >
                  <Check className="h-4 w-4" />
                  <span className="hidden sm:inline">Terminé</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="to-do" className="mt-6">
                {renderMediaGrid('to-do')}
              </TabsContent>
              
              <TabsContent value="in-progress" className="mt-6">
                {renderMediaGrid('in-progress')}
              </TabsContent>
              
              <TabsContent value="completed" className="mt-6">
                {renderMediaGrid('completed')}
              </TabsContent>
            </Tabs>
          </div>
        </header>
        
        <div className="mt-52 px-6 pb-16">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <p>Chargement de votre bibliothèque...</p>
            </div>
          ) : null}
        </div>
      </div>
      
      <MobileNav />
    </Background>
  );
};

export default Bibliotheque;
