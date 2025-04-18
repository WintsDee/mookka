
import React from "react";
import { useDiscoveryMedia } from "@/hooks/use-discovery-media";
import { MediaRecommendations } from "@/components/media-recommendations";
import { Loader2 } from "lucide-react";

export const DiscoveryContent = () => {
  const { films, series, books, games, isLoading } = useDiscoveryMedia();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="px-6 space-y-6">
      {films.length > 0 && (
        <MediaRecommendations
          title="Films recommandés"
          medias={films}
          type="film"
          from="/decouverte"
        />
      )}
      
      {series.length > 0 && (
        <MediaRecommendations
          title="Séries recommandées"
          medias={series}
          type="serie"
          from="/decouverte"
        />
      )}
      
      {books.length > 0 && (
        <MediaRecommendations
          title="Livres recommandés"
          medias={books}
          type="book"
          from="/decouverte"
        />
      )}
      
      {games.length > 0 && (
        <MediaRecommendations
          title="Jeux recommandés"
          medias={games}
          type="game"
          from="/decouverte"
        />
      )}
    </div>
  );
};
