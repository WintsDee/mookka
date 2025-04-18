
import { Platform } from "../types";

export function generateBookPlatforms(mediaId: string, encodedTitle: string): Platform[] {
  return [
    { 
      id: "1", 
      name: "Amazon", 
      url: `https://www.amazon.fr/s?k=${encodedTitle}&i=stripbooks`, 
      type: "purchase", 
      category: "vod",
      logo: "/platforms/amazon.png",
      isAvailable: true
    },
    { 
      id: "2", 
      name: "Fnac", 
      url: `https://www.fnac.com/SearchResult/ResultList.aspx?Search=${encodedTitle}&Category=2`, 
      type: "purchase", 
      category: "vod",
      logo: "/platforms/fnac.png",
      isAvailable: true
    },
    { 
      id: "3", 
      name: "Cultura", 
      url: `https://www.cultura.com/catalogsearch/result/?q=${encodedTitle}`, 
      type: "purchase", 
      category: "vod",
      logo: "/platforms/cultura.png",
      isAvailable: mediaId === "5"
    },
    { 
      id: "4", 
      name: "Kobo", 
      url: `https://www.kobo.com/fr/fr/search?query=${encodedTitle}`, 
      type: "purchase", 
      category: "vod",
      logo: "/platforms/kobo.png",
      isAvailable: mediaId === "4"
    },
    { 
      id: "5", 
      name: "Google Play Livres", 
      url: `https://play.google.com/store/search?q=${encodedTitle}&c=books`, 
      type: "purchase", 
      category: "vod",
      logo: "/platforms/google-play.png",
      isAvailable: true
    },
    {
      id: "6",
      name: "Decitre",
      url: `https://www.decitre.fr/rechercher/result?q=${encodedTitle}`,
      type: "purchase",
      category: "vod",
      logo: "/platforms/decitre.png",
      isAvailable: mediaId === "4"
    },
    {
      id: "7",
      name: "Gallimard",
      url: `https://www.gallimard.fr/Catalogue/recherche?q=${encodedTitle}`,
      type: "purchase",
      category: "vod",
      logo: "/platforms/gallimard.png",
      isAvailable: mediaId === "6"
    }
  ];
}
