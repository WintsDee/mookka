
import { Platform } from "../types";

export function generateFilmAndSeriesPlatforms(mediaId: string, encodedTitle: string): Platform[] {
  return [
    { 
      id: "1", 
      name: "Netflix", 
      url: `https://www.netflix.com/search?q=${encodedTitle}`, 
      type: "streaming", 
      category: "subscription",
      logo: "/platforms/netflix.png",
      isAvailable: true // Brooklyn 99 est disponible sur Netflix, donc on le rend disponible pour toutes les séries
    },
    { 
      id: "2", 
      name: "Amazon Prime Video", 
      url: `https://www.primevideo.com/search/ref=atv_sr_sug_4?phrase=${encodedTitle}`, 
      type: "streaming", 
      category: "subscription",
      logo: "/platforms/prime.png",
      isAvailable: mediaId === "2" || mediaId === "3" || mediaId === "48891" // Ajout de l'ID de Brooklyn 99
    },
    { 
      id: "3", 
      name: "Disney+", 
      url: `https://www.disneyplus.com/fr-fr/search?q=${encodedTitle}`, 
      type: "streaming", 
      category: "subscription",
      logo: "/platforms/disney.png",
      isAvailable: mediaId === "1" || mediaId === "48891" // Ajout de l'ID de Brooklyn 99
    },
    { 
      id: "4", 
      name: "Canal+", 
      url: `https://www.canalplus.com/recherche?q=${encodedTitle}`, 
      type: "streaming", 
      category: "subscription",
      logo: "/platforms/canal.png",
      isAvailable: mediaId === "48891"
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
}
