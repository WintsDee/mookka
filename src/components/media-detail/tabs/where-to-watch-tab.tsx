
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, ShoppingCart, Tv, Film, Store, Video, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MediaType } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

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
    // Fonction pour simuler la récupération des plateformes 
    // (à remplacer plus tard par une véritable fonction d'API)
    const fetchPlatforms = async () => {
      setIsLoading(true);
      try {
        // Dans le futur, cette partie devrait être remplacée par un vrai appel API
        // Simulons des données pour le moment
        let mockPlatforms: Platform[] = [];
        
        setTimeout(() => {
          if (mediaType === "film" || mediaType === "serie") {
            mockPlatforms = [
              { id: "1", name: "Netflix", url: "https://www.netflix.com/", type: "streaming", logo: "/platforms/netflix.png" },
              { id: "2", name: "Amazon Prime Video", url: "https://www.primevideo.com/", type: "streaming", logo: "/platforms/prime.png" },
              { id: "3", name: "Disney+", url: "https://www.disneyplus.com/", type: "streaming", logo: "/platforms/disney.png" },
              { id: "4", name: "Canal+", url: "https://www.canalplus.com/", type: "streaming", logo: "/platforms/canal.png" },
              { id: "5", name: "Google Play Films", url: "https://play.google.com/store/movies", type: "purchase", logo: "/platforms/google-play.png" },
              { id: "6", name: "Apple TV", url: "https://www.apple.com/apple-tv-plus/", type: "streaming", logo: "/platforms/apple-tv.png" },
            ];
          } else if (mediaType === "book") {
            mockPlatforms = [
              { id: "1", name: "Amazon", url: `https://www.amazon.fr/s?k=${encodeURIComponent(title)}`, type: "purchase", logo: "/platforms/amazon.png" },
              { id: "2", name: "Fnac", url: `https://www.fnac.com/SearchResult/ResultList.aspx?Search=${encodeURIComponent(title)}`, type: "purchase", logo: "/platforms/fnac.png" },
              { id: "3", name: "Cultura", url: `https://www.cultura.com/catalogsearch/result/?q=${encodeURIComponent(title)}`, type: "purchase", logo: "/platforms/cultura.png" },
              { id: "4", name: "Kobo", url: `https://www.kobo.com/fr/fr/search?query=${encodeURIComponent(title)}`, type: "purchase", logo: "/platforms/kobo.png" },
              { id: "5", name: "Google Play Livres", url: `https://play.google.com/store/search?q=${encodeURIComponent(title)}&c=books`, type: "purchase", logo: "/platforms/google-play.png" },
            ];
          } else if (mediaType === "game") {
            mockPlatforms = [
              { id: "1", name: "Steam", url: `https://store.steampowered.com/search/?term=${encodeURIComponent(title)}`, type: "purchase", logo: "/platforms/steam.png" },
              { id: "2", name: "Epic Games Store", url: `https://store.epicgames.com/fr/browse?q=${encodeURIComponent(title)}`, type: "purchase", logo: "/platforms/epic.png" },
              { id: "3", name: "PlayStation Store", url: `https://store.playstation.com/fr-fr/search/${encodeURIComponent(title)}`, type: "purchase", logo: "/platforms/playstation.png" },
              { id: "4", name: "Xbox Store", url: `https://www.xbox.com/fr-FR/games/all-games?q=${encodeURIComponent(title)}`, type: "purchase", logo: "/platforms/xbox.png" },
              { id: "5", name: "Nintendo eShop", url: "https://www.nintendo.fr/Nintendo-eShop/", type: "purchase", logo: "/platforms/nintendo.png" },
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
                      {getIconByType(mediaType, type)}
                      <span>{platform.name}</span>
                    </div>
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
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ))}

      <div className="text-xs text-muted-foreground mt-4 text-center">
        Remarque: Les liens sont fournis à titre indicatif et peuvent ne pas contenir le média recherché.
      </div>
    </div>
  );
}
