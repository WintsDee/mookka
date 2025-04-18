
import React from "react";
import { MediaCard } from "@/components/media-card";
import { Media, MediaType } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { MediaRecommendationsSkeleton } from "@/components/skeletons/media-recommendations-skeleton";

interface MediaRecommendationsProps {
  title: string;
  medias: Media[];
  type?: MediaType;
  onSeeMore?: () => void;
  from?: string;
  isLoading?: boolean;
}

export const MediaRecommendations = ({ 
  title, 
  medias, 
  type, 
  onSeeMore,
  from,
  isLoading = false
}: MediaRecommendationsProps) => {
  // Si les médias sont en cours de chargement, afficher le squelette de chargement
  if (isLoading) {
    return <MediaRecommendationsSkeleton title={title} />
  }
  
  // Filtrer les médias par type si spécifié
  const filteredMedias = type ? medias.filter(media => media.type === type) : medias;
  
  // Si aucun média n'est disponible après filtrage, ne pas afficher la section
  if (filteredMedias.length === 0) {
    return null;
  }
  
  return (
    <section className="my-6 animate-fade-in">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-medium">{title}</h2>
        {onSeeMore && (
          <Button variant="ghost" size="sm" className="flex items-center text-xs" onClick={onSeeMore}>
            Voir plus <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {filteredMedias.map((media) => (
          <MediaCard 
            key={media.id} 
            media={media} 
            size="medium" 
            from={from}
          />
        ))}
      </div>
    </section>
  );
};
