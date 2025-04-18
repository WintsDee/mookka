
import { Platform } from "../types";

export function generateFilmAndSeriesPlatforms(mediaId: string, encodedTitle: string): Platform[] {
  // Base platforms available to most content
  const basePlatforms: Platform[] = [
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
  
  // Enhanced streaming platforms with conditional availability
  const streamingPlatforms: Platform[] = [
    { 
      id: "1", 
      name: "Netflix", 
      url: `https://www.netflix.com/search?q=${encodedTitle}`, 
      type: "streaming", 
      category: "subscription",
      logo: "/platforms/netflix.png",
      isAvailable: availabilityMap["netflix"] || false,
      pricing: {
        type: "subscription",
        plans: ["Standard", "Premium"],
        startingPrice: "8.99€/mois"
      }
    },
    { 
      id: "2", 
      name: "Amazon Prime Video", 
      url: `https://www.primevideo.com/search/ref=atv_sr_sug_4?phrase=${encodedTitle}`, 
      type: "streaming", 
      category: "subscription",
      logo: "/platforms/prime.png",
      isAvailable: availabilityMap["prime"] || false,
      pricing: {
        type: "subscription",
        plans: ["Prime Video"],
        startingPrice: "6.99€/mois"
      }
    },
    { 
      id: "3", 
      name: "Disney+", 
      url: `https://www.disneyplus.com/fr-fr/search?q=${encodedTitle}`, 
      type: "streaming", 
      category: "subscription",
      logo: "/platforms/disney.png",
      isAvailable: availabilityMap["disney"] || false,
      pricing: {
        type: "subscription",
        plans: ["Standard", "Premium"],
        startingPrice: "8.99€/mois"
      }
    },
    { 
      id: "4", 
      name: "Canal+", 
      url: `https://www.canalplus.com/recherche?q=${encodedTitle}`, 
      type: "streaming", 
      category: "subscription",
      logo: "/platforms/canal.png",
      isAvailable: availabilityMap["canal"] || false,
      pricing: {
        type: "subscription",
        plans: ["Canal+", "Canal+ Ciné Séries"],
        startingPrice: "20.99€/mois"
      }
    },
    { 
      id: "6", 
      name: "Apple TV", 
      url: `https://tv.apple.com/fr/search?term=${encodedTitle}`, 
      type: "streaming", 
      category: "subscription",
      logo: "/platforms/apple-tv.png",
      isAvailable: availabilityMap["apple"] || false,
      pricing: {
        type: "subscription",
        plans: ["Apple TV+"],
        startingPrice: "9.99€/mois"
      }
    },
    {
      id: "7",
      name: "Molotov TV",
      url: `https://www.molotov.tv/search?search=${encodedTitle}`,
      type: "streaming",
      category: "free",
      logo: "/platforms/molotov.png",
      isAvailable: availabilityMap["molotov"] || false,
      pricing: {
        type: "freemium",
        plans: ["Gratuit", "Extended", "Premium"],
        startingPrice: "0€"
      }
    },
    {
      id: "8",
      name: "OCS",
      url: `https://www.ocs.fr/recherche?q=${encodedTitle}`,
      type: "streaming",
      category: "subscription",
      logo: "/platforms/ocs.png",
      isAvailable: availabilityMap["ocs"] || false,
      pricing: {
        type: "subscription",
        plans: ["OCS"],
        startingPrice: "10.99€/mois"
      }
    },
    {
      id: "10",
      name: "Rakuten TV",
      url: `https://www.rakuten.tv/fr/search?q=${encodedTitle}`,
      type: "purchase",
      category: "vod",
      logo: "/platforms/rakuten.png",
      isAvailable: availabilityMap["rakuten"] || false,
      pricing: {
        type: "pay-per-view",
        plans: ["Location", "Achat"],
        startingPrice: "3.99€"
      }
    }
  ];
  
  return [...streamingPlatforms, ...basePlatforms];
}
