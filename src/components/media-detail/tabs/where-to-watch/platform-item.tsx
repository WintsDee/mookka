
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, ShoppingCart, Tv, Film, Store, Video, Ticket, DollarSign, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MediaType } from "@/types";
import { Platform } from "./types";

interface PlatformItemProps {
  platform: Platform;
  mediaType: MediaType;
  title: string;
}

export function PlatformItem({ platform, mediaType, title }: PlatformItemProps) {
  const [imageError, setImageError] = useState(false);

  const getLogoPath = (logoPath: string | undefined) => {
    if (!logoPath) return null;
    
    if (logoPath.startsWith('http')) {
      return logoPath;
    }
    
    if (logoPath.startsWith('/')) {
      return logoPath;
    }
    
    return `/${logoPath}`;
  };

  const logoPath = getLogoPath(platform.logo);

  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-3 flex-1">
        <div className="flex-shrink-0 h-8 w-8 relative bg-background rounded-md overflow-hidden border border-border flex items-center justify-center">
          {logoPath && !imageError ? (
            <img 
              src={logoPath} 
              alt={platform.name}
              className="max-h-full max-w-full object-contain p-0.5"
              loading="lazy"
              onError={() => setImageError(true)}
            />
          ) : (
            <PlatformIcon platform={platform} mediaType={mediaType} />
          )}
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-sm md:text-base">{platform.name}</span>
            {platform.category === "subscription" && (
              <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full">
                Abonnement
              </span>
            )}
            {platform.category === "vod" && (
              <span className="text-xs px-2 py-0.5 bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-100 rounded-full">
                VOD
              </span>
            )}
            {platform.category === "free" && (
              <span className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 rounded-full">
                Gratuit
              </span>
            )}
          </div>
          {platform.pricing && (
            <div className="text-xs text-muted-foreground mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              À partir de {platform.pricing.startingPrice}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {platform.pricing && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <div className="space-y-1">
                  <p className="font-medium">Plans disponibles:</p>
                  <ul className="text-sm">
                    {platform.pricing.plans.map((plan, index) => (
                      <li key={index}>{plan}</li>
                    ))}
                  </ul>
                  <p className="text-xs text-muted-foreground mt-1">À partir de {platform.pricing.startingPrice}</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
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

function PlatformIcon({ platform, mediaType }: { platform: Platform, mediaType: MediaType }) {
  if (platform.category === "subscription") {
    return <Tv className="h-5 w-5" />;
  }
  
  if (platform.category === "vod") {
    return <Ticket className="h-5 w-5" />;
  }
  
  if (platform.category === "free") {
    return <Video className="h-5 w-5" />;
  }
  
  if (platform.type === "streaming") {
    return <Tv className="h-5 w-5" />;
  } else if (platform.type === "rent") {
    return <DollarSign className="h-5 w-5" />;
  } else if (platform.type === "purchase") {
    if (mediaType === "film" || mediaType === "serie") {
      return <Film className="h-5 w-5" />;
    } else if (mediaType === "book") {
      return <ShoppingCart className="h-5 w-5" />;
    } else {
      return <Store className="h-5 w-5" />;
    }
  }
  
  return <Store className="h-5 w-5" />;
}
