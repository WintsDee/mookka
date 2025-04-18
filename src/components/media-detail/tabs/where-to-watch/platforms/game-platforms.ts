
import { Platform } from "../types";

export function generateGamePlatforms(mediaId: string, encodedTitle: string): Platform[] {
  return [
    { 
      id: "1", 
      name: "Steam", 
      url: `https://store.steampowered.com/search/?term=${encodedTitle}&lang=french`, 
      type: "purchase", 
      category: "vod",
      logo: "/platforms/steam.png",
      isAvailable: true 
    },
    { 
      id: "2", 
      name: "Epic Games Store", 
      url: `https://store.epicgames.com/fr/browse?q=${encodedTitle}&sortBy=relevancy&sortDir=DESC&lang=fr`, 
      type: "purchase", 
      category: "vod",
      logo: "/platforms/epic.png",
      isAvailable: mediaId === "8"
    },
    { 
      id: "3", 
      name: "PlayStation Store", 
      url: `https://store.playstation.com/fr-fr/search/${encodedTitle}`, 
      type: "purchase", 
      category: "vod",
      logo: "/platforms/playstation.png",
      isAvailable: mediaId === "7" || mediaId === "9" 
    },
    { 
      id: "4", 
      name: "Xbox Store", 
      url: `https://www.xbox.com/fr-FR/games/all-games?q=${encodedTitle}`, 
      type: "purchase", 
      category: "vod",
      logo: "/platforms/xbox.png",
      isAvailable: mediaId === "7"
    },
    { 
      id: "5", 
      name: "Nintendo eShop", 
      url: `https://www.nintendo.fr/Rechercher/Rechercher-299117.html?q=${encodedTitle}`, 
      type: "purchase", 
      category: "vod",
      logo: "/platforms/nintendo.png",
      isAvailable: mediaId === "8"
    },
    {
      id: "6",
      name: "GOG",
      url: `https://www.gog.com/fr/games?query=${encodedTitle}`,
      type: "purchase",
      category: "vod",
      logo: "/platforms/gog.png",
      isAvailable: false
    },
    {
      id: "7",
      name: "Humble Bundle",
      url: `https://www.humblebundle.com/store/search?sort=bestselling&search=${encodedTitle}`,
      type: "purchase",
      category: "vod",
      logo: "/platforms/humble.png",
      isAvailable: false
    },
    {
      id: "8",
      name: "Ubisoft Connect",
      url: `https://store.ubisoft.com/fr/search?q=${encodedTitle}`,
      type: "purchase",
      category: "vod",
      logo: "/platforms/ubisoft.png",
      isAvailable: mediaId === "9"
    }
  ];
}
