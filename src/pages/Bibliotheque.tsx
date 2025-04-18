
import React, { useState } from "react";
import { Background } from "@/components/ui/background";
import { MobileNav } from "@/components/mobile-nav";
import { MediaCard } from "@/components/media-card";
import { mockMedia } from "@/data/mockData";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MediaType, MediaStatus } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MobileHeader } from "@/components/mobile-header";
import { useLocation, useNavigate } from "react-router-dom";
import { PlusCircle, Search, ArrowRight } from "lucide-react";
import { LibraryFilters } from "@/components/library/library-filters";
import { LibrarySort, SortOption } from "@/components/library/library-sort";

const Bibliotheque = () => {
  const [selectedTypes, setSelectedTypes] = useState<MediaType[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<MediaStatus[]>([]);
  const [yearRange, setYearRange] = useState<[number, number]>([1900, new Date().getFullYear()]);
  const [sortBy, setSortBy] = useState<SortOption>("added");
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  // Filtrer les médias
  const filteredMedia = mockMedia
    .filter(media => 
      (selectedTypes.length === 0 || selectedTypes.includes(media.type)) &&
      (selectedStatuses.length === 0 || (media.status && selectedStatuses.includes(media.status))) &&
      (!media.year || (media.year >= yearRange[0] && media.year <= yearRange[1])) &&
      (searchTerm === "" || 
        media.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (media.genres && media.genres.some(genre => 
          genre.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      )
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "year":
          return (b.year || 0) - (a.year || 0);
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "added":
        default:
          return 0; // Par défaut, garde l'ordre existant
      }
    });

  const handleSearchInGlobalSearch = () => {
    if (searchTerm) {
      navigate(`/recherche?q=${encodeURIComponent(searchTerm)}&type=${selectedTypes[0] || ''}`);
    }
  };

  return (
    <Background>
      <MobileHeader title="Ma Bibliothèque" />
      <div className="pb-24 pt-safe">
        <header className="px-6 mb-6 mt-20 space-y-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Rechercher dans ma bibliothèque..."
              className="pl-10 pr-12"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-12 top-0"
                onClick={handleSearchInGlobalSearch}
              >
                <ArrowRight className="h-4 w-4 text-muted-foreground hover:text-primary" />
              </Button>
            )}
          </div>

          <div className="flex items-center justify-between gap-4">
            <LibraryFilters
              selectedTypes={selectedTypes}
              selectedStatuses={selectedStatuses}
              yearRange={yearRange}
              onTypeChange={setSelectedTypes}
              onStatusChange={setSelectedStatuses}
              onYearChange={setYearRange}
            />
            <LibrarySort value={sortBy} onChange={setSortBy} />
          </div>
        </header>
        
        <ScrollArea className="h-[calc(100vh-220px)] px-6">
          <div className="space-y-8 pb-24">
            {filteredMedia.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground mb-4">
                  {searchTerm 
                    ? "Aucun média trouvé dans votre bibliothèque"
                    : "Votre bibliothèque est vide. Commencez à ajouter des médias !"}
                </p>
                {!searchTerm && (
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/recherche')}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Ajouter un média
                  </Button>
                )}
                {searchTerm && (
                  <Button 
                    variant="outline" 
                    onClick={handleSearchInGlobalSearch}
                  >
                    Rechercher "{searchTerm}" dans le catalogue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
            {filteredMedia.length > 0 && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {filteredMedia.map((media) => (
                  <MediaCard 
                    key={media.id} 
                    media={media} 
                    size="medium"
                    from={location.pathname}
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
