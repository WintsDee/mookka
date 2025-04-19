
import React from "react";
import { Platform } from "./types";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface PlatformItemProps {
  platform: Platform;
  mediaType: string;
  title: string;
}

export function PlatformItem({ platform, mediaType, title }: PlatformItemProps) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
      <div className="flex items-center gap-3">
        {platform.logo ? (
          <img
            src={platform.logo}
            alt={platform.name}
            className="w-8 h-8 object-contain"
          />
        ) : (
          <div className="w-8 h-8 bg-muted rounded-md flex items-center justify-center">
            {platform.name.charAt(0)}
          </div>
        )}
        <div>
          <h4 className="font-medium">{platform.name}</h4>
          {platform.pricing && (
            <p className="text-sm text-muted-foreground">
              À partir de {platform.pricing.startingPrice}
            </p>
          )}
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        asChild
      >
        <a 
          href={platform.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2"
        >
          <ExternalLink size={16} />
        </a>
      </Button>
    </div>
  );
}
