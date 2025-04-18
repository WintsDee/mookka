
import { corsHeaders } from '../../fetch-news/cors.ts';

// Mock recommended media data
const recommendedMedia = [
  {
    id: "20",
    title: "Loki",
    type: "serie",
    coverImage: "https://image.tmdb.org/t/p/w500/rqDRC3j9vxQ0YPCcRWVajwgXWth.jpg",
    year: 2023,
    rating: 8.2,
    genres: ["Sci-Fi & Fantasy", "Action & Adventure", "Drama"]
  },
  {
    id: "21",
    title: "Severance",
    type: "serie",
    coverImage: "https://image.tmdb.org/t/p/w500/a3sYVoFHNOnO1gA13b1Q0PilXHF.jpg",
    year: 2022,
    rating: 8.7,
    genres: ["Drama", "Mystery", "Sci-Fi & Fantasy"]
  },
  {
    id: "22",
    title: "Longlegs",
    type: "film",
    coverImage: "https://image.tmdb.org/t/p/w500/ulhFOP93oR5ME9C8oMecviO7I6p.jpg",
    year: 2024,
    rating: 7.5,
    genres: ["Horror", "Mystery", "Thriller"]
  },
  {
    id: "23",
    title: "Red Dead Redemption 2",
    type: "game",
    coverImage: "https://media.rawg.io/media/games/511/5118aff5091cb3efec399c808f8c598f.jpg",
    year: 2018,
    rating: 9.6,
    genres: ["Action", "Adventure", "RPG"],
    platform: "PlayStation 4, Xbox One, PC"
  },
  {
    id: "24",
    title: "Elden Ring",
    type: "game",
    coverImage: "https://media.rawg.io/media/games/5ec/5ecac5cb026ec26a56efcc546364e348.jpg",
    year: 2022,
    rating: 9.3,
    genres: ["Action", "RPG", "Adventure"],
    platform: "PlayStation 5, Xbox Series X|S, PC"
  },
  {
    id: "25",
    title: "The Song of Achilles",
    type: "book",
    coverImage: "https://m.media-amazon.com/images/I/71Jn6neVFHL._AC_UF1000,1000_QL80_.jpg",
    year: 2012,
    rating: 8.8,
    genres: ["Historical Fiction", "Fantasy", "LGBTQ+"],
    author: "Madeline Miller"
  }
];

// Cache for 30 minutes
let cachedData = null;
let lastFetchTime = 0;
const CACHE_DURATION = 30 * 60 * 1000;

// Main handler
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  try {
    const currentTime = Date.now();
    let media = [];
    
    // Check if we need to refresh the cache
    const url = new URL(req.url);
    const forceRefresh = url.searchParams.get('refresh') === 'true';
    
    // Get parameters from request body
    let userId = undefined;
    let mediaType = undefined;
    if (req.method === 'POST') {
      try {
        const body = await req.json();
        userId = body.userId;
        mediaType = body.mediaType;
      } catch (e) {
        // Ignore parse errors
      }
    }
    
    // Use cached data if available and not forcing refresh
    if (!forceRefresh && cachedData && (currentTime - lastFetchTime < CACHE_DURATION)) {
      console.log("Using cached recommended media data");
      media = cachedData;
    } else {
      console.log("Fetching fresh recommended media data");
      // In a real implementation, we would use the user's preferences to generate recommendations
      // For now, return mock data
      media = recommendedMedia;
      cachedData = media;
      lastFetchTime = currentTime;
    }
    
    // Apply media type filter
    if (mediaType) {
      media = media.filter(item => item.type === mediaType);
    }
    
    return new Response(
      JSON.stringify({
        media
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in recommended media function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
