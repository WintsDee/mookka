import React from "react";
import { Card } from "@/components/ui/card";
import { MediaType } from "@/types";
import { Platform } from "./types";
import { PlatformList } from "./platform-list";
import { usePlatforms } from "./use-platforms";
import { WhereToWatchLoading } from "./where-to-watch-loading";
import { WhereToWatchEmpty } from "./where-to-watch-empty";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface WhereToWatchTabProps {
  mediaId: string;
  mediaType: MediaType;
  title: string;
}

export function WhereToWatchTab({ mediaId, mediaType, title }: WhereToWatchTabProps) {
  const { availablePlatforms, isLoading, error, hasAvailablePlatforms } = usePlatforms(mediaId, mediaType, title);
  
  // Log platform data for debugging
  console.log(`WhereToWatch tab for ${mediaType} ID:${mediaId}`, { availablePlatforms, hasAvailablePlatforms });
  
  if (isLoading) {
    return <WhereToWatchLoading />;
  }
  
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription>
          {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (!hasAvailablePlatforms) {
    return <WhereToWatchEmpty />;
  }

  // For films and series, group by category (subscription, vod, free)
  if (mediaType === "film" || mediaType === "serie") {
    // Group platforms by category
    const groupedByCategory = availablePlatforms.reduce((acc, platform) => {
      const category = platform.category || "other";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(platform);
      return acc;
    }, {} as Record<string, Platform[]>);

    return (
      <div className="space-y-4">
        <h2 className="text-lg font-medium mb-4">Où voir ou acheter ce média ?</h2>

        {/* Display subscription platforms first */}
        {groupedByCategory.subscription && groupedByCategory.subscription.length > 0 && (
          <PlatformList 
            key="subscription"
            type="streaming" 
            category="subscription"
            platforms={groupedByCategory.subscription} 
            mediaType={mediaType}
            title={title}
          />
        )}

        {/* Then VOD platforms */}
        {groupedByCategory.vod && groupedByCategory.vod.length > 0 && (
          <PlatformList 
            key="vod"
            type="purchase" 
            category="vod"
            platforms={groupedByCategory.vod} 
            mediaType={mediaType}
            title={title}
          />
        )}

        {/* Finally free platforms */}
        {groupedByCategory.free && groupedByCategory.free.length > 0 && (
          <PlatformList 
            key="free"
            type="streaming" 
            category="free"
            platforms={groupedByCategory.free} 
            mediaType={mediaType}
            title={title}
          />
        )}

        {/* Other platforms if any */}
        {groupedByCategory.other && groupedByCategory.other.length > 0 && (
          <PlatformList 
            key="other"
            type="other" 
            platforms={groupedByCategory.other} 
            mediaType={mediaType}
            title={title}
          />
        )}

        <div className="text-xs text-muted-foreground mt-4 text-center">
          Remarque: Ces liens vous dirigent vers les résultats de recherche pour "{title}" sur chaque plateforme.
        </div>
      </div>
    );
  } else {
    // Pour les livres et jeux, conserver le regroupement par type
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
}
