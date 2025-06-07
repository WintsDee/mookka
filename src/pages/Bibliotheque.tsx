
import React, { useState } from "react";
import { Background } from "@/components/ui/background";
import { MobileHeader } from "@/components/mobile-header";
import { MediaCard } from "@/components/media-card";
import { LibraryTypeSelector } from "@/components/library/library-type-selector";
import { LibrarySearch } from "@/components/library/library-search";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MediaType } from "@/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface UserMediaWithRating {
  id: string;
  title: string;
  type: MediaType;
  cover_image: string;
  year?: number;
  rating?: number;
  status: string;
  duration?: string;
  user_rating?: number;
}

const Bibliotheque = () => {
  const [selectedType, setSelectedType] = useState<MediaType | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { 
    data: libraryData = [], 
    isLoading,
    error 
  } = useQuery({
    queryKey: ['library', selectedType],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error("Vous devez être connecté pour voir votre bibliothèque");
      }

      let query = supabase
        .from('user_media')
        .select(`
          status,
          user_rating,
          media:media_id (
            id,
            title,
            type,
            cover_image,
            year,
            rating,
            duration
          )
        `)
        .eq('user_id', session.user.id);

      if (selectedType !== "all") {
        query = query.eq('media.type', selectedType);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching library:", error);
        throw error;
      }

      if (!data) return [];

      return data
        .filter(item => item.media)
        .map(item => ({
          id: item.media.id,
          title: item.media.title,
          type: item.media.type as MediaType,
          coverImage: item.media.cover_image,
          year: item.media.year,
          rating: item.media.rating,
          status: item.status,
          duration: item.media.duration,
          userRating: item.user_rating
        }));
    },
    enabled: true
  });

  const filteredData = libraryData.filter(media =>
    media.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (error) {
    return (
      <Background>
        <MobileHeader />
        <div className="container mx-auto px-4 pt-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error instanceof Error ? error.message : "Erreur lors du chargement de la bibliothèque"}
            </AlertDescription>
          </Alert>
        </div>
      </Background>
    );
  }

  return (
    <Background>
      <MobileHeader />
      <div className="container mx-auto px-4 pt-8 pb-20">
        <h1 className="text-3xl font-bold mb-6 text-center">Ma Bibliothèque</h1>
        
        <div className="space-y-6">
          <LibraryTypeSelector 
            selectedType={selectedType} 
            onTypeChange={setSelectedType} 
          />
          
          <LibrarySearch 
            searchQuery={searchQuery} 
            onSearchChange={setSearchQuery} 
          />

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="w-full h-60 rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                {searchQuery ? "Aucun média trouvé pour cette recherche" : "Votre bibliothèque est vide"}
              </p>
              {!searchQuery && (
                <p className="text-sm text-muted-foreground">
                  Commencez par ajouter des médias à votre bibliothèque !
                </p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredData.map((media) => (
                <MediaCard
                  key={media.id}
                  media={media}
                  size="medium"
                  showStatusBadge={true}
                  userRating={media.userRating}
                  from="/bibliotheque"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Background>
  );
};

export default Bibliotheque;
