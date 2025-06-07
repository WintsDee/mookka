
import React from "react";
import { MediaType } from "@/types";
import { usePlatforms } from "./use-platforms";
import { PlatformList } from "./platform-list";
import { WhereToWatchLoading } from "./where-to-watch-loading";
import { WhereToWatchEmpty } from "./where-to-watch-empty";

interface WhereToWatchTabProps {
  mediaId: string;
  mediaType: MediaType;
  formattedMedia: any;
}

export function WhereToWatchTab({ mediaId, mediaType, formattedMedia }: WhereToWatchTabProps) {
  console.log("WhereToWatchTab - Props:", { mediaId, mediaType, hasFormattedMedia: !!formattedMedia });
  
  // Validation des props
  if (!mediaId || !mediaType) {
    console.error("WhereToWatchTab - Missing required props:", { mediaId, mediaType });
    return <WhereToWatchEmpty />;
  }

  // Hook pour récupérer les plateformes
  const { platforms, isLoading, error } = usePlatforms(mediaType, formattedMedia);
  
  console.log("WhereToWatchTab - Hook result:", { 
    platformsCount: platforms?.length || 0, 
    isLoading, 
    hasError: !!error 
  });

  // États de chargement et d'erreur
  if (isLoading) {
    return <WhereToWatchLoading />;
  }

  if (error) {
    console.error("WhereToWatchTab - Error:", error);
    return <WhereToWatchEmpty />;
  }

  if (!platforms || platforms.length === 0) {
    return <WhereToWatchEmpty />;
  }

  return (
    <div className="p-4">
      <PlatformList 
        platforms={platforms} 
        mediaType={mediaType}
        type={mediaType}
        title={formattedMedia?.title || ""}
      />
    </div>
  );
}
