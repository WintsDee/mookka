
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, ShoppingCart, Tv, Film, Store, Video, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MediaType } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar } from "@/components/ui/avatar";

interface Platform {
  id: string;
  name: string;
  url: string;
  type: "streaming" | "purchase" | "rent";
  logo?: string;
}

interface WhereToWatchTabProps {
  mediaId: string;
  mediaType: MediaType;
  title: string;
}

export function WhereToWatchTab({ mediaId, mediaType, title }: WhereToWatchTabProps) {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fonction pour récupérer les plateformes où voir/acheter ce média
    const fetchPlatforms = async () => {
      setIsLoading(true);
      try {
        // Construction de recherches optimisées selon le type de média
        let mockPlatforms: Platform[] = [];
        
        setTimeout(() => {
          const encodedTitle = encodeURIComponent(title);
          
          if (mediaType === "film" || mediaType === "serie") {
            mockPlatforms = [
              { 
                id: "1", 
                name: "Netflix", 
                url: `https://www.netflix.com/search?q=${encodedTitle}`, 
                type: "streaming", 
                logo: "/platforms/netflix.png" 
              },
              { 
                id: "2", 
                name: "Amazon Prime Video", 
                url: `https://www.primevideo.com/search/ref=atv_sr_sug_4?phrase=${encodedTitle}`, 
                type: "streaming", 
                logo: "/platforms/prime.png" 
              },
              { 
                id: "3", 
                name: "Disney+", 
                url: `https://www.disneyplus.com/fr-fr/search?q=${encodedTitle}`, 
                type: "streaming", 
                logo: "/platforms/disney.png" 
              },
              { 
                id: "4", 
                name: "Canal+", 
                url: `https://www.canalplus.com/recherche?q=${encodedTitle}`, 
                type: "streaming", 
                logo: "/platforms/canal.png" 
              },
              { 
                id: "5", 
                name: "Google Play Films", 
                url: `https://play.google.com/store/search?q=${encodedTitle}&c=movies`, 
                type: "purchase", 
                logo: "/platforms/google-play.png" 
              },
              { 
                id: "6", 
                name: "Apple TV", 
                url: `https://tv.apple.com/fr/search?term=${encodedTitle}`, 
                type: "streaming", 
                logo: "/platforms/apple-tv.png" 
              },
              {
                id: "7",
                name: "Molotov TV",
                url: `https://www.molotov.tv/search?search=${encodedTitle}`,
                type: "streaming",
                logo: "/platforms/molotov.png"
              },
              {
                id: "8",
                name: "OCS",
                url: `https://www.ocs.fr/recherche?q=${encodedTitle}`,
                type: "streaming",
                logo: "/platforms/ocs.png"
              }
            ];
          } else if (mediaType === "book") {
            mockPlatforms = [
              { 
                id: "1", 
                name: "Amazon", 
                url: `https://www.amazon.fr/s?k=${encodedTitle}&i=stripbooks`, 
                type: "purchase", 
                logo: "/platforms/amazon.png" 
              },
              { 
                id: "2", 
                name: "Fnac", 
                url: `https://www.fnac.com/SearchResult/ResultList.aspx?Search=${encodedTitle}&Category=2`, 
                type: "purchase", 
                logo: "/platforms/fnac.png" 
              },
              { 
                id: "3", 
                name: "Cultura", 
                url: `https://www.cultura.com/catalogsearch/result/?q=${encodedTitle}`, 
                type: "purchase", 
                logo: "/platforms/cultura.png" 
              },
              { 
                id: "4", 
                name: "Kobo", 
                url: `https://www.kobo.com/fr/fr/search?query=${encodedTitle}`, 
                type: "purchase", 
                logo: "/platforms/kobo.png" 
              },
              { 
                id: "5", 
                name: "Google Play Livres", 
                url: `https://play.google.com/store/search?q=${encodedTitle}&c=books`, 
                type: "purchase", 
                logo: "/platforms/google-play.png" 
              },
              {
                id: "6",
                name: "Decitre",
                url: `https://www.decitre.fr/rechercher/result?q=${encodedTitle}`,
                type: "purchase",
                logo: "/platforms/decitre.png"
              },
              {
                id: "7",
                name: "Gallimard",
                url: `https://www.gallimard.fr/Catalogue/recherche?q=${encodedTitle}`,
                type: "purchase",
                logo: "/platforms/gallimard.png"
              }
            ];
          } else if (mediaType === "game") {
            mockPlatforms = [
              { 
                id: "1", 
                name: "Steam", 
                url: `https://store.steampowered.com/search/?term=${encodedTitle}&lang=french`, 
                type: "purchase", 
                logo: "/platforms/steam.png" 
              },
              { 
                id: "2", 
                name: "Epic Games Store", 
                url: `https://store.epicgames.com/fr/browse?q=${encodedTitle}&sortBy=relevancy&sortDir=DESC&lang=fr`, 
                type: "purchase", 
                logo: "/platforms/epic.png" 
              },
              { 
                id: "3", 
                name: "PlayStation Store", 
                url: `https://store.playstation.com/fr-fr/search/${encodedTitle}`, 
                type: "purchase", 
                logo: "/platforms/playstation.png" 
              },
              { 
                id: "4", 
                name: "Xbox Store", 
                url: `https://www.xbox.com/fr-FR/games/all-games?q=${encodedTitle}`, 
                type: "purchase", 
                logo: "/platforms/xbox.png" 
              },
              { 
                id: "5", 
                name: "Nintendo eShop", 
                url: `https://www.nintendo.fr/Rechercher/Rechercher-299117.html?q=${encodedTitle}`, 
                type: "purchase", 
                logo: "/platforms/nintendo.png" 
              },
              {
                id: "6",
                name: "GOG",
                url: `https://www.gog.com/fr/games?query=${encodedTitle}`,
                type: "purchase",
                logo: "/platforms/gog.png"
              },
              {
                id: "7",
                name: "Humble Bundle",
                url: `https://www.humblebundle.com/store/search?sort=bestselling&search=${encodedTitle}`,
                type: "purchase",
                logo: "/platforms/humble.png"
              },
              {
                id: "8",
                name: "Ubisoft Connect",
                url: `https://store.ubisoft.com/fr/search?q=${encodedTitle}`,
                type: "purchase",
                logo: "/platforms/ubisoft.png"
              }
            ];
          }
          
          setPlatforms(mockPlatforms);
          setIsLoading(false);
        }, 1000);
        
      } catch (error) {
        console.error("Erreur lors de la récupération des plateformes:", error);
        setIsLoading(false);
      }
    };
    
    fetchPlatforms();
  }, [mediaId, mediaType, title]);

  const getIconByType = (type: MediaType, platformType: string) => {
    if (platformType === "streaming") {
      return <Tv className="h-5 w-5" />;
    } else if (platformType === "rent") {
      return <Video className="h-5 w-5" />;
    } else {
      if (type === "film" || type === "serie") {
        return <Film className="h-5 w-5" />;
      } else if (type === "book") {
        return <ShoppingCart className="h-5 w-5" />;
      } else {
        return <Store className="h-5 w-5" />;
      }
    }
  };

  const groupedPlatforms = platforms.reduce((acc, platform) => {
    const type = platform.type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(platform);
    return acc;
  }, {} as Record<string, Platform[]>);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-medium mb-4">Où voir ou acheter ce média ?</h2>
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-md" />
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                  <Skeleton className="h-9 w-[80px]" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (platforms.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-medium mb-4">Où voir ou acheter ce média ?</h2>
        <Card className="bg-secondary/40 border-border">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              Nous n'avons pas encore d'informations sur les plateformes de visionnage ou d'achat pour ce média.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium mb-4">Où voir ou acheter ce média ?</h2>

      {Object.entries(groupedPlatforms).map(([type, typePlatforms]) => (
        <div key={type} className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground capitalize">
            {type === "streaming" 
              ? "Plateformes de streaming" 
              : type === "purchase" 
                ? "Acheter"
                : "Louer"}
          </h3>
          <Card className="bg-secondary/40 border-border">
            <CardContent className="p-4">
              <div className="space-y-3">
                {typePlatforms.map((platform) => (
                  <div key={platform.id} className="flex items-center justify-between">
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
                        getIconByType(mediaType, type)
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
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ))}

      <div className="text-xs text-muted-foreground mt-4 text-center">
        Remarque: Ces liens vous dirigent vers les résultats de recherche pour "{title}" sur chaque plateforme.
      </div>
    </div>
  );
}
