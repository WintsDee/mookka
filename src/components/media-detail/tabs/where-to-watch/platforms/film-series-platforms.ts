import { Platform } from "../types";

export function generateFilmAndSeriesPlatforms(mediaId: string, encodedTitle: string): Platform[] {
  // Base platforms available to most content
  const basePlatforms = [
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
      id: "9",
      name: "YouTube",
      url: `https://www.youtube.com/results?search_query=${encodedTitle}+film+complet`,
      type: "purchase",
      category: "vod",
      logo: "/platforms/youtube.png",
      isAvailable: true
    }
  ];
  
  // Platform availability per specific content ID
  const platformAvailabilityMap: Record<string, Record<string, boolean>> = {
    // Brooklyn Nine-Nine (ID: 48891)
    "48891": {
      "netflix": true,
      "prime": false,
      "disney": false,
      "canal": true,
      "apple": false,
      "molotov": false,
      "ocs": false,
      "rakuten": false
    },
    // Other example IDs
    "1": {
      "netflix": false,
      "prime": false,
      "disney": true,
      "canal": false,
      "apple": false,
      "molotov": false,
      "ocs": false,
      "rakuten": true
    },
    "2": {
      "netflix": false,
      "prime": true,
      "disney": false,
      "canal": false,
      "apple": false,
      "molotov": true,
      "ocs": true,
      "rakuten": false
    },
    "3": {
      "netflix": false,
      "prime": true,
      "disney": false,
      "canal": false,
      "apple": true,
      "molotov": false,
      "ocs": false,
      "rakuten": false
    }
  };
  
  // Get availability map for this specific media, or use empty map if not found
  const availabilityMap = platformAvailabilityMap[mediaId] || {};
  
  // Streaming platforms with conditional availability
  const streamingPlatforms = [
    { 
      id: "1", 
      name: "Netflix", 
      url: `https://www.netflix.com/search?q=${encodedTitle}`, 
      type: "streaming", 
      category: "subscription",
      logo: "/platforms/netflix.png",
      isAvailable: availabilityMap["netflix"] || false
    },
    { 
      id: "2", 
      name: "Amazon Prime Video", 
      url: `https://www.primevideo.com/search/ref=atv_sr_sug_4?phrase=${encodedTitle}`, 
      type: "streaming", 
      category: "subscription",
      logo: "/platforms/prime.png",
      isAvailable: availabilityMap["prime"] || false
    },
    { 
      id: "3", 
      name: "Disney+", 
      url: `https://www.disneyplus.com/fr-fr/search?q=${encodedTitle}`, 
      type: "streaming", 
      category: "subscription",
      logo: "/platforms/disney.png",
      isAvailable: availabilityMap["disney"] || false
    },
    { 
      id: "4", 
      name: "Canal+", 
      url: `https://www.canalplus.com/recherche?q=${encodedTitle}`, 
      type: "streaming", 
      category: "subscription",
      logo: "/platforms/canal.png",
      isAvailable: availabilityMap["canal"] || false
    },
    { 
      id: "6", 
      name: "Apple TV", 
      url: `https://tv.apple.com/fr/search?term=${encodedTitle}`, 
      type: "streaming", 
      category: "subscription",
      logo: "/platforms/apple-tv.png",
      isAvailable: availabilityMap["apple"] || false
    },
    {
      id: "7",
      name: "Molotov TV",
      url: `https://www.molotov.tv/search?search=${encodedTitle}`,
      type: "streaming",
      category: "free",
      logo: "/platforms/molotov.png",
      isAvailable: availabilityMap["molotov"] || false
    },
    {
      id: "8",
      name: "OCS",
      url: `https://www.ocs.fr/recherche?q=${encodedTitle}`,
      type: "streaming",
      category: "subscription",
      logo: "/platforms/ocs.png",
      isAvailable: availabilityMap["ocs"] || false
    },
    {
      id: "10",
      name: "Rakuten TV",
      url: `https://www.rakuten.tv/fr/search?q=${encodedTitle}`,
      type: "purchase",
      category: "vod",
      logo: "/platforms/rakuten.png",
      isAvailable: availabilityMap["rakuten"] || false
    }
  ];
  
  // Combine the base platforms with the conditionally available streaming platforms
  return [...streamingPlatforms, ...basePlatforms];
}
