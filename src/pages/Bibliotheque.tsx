
import React, { useState, useEffect } from "react";
import { Background } from "@/components/ui/background";
import { MobileNav } from "@/components/mobile-nav";
import { MobileHeader } from "@/components/mobile-header";
import { MediaType, Media, MediaStatus } from "@/types";
import { useNavigate, useParams } from "react-router-dom";
import { LibrarySearch } from "@/components/library/library-search";
import { LibraryFilters } from "@/components/library/library-filters";
import { getUserMediaLibrary } from "@/services/media/operations";
import { useQuery } from "@tanstack/react-query";
import { LibraryTypeTabs } from "@/components/library/library-type-tabs";
import { LibraryStats } from "@/components/library/library-stats";
import { LibraryStatusSection } from "@/components/library/library-status-section";
import { Eye, Clock, Check } from "lucide-react";

const Bibliotheque = () => {
  // Récupère le paramètre de type de média depuis l'URL (si disponible)
  const { type } = useParams<{ type?: string }>();
  
  // État local pour les filtres
  const [mediaType, setMediaType] = useState<MediaType | "all">(
    (type as MediaType) || "all"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "title" | "rating">("date");
  const navigate = useNavigate();
  
  // Récupération des médias de l'utilisateur
  const { data: userMedia = [], isLoading } = useQuery({
    queryKey: ['userMediaLibrary'],
    queryFn: getUserMediaLibrary
  });

  // Mettre à jour l'URL lorsque le type change
  useEffect(() => {
    if (mediaType === "all") {
      navigate("/bibliotheque", { replace: true });
    } else {
      navigate(`/bibliotheque/${mediaType}`, { replace: true });
    }
  }, [mediaType, navigate]);

  // Filtrer les médias selon le type sélectionné et le terme de recherche
  const filteredMedia = userMedia
    .filter(media => mediaType === "all" || media.type === mediaType)
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

  // Grouper les médias par statut
  const inProgressMedia = filteredMedia.filter(media => 
    ['watching', 'reading', 'playing'].includes(media.status || '')
  );
  
  const toDoMedia = filteredMedia.filter(media => 
    ['to-watch', 'to-read', 'to-play'].includes(media.status || '')
  );
  
  const completedMedia = filteredMedia.filter(media => 
    media.status === 'completed'
  );

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
                  navigate(`/recherche?q=${encodeURIComponent(searchTerm)}&type=${mediaType === "all" ? "" : mediaType}`);
                }
              }}
            />
            <LibraryFilters
              sortBy={sortBy}
              onSortChange={setSortBy}
              filter={mediaType as MediaType | "all"}
              onFilterChange={setMediaType}
            />
          </div>
          
          <div className="mt-4">
            <LibraryTypeTabs 
              selectedType={mediaType} 
              onChange={setMediaType} 
            />
          </div>
        </header>
        
        <div className="mt-36 px-6 pb-16">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <p>Chargement de votre bibliothèque...</p>
            </div>
          ) : (
            <>
              {/* Statistiques */}
              <LibraryStats userMedia={userMedia} />
              
              {/* Sections par statut */}
              <LibraryStatusSection 
                title="En cours" 
                icon={Clock}
                media={inProgressMedia}
                emptyMessage="Vous n'avez aucun média en cours de consommation"
              />
              
              <LibraryStatusSection 
                title="À faire" 
                icon={Eye}
                media={toDoMedia}
                emptyMessage="Vous n'avez aucun média dans votre liste à faire"
              />
              
              <LibraryStatusSection 
                title="Terminé" 
                icon={Check}
                media={completedMedia}
                emptyMessage="Vous n'avez aucun média terminé"
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
