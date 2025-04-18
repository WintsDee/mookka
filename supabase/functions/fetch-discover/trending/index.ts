
import { corsHeaders } from '../../fetch-news/cors.ts';

// Mock trending media data
const trendingMedia = [
  {
    id: "1",
    title: "Dune: Part Two",
    type: "film",
    coverImage: "https://image.tmdb.org/t/p/w500/5RuYXjdebUVySNLmvGAI5OdAoyw.jpg",
    year: 2024,
    rating: 8.6,
    genres: ["Science Fiction", "Adventure", "Drama"],
    description: "Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family."
  },
  {
    id: "2",
    title: "Haikyu!! The Dumpster Battle",
    type: "film",
    coverImage: "https://image.tmdb.org/t/p/w500/ygouafWPdCZ2stQTDRxJ6Mlj8LJ.jpg",
    year: 2024,
    rating: 8.9,
    genres: ["Animation", "Drama", "Action"]
  },
  {
    id: "3",
    title: "Fallout",
    type: "serie",
    coverImage: "https://image.tmdb.org/t/p/w500/xcXAWtRfp4loudFWiIlAftm8SjF.jpg",
    year: 2024,
    rating: 8.4,
    genres: ["Sci-Fi & Fantasy", "Action & Adventure", "Drama"]
  },
  {
    id: "4",
    title: "Challengers",
    type: "film",
    coverImage: "https://image.tmdb.org/t/p/w500/2ezHjV9U2lci9fHBZhsUCZrCCUb.jpg",
    year: 2024,
    rating: 7.5,
    genres: ["Drama", "Romance"]
  },
  {
    id: "5",
    title: "Shogun",
    type: "serie",
    coverImage: "https://image.tmdb.org/t/p/w500/AnRReWt5HBMMFD6eCU6weWkSBmn.jpg",
    year: 2024,
    rating: 8.8,
    genres: ["Drama", "War & Politics"]
  },
  {
    id: "6",
    title: "Demon Slayer: Kimetsu no Yaiba",
    type: "serie",
    coverImage: "https://image.tmdb.org/t/p/w500/xUfRZu2mi8jH6SzQEJGP6tjBuYj.jpg",
    year: 2023,
    rating: 8.7,
    genres: ["Animation", "Action & Adventure", "Fantasy"]
  },
  {
    id: "7",
    title: "Final Fantasy VII Rebirth",
    type: "game",
    coverImage: "https://media.rawg.io/media/games/6ad/6add7eb18ad2608c20d9bf238f73e7dd.jpg",
    year: 2024,
    rating: 9.2,
    genres: ["RPG", "Action", "Adventure"],
    platform: "PlayStation 5",
    publisher: "Square Enix"
  },
  {
    id: "8",
    title: "The Boys: Season 4",
    type: "serie",
    coverImage: "https://image.tmdb.org/t/p/w500/mPkGFtBUgRJVJRoByBgpElPXwEI.jpg",
    year: 2024,
    rating: 8.5,
    genres: ["Sci-Fi & Fantasy", "Action & Adventure", "Comedy"]
  }
];

// Cache for 15 minutes
let cachedData = null;
let lastFetchTime = 0;
const CACHE_DURATION = 15 * 60 * 1000;

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
      console.log("Using cached trending media data");
      media = cachedData;
    } else {
      console.log("Fetching fresh trending media data");
      // In a real implementation, we would fetch from TMDb or other APIs here
      media = trendingMedia;
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
    console.error("Error in trending media function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
