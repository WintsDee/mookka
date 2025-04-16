
import { MediaType } from "@/types";
import { Platform } from "./types";

export function generatePlatformData(mediaId: string, mediaType: MediaType, title: string): Platform[] {
  const encodedTitle = encodeURIComponent(title);
  let platforms: Platform[] = [];
  
  if (mediaType === "film" || mediaType === "serie") {
    platforms = [
      { 
        id: "1", 
        name: "Netflix", 
        url: `https://www.netflix.com/search?q=${encodedTitle}`, 
        type: "streaming", 
        category: "subscription",
        logo: "/platforms/netflix.png",
        isAvailable: mediaId === "1" || mediaId === "2" // Exemple basé sur l'ID du média
      },
      { 
        id: "2", 
        name: "Amazon Prime Video", 
        url: `https://www.primevideo.com/search/ref=atv_sr_sug_4?phrase=${encodedTitle}`, 
        type: "streaming", 
        category: "subscription",
        logo: "/platforms/prime.png",
        isAvailable: mediaId === "2" || mediaId === "3"
      },
      { 
        id: "3", 
        name: "Disney+", 
        url: `https://www.disneyplus.com/fr-fr/search?q=${encodedTitle}`, 
        type: "streaming", 
        category: "subscription",
        logo: "/platforms/disney.png",
        isAvailable: mediaId === "1"
      },
      { 
        id: "4", 
        name: "Canal+", 
        url: `https://www.canalplus.com/recherche?q=${encodedTitle}`, 
        type: "streaming", 
        category: "subscription",
        logo: "/platforms/canal.png",
        isAvailable: false
      },
      { 
        id: "5", 
        name: "Google Play Films", 
        url: `https://play.google.com/store/search?q=${encodedTitle}&c=movies`, 
        type: "purchase", 
        category: "vod",
        logo: "/platforms/google-play.png",
        isAvailable: true
      },
      { 
        id: "6", 
        name: "Apple TV", 
        url: `https://tv.apple.com/fr/search?term=${encodedTitle}`, 
        type: "streaming", 
        category: "subscription",
        logo: "/platforms/apple-tv.png",
        isAvailable: mediaId === "3"
      },
      {
        id: "7",
        name: "Molotov TV",
        url: `https://www.molotov.tv/search?search=${encodedTitle}`,
        type: "streaming",
        category: "free",
        logo: "/platforms/molotov.png",
        isAvailable: mediaId === "2"
      },
      {
        id: "8",
        name: "OCS",
        url: `https://www.ocs.fr/recherche?q=${encodedTitle}`,
        type: "streaming",
        category: "subscription",
        logo: "/platforms/ocs.png",
        isAvailable: mediaId === "2"
      },
      {
        id: "9",
        name: "YouTube",
        url: `https://www.youtube.com/results?search_query=${encodedTitle}+film+complet`,
        type: "purchase",
        category: "vod",
        logo: "/platforms/youtube.png",
        isAvailable: true
      },
      {
        id: "10",
        name: "Rakuten TV",
        url: `https://www.rakuten.tv/fr/search?q=${encodedTitle}`,
        type: "purchase",
        category: "vod",
        logo: "/platforms/rakuten.png",
        isAvailable: mediaId === "1"
      }
    ];
  } else if (mediaType === "book") {
    platforms = [
      { 
        id: "1", 
        name: "Amazon", 
        url: `https://www.amazon.fr/s?k=${encodedTitle}&i=stripbooks`, 
        type: "purchase", 
        logo: "/platforms/amazon.png",
        isAvailable: true
      },
      { 
        id: "2", 
        name: "Fnac", 
        url: `https://www.fnac.com/SearchResult/ResultList.aspx?Search=${encodedTitle}&Category=2`, 
        type: "purchase", 
        logo: "/platforms/fnac.png",
        isAvailable: true
      },
      { 
        id: "3", 
        name: "Cultura", 
        url: `https://www.cultura.com/catalogsearch/result/?q=${encodedTitle}`, 
        type: "purchase", 
        logo: "/platforms/cultura.png",
        isAvailable: mediaId === "5"
      },
      { 
        id: "4", 
        name: "Kobo", 
        url: `https://www.kobo.com/fr/fr/search?query=${encodedTitle}`, 
        type: "purchase", 
        logo: "/platforms/kobo.png",
        isAvailable: mediaId === "4"
      },
      { 
        id: "5", 
        name: "Google Play Livres", 
        url: `https://play.google.com/store/search?q=${encodedTitle}&c=books`, 
        type: "purchase", 
        logo: "/platforms/google-play.png",
        isAvailable: true
      },
      {
        id: "6",
        name: "Decitre",
        url: `https://www.decitre.fr/rechercher/result?q=${encodedTitle}`,
        type: "purchase",
        logo: "/platforms/decitre.png",
        isAvailable: mediaId === "4"
      },
      {
        id: "7",
        name: "Gallimard",
        url: `https://www.gallimard.fr/Catalogue/recherche?q=${encodedTitle}`,
        type: "purchase",
        logo: "/platforms/gallimard.png",
        isAvailable: mediaId === "6"
      }
    ];
  } else if (mediaType === "game") {
    platforms = [
      { 
        id: "1", 
        name: "Steam", 
        url: `https://store.steampowered.com/search/?term=${encodedTitle}&lang=french`, 
        type: "purchase", 
        logo: "/platforms/steam.png",
        isAvailable: true 
      },
      { 
        id: "2", 
        name: "Epic Games Store", 
        url: `https://store.epicgames.com/fr/browse?q=${encodedTitle}&sortBy=relevancy&sortDir=DESC&lang=fr`, 
        type: "purchase", 
        logo: "/platforms/epic.png",
        isAvailable: mediaId === "8"
      },
      { 
        id: "3", 
        name: "PlayStation Store", 
        url: `https://store.playstation.com/fr-fr/search/${encodedTitle}`, 
        type: "purchase", 
        logo: "/platforms/playstation.png",
        isAvailable: mediaId === "7" || mediaId === "9" 
      },
      { 
        id: "4", 
        name: "Xbox Store", 
        url: `https://www.xbox.com/fr-FR/games/all-games?q=${encodedTitle}`, 
        type: "purchase", 
        logo: "/platforms/xbox.png",
        isAvailable: mediaId === "7"
      },
      { 
        id: "5", 
        name: "Nintendo eShop", 
        url: `https://www.nintendo.fr/Rechercher/Rechercher-299117.html?q=${encodedTitle}`, 
        type: "purchase", 
        logo: "/platforms/nintendo.png",
        isAvailable: mediaId === "8"
      },
      {
        id: "6",
        name: "GOG",
        url: `https://www.gog.com/fr/games?query=${encodedTitle}`,
        type: "purchase",
        logo: "/platforms/gog.png",
        isAvailable: false
      },
      {
        id: "7",
        name: "Humble Bundle",
        url: `https://www.humblebundle.com/store/search?sort=bestselling&search=${encodedTitle}`,
        type: "purchase",
        logo: "/platforms/humble.png",
        isAvailable: false
      },
      {
        id: "8",
        name: "Ubisoft Connect",
        url: `https://store.ubisoft.com/fr/search?q=${encodedTitle}`,
        type: "purchase",
        logo: "/platforms/ubisoft.png",
        isAvailable: mediaId === "9"
      }
    ];
  }
  
  return platforms;
}
