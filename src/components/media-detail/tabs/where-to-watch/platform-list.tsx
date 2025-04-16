
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MediaType } from "@/types";
import { Platform } from "./types";
import { PlatformItem } from "./platform-item";

interface PlatformListProps {
  type: string;
  platforms: Platform[];
  mediaType: MediaType;
  title: string;
}

export function PlatformList({ type, platforms, mediaType, title }: PlatformListProps) {
  const typeLabel = 
    type === "streaming" 
      ? "Plateformes de streaming" 
      : type === "purchase" 
        ? "Acheter"
        : "Louer";

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
