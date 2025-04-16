
import React from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, ShoppingCart, Tv, Film, Store, Video } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MediaType } from "@/types";
import { Platform } from "./use-platforms";

interface PlatformItemProps {
  platform: Platform;
  mediaType: MediaType;
  title: string;
}

export function PlatformItem({ platform, mediaType, title }: PlatformItemProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {platform.logo ? (
          <div className="flex-shrink-0 h-8 w-8 relative bg-background rounded-md overflow-hidden border border-border flex items-center justify-center">
            <img 
              src={platform.logo} 
              alt={platform.name}
              className="max-h-full max-w-full object-contain p-0.5"
              loading="lazy"
              onError={(e) => {
                // En cas d'erreur de chargement du logo, afficher une icône à la place
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentNode as HTMLElement;
                if (parent) {
                  parent.innerHTML = '<div class="flex items-center justify-center h-full w-full"></div>';
                }
              }}
            />
          </div>
        ) : (
          <PlatformIcon type={platform.type} mediaType={mediaType} />
        )}
        <span className="text-sm md:text-base">{platform.name}</span>
      </div>
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="sm" variant="outline" asChild className="h-8 px-3">
                <a 
                  href={platform.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5"
                >
                  <span className="text-xs">Voir</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Rechercher "{title}" sur {platform.name}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}

function PlatformIcon({ type, mediaType }: { type: string, mediaType: MediaType }) {
  if (type === "streaming") {
    return <Tv className="h-5 w-5" />;
  } else if (type === "rent") {
    return <Video className="h-5 w-5" />;
  } else {
    if (mediaType === "film" || mediaType === "serie") {
      return <Film className="h-5 w-5" />;
    } else if (mediaType === "book") {
      return <ShoppingCart className="h-5 w-5" />;
    } else {
      return <Store className="h-5 w-5" />;
    }
  }
}
