
import React from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, ShoppingCart, Tv, Film, Store, Video } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar } from "@/components/ui/avatar";
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
          <Avatar className="h-8 w-8 rounded-md">
            <img 
              src={platform.logo} 
              alt={platform.name}
              className="object-contain"
            />
          </Avatar>
        ) : (
          <PlatformIcon type={platform.type} mediaType={mediaType} />
        )}
        <span>{platform.name}</span>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="sm" variant="outline" asChild>
              <a 
                href={platform.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1"
              >
                Voir <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Rechercher "{title}" sur {platform.name}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
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
