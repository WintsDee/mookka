
import { corsHeaders } from '../../fetch-news/cors.ts';

// Mock upcoming media data
const upcomingMedia = [
  {
    id: "10",
    title: "Furiosa: A Mad Max Saga",
    type: "film",
    coverImage: "https://image.tmdb.org/t/p/w500/9w9kvA9jvJVS8GS1SgGHwfqw1fb.jpg",
    year: 2024,
    rating: null,
    genres: ["Action", "Adventure", "Science Fiction"],
    releaseDate: "2024-05-24"
  },
  {
    id: "11",
    title: "Kingdom of the Planet of the Apes",
    type: "film",
    coverImage: "https://image.tmdb.org/t/p/w500/qtGtlpWoqFSvFXMGKjuD8JVzSbt.jpg",
    year: 2024,
    rating: null,
    genres: ["Science Fiction", "Adventure", "Action"],
    releaseDate: "2024-05-10"
  },
  {
    id: "12",
    title: "House of the Dragon: Season 2",
    type: "serie",
    coverImage: "https://image.tmdb.org/t/p/w500/xiB0hsxMpgxpJfuaJRFipfCRe7K.jpg",
    year: 2024,
    rating: null,
    genres: ["Sci-Fi & Fantasy", "Drama", "Action & Adventure"],
    releaseDate: "2024-06-16"
  },
  {
    id: "13",
    title: "Black Myth: Wukong",
    type: "game",
    coverImage: "https://media.rawg.io/media/games/baf/baf9905270314e07e6850cffdb51df91.jpg",
    year: 2024,
    rating: null,
    genres: ["Action", "RPG", "Adventure"],
    platform: "PC, PlayStation 5, Xbox Series X|S",
    releaseDate: "2024-08-20"
  },
  {
    id: "14",
    title: "Dragon Age: The Veilguard",
    type: "game",
    coverImage: "https://media.rawg.io/media/games/d3c/d3c7883268e86bc578574396298ecb03.jpg",
    year: 2024,
    rating: null,
    genres: ["RPG", "Action", "Adventure"],
    platform: "PC, PlayStation 5, Xbox Series X|S",
    releaseDate: "2024-Fall"
  },
  {
    id: "15",
    title: "A Court of Thorns and Roses",
    type: "book",
    coverImage: "https://m.media-amazon.com/images/I/91uZT+jyyqL._AC_UF1000,1000_QL80_.jpg",
    year: 2024,
    rating: null,
    genres: ["Fantasy", "Romance", "Young Adult"],
    author: "Sarah J. Maas",
    releaseDate: "2024-07-02"
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
    
    // Get media type filter from request body
    let mediaType = undefined;
    if (req.method === 'POST') {
      try {
        const body = await req.json();
        mediaType = body.type;
      } catch (e) {
        // Ignore parse errors
      }
    }
    
    // Use cached data if available and not forcing refresh
    if (!forceRefresh && cachedData && (currentTime - lastFetchTime < CACHE_DURATION)) {
      console.log("Using cached upcoming media data");
      media = cachedData;
    } else {
      console.log("Fetching fresh upcoming media data");
      // In a real implementation, we would fetch from TMDb or other APIs here
      media = upcomingMedia;
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
    console.error("Error in upcoming media function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
