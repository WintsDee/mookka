
import React from "react";
import { MediaCard } from "@/components/media-card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Media, MediaType } from "@/types";
import { Film, Tv, Book, GamepadIcon, AlertCircle } from "lucide-react";

interface TrendingMediaProps {
  type: MediaType;
  items: Media[];
  loading: boolean;
}

interface TrendingSectionProps {
  mediaItems: TrendingMediaProps[];
}

export function TrendingSection({ mediaItems }: TrendingSectionProps) {
  const getIconByType = (type: MediaType) => {
    switch (type) {
      case "film": return <Film className="h-4 w-4" />;
      case "serie": return <Tv className="h-4 w-4" />;
      case "book": return <Book className="h-4 w-4" />;
      case "game": return <GamepadIcon className="h-4 w-4" />;
      default: return <Film className="h-4 w-4" />;
    }
  };
  
  const getTypeLabel = (type: MediaType) => {
    switch (type) {
      case "film": return "Films";
      case "serie": return "Séries";
      case "book": return "Livres";
      case "game": return "Jeux";
      default: return "Médias";
    }
  };

  if (!mediaItems || mediaItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground text-lg">Aucun contenu disponible</p>
        <p className="text-muted-foreground text-sm mt-2">Veuillez vérifier votre connexion internet</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {mediaItems.map((mediaItem) => (
        <section key={mediaItem.type} className="space-y-3">
          <h3 className="text-lg font-medium flex items-center gap-2 px-4">
            {getIconByType(mediaItem.type)}
            <span>{getTypeLabel(mediaItem.type)} tendance</span>
          </h3>
          
          <ScrollArea className="w-full">
            <div className="flex gap-4 p-4 pt-0 pb-6">
              {mediaItem.loading ? (
                Array(6).fill(0).map((_, i) => (
                  <div key={i} className="min-w-[140px] space-y-2 flex-shrink-0">
                    <Skeleton className="h-[200px] w-[140px] rounded-lg" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                ))
              ) : mediaItem.items.length === 0 ? (
                <div className="flex-1 flex justify-center items-center py-10">
                  <p className="text-muted-foreground text-sm">Aucun contenu disponible</p>
                </div>
              ) : (
                mediaItem.items.map((media) => (
                  <MediaCard
                    key={media.id}
                    media={media}
                    size="small"
                    from="decouvrir"
                    className="flex-shrink-0"
                  />
                ))
              )}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </section>
      ))}
    </div>
  );
}
