
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { MediaType } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { PlatformList } from "./platform-list";
import { Platform, usePlatforms } from "./use-platforms";
import { WhereToWatchLoading } from "./where-to-watch-loading";
import { WhereToWatchEmpty } from "./where-to-watch-empty";

interface WhereToWatchTabProps {
  mediaId: string;
  mediaType: MediaType;
  title: string;
}

export function WhereToWatchTab({ mediaId, mediaType, title }: WhereToWatchTabProps) {
  const { platforms, isLoading } = usePlatforms(mediaId, mediaType, title);
  
  // Filtrer uniquement les plateformes disponibles
  const availablePlatforms = platforms.filter(platform => platform.isAvailable === true);

  if (isLoading) {
    return <WhereToWatchLoading />;
  }

  if (availablePlatforms.length === 0) {
    return <WhereToWatchEmpty />;
  }

  // Group platforms by type
  const groupedPlatforms = availablePlatforms.reduce((acc, platform) => {
    const type = platform.type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(platform);
    return acc;
  }, {} as Record<string, Platform[]>);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium mb-4">Où voir ou acheter ce média ?</h2>

      {Object.entries(groupedPlatforms).map(([type, typePlatforms]) => (
        <PlatformList 
          key={type}
          type={type} 
          platforms={typePlatforms} 
          mediaType={mediaType}
          title={title}
        />
      ))}

      <div className="text-xs text-muted-foreground mt-4 text-center">
        Remarque: Ces liens vous dirigent vers les résultats de recherche pour "{title}" sur chaque plateforme.
      </div>
    </div>
  );
}
