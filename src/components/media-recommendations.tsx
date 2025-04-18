
import React from "react";
import { MediaCard } from "@/components/media-card";
import { Media, MediaType } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface MediaRecommendationsProps {
  title: string;
  medias: Media[];
  type?: MediaType;
  onSeeMore?: () => void;
  from?: string;
}

export const MediaRecommendations = ({ 
  title, 
  medias, 
  type, 
  onSeeMore,
  from
}: MediaRecommendationsProps) => {
  // Make sure we set the type on each media item if a type is provided
  const filteredMedias = type 
    ? medias.filter(media => media.type === type).map(media => ({...media, type}))
    : medias;
  
  return (
    <section className="my-6">
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
