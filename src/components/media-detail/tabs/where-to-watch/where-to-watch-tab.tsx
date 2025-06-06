
import React from "react";
import { MediaType } from "@/types";
import { usePlatforms } from "./use-platforms";
import { PlatformList } from "./platform-list";
import { WhereToWatchLoading } from "./where-to-watch-loading";
import { WhereToWatchEmpty } from "./where-to-watch-empty";

interface WhereToWatchTabProps {
  mediaId: string;
  mediaType: MediaType;
  title: string;
}

export function WhereToWatchTab({ mediaId, mediaType, title }: WhereToWatchTabProps) {
  console.log("WhereToWatchTab - Props:", { mediaId, mediaType, title });
  
  // Validation des props
  if (!mediaId || !mediaType) {
    console.error("WhereToWatchTab - Missing required props:", { mediaId, mediaType });
    return <WhereToWatchEmpty />;
  }

  // Hook pour récupérer les plateformes - avec les 3 arguments
  const { platforms, isLoading, error } = usePlatforms(mediaId, mediaType, title || "");
  
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

  // Grouper les plateformes par type et catégorie
  const groupedPlatforms = platforms.reduce((acc, platform) => {
    const key = `${platform.type}-${platform.category || 'default'}`;
    if (!acc[key]) {
      acc[key] = {
        type: platform.type,
        category: platform.category,
        platforms: []
      };
    }
    acc[key].platforms.push(platform);
    return acc;
  }, {} as Record<string, { type: string; category?: string; platforms: any[] }>);

  return (
    <div className="p-4 space-y-4">
      {Object.values(groupedPlatforms).map((group, index) => (
        <PlatformList 
          key={index}
          type={group.type}
          category={group.category}
          platforms={group.platforms} 
          mediaType={mediaType}
          title={title}
        />
      ))}
    </div>
  );
}
