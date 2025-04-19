
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MediaType } from "@/types";
import { Platform } from "./types";
import { PlatformItem } from "./platform-item";

interface PlatformListProps {
  type: string;
  category?: string;
  platforms: Platform[];
  mediaType: MediaType;
  title: string;
}

export function PlatformList({ type, category, platforms, mediaType, title }: PlatformListProps) {
  let typeLabel = "";
  
  if (mediaType === "film" || mediaType === "serie") {
    if (category === "subscription") {
      typeLabel = "Par abonnement";
    } else if (category === "vod") {
      typeLabel = "Location et achat (VOD)";
    } else if (category === "free") {
      typeLabel = "Gratuit avec publicité";
    } else {
      typeLabel = 
        type === "streaming" 
          ? "Plateformes de streaming" 
          : type === "purchase" 
            ? "Acheter"
            : "Louer";
    }
  } else if (mediaType === "game") {
    if (category === "store") {
      typeLabel = "Plateformes de jeu";
    } else {
      typeLabel = 
        type === "purchase" 
          ? "Acheter"
          : type === "subscription" 
            ? "Services d'abonnement"
            : "Plateformes";
    }
  } else {
    typeLabel = 
      type === "streaming" 
        ? "Plateformes de streaming" 
        : type === "purchase" 
          ? "Acheter"
          : "Louer";
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground capitalize">
        {typeLabel}
      </h3>
      <Card className="bg-secondary/40 border-border">
        <CardContent className="p-4">
          <div className="space-y-3">
            {platforms.map((platform) => (
              <PlatformItem 
                key={platform.id} 
                platform={platform} 
                mediaType={mediaType}
                title={title}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
