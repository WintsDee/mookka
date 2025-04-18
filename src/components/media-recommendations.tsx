
import React from "react";
import { MediaCard } from "@/components/media-card";
import { Media, MediaType } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

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
  const filteredMedias = type ? medias.filter(media => media.type === type) : medias;
  
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
      
      <ScrollArea className="w-full">
        <div className="flex gap-4 pb-4">
          {filteredMedias.map((media) => (
            <MediaCard 
              key={media.id} 
              media={media} 
              size="medium" 
              from={from}
              className="flex-shrink-0"
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
};
