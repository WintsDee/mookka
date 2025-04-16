
import { useState, useEffect } from 'react';
import { MediaType } from "@/types";

export interface Platform {
  id: string;
  name: string;
  url: string;
  type: "streaming" | "purchase" | "rent";
  logo?: string;
}

export function usePlatforms(mediaId: string, mediaType: MediaType, title: string) {
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

  return { platforms, isLoading };
}
