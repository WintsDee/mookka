
import React from "react";
import { MediaCard } from "@/components/media-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Media } from "@/types";

interface MediaGridProps {
  title: string;
  medias: Media[];
  loading: boolean;
  description?: string;
}

export function MediaGrid({ title, medias, loading, description }: MediaGridProps) {
  return (
    <div className="space-y-4 pb-20">
      <div className="px-4 space-y-1">
        <h2 className="text-lg font-medium">{title}</h2>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
        {loading ? (
          Array(8).fill(0).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-[240px] w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))
        ) : medias.length === 0 ? (
          <div className="col-span-full flex justify-center items-center py-10">
            <p className="text-muted-foreground">Aucun contenu disponible</p>
          </div>
        ) : (
          medias.map((media) => (
            <MediaCard
              key={media.id}
              media={media}
              size="medium"
              from="decouvrir"
            />
          ))
        )}
      </div>
    </div>
  );
}
