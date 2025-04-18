
import React, { useState } from "react";
import { Background } from "@/components/ui/background";
import { MobileNav } from "@/components/mobile-nav";
import { MediaCard } from "@/components/media-card";
import { mockMedia } from "@/data/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, FilterIcon, Search, ArrowRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MediaType } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MobileHeader } from "@/components/mobile-header";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const Bibliotheque = () => {
  const [filter, setFilter] = useState<MediaType | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

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

  const handleSearchInGlobalSearch = () => {
    if (searchTerm) {
      navigate(`/recherche?q=${encodeURIComponent(searchTerm)}&type=${filter !== 'all' ? filter : ''}`);
    }
  };

  const filterOptions = [
    { value: "all", label: "Tous les médias" },
    { value: "film", label: "Films" },
    { value: "serie", label: "Séries" },
    { value: "book", label: "Livres" },
    { value: "game", label: "Jeux" },
  ];

  return (
    <Background>
      <MobileHeader title="Ma Bibliothèque" />
      <div className="pb-24 pt-safe">
        <header className="px-6 mb-6 mt-20">
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

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="absolute right-0 top-0"
                >
                  <FilterIcon className={cn(
                    "h-4 w-4",
                    filter !== "all" && "text-primary"
                  )} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {filterOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setFilter(option.value as MediaType | "all")}
                    className={cn(
                      filter === option.value && "bg-accent"
                    )}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
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
