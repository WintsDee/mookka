
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8'
import { corsHeaders } from './cors.ts';

// Cache for 30 minutes
let cachedSections = null;
let lastFetchTime = 0;
const CACHE_DURATION = 30 * 60 * 1000;

// Types
interface DiscoverySection {
  id: string;
  title: string;
  type: 'trending' | 'new' | 'upcoming' | 'recommended' | 'genre' | 'popular';
  mediaType?: string;
  genre?: string;
  items: any[];
}

// Function to fetch trending media
async function fetchTrendingMedia(type?: string): Promise<any[]> {
  // This would normally call external APIs like TMDB, RAWG, etc.
  // For now, return mock data
  const mockTrending = [
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
  
  // Filter by type if provided
  if (type) {
    return mockTrending.filter(item => item.type === type);
  }
  
  return mockTrending;
}

// Function to fetch upcoming media
async function fetchUpcomingMedia(type?: string): Promise<any[]> {
  // Mock data for upcoming media
  const mockUpcoming = [
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
  
  // Filter by type if provided
  if (type) {
    return mockUpcoming.filter(item => item.type === type);
  }
  
  return mockUpcoming;
}

// Function to fetch recommended media based on user preferences
async function fetchRecommendedMedia(userId?: string, mediaType?: string): Promise<any[]> {
  // Mock recommended media
  const mockRecommended = [
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
  
  // Filter by type if provided
  if (mediaType) {
    return mockRecommended.filter(item => item.type === mediaType);
  }
  
  return mockRecommended;
}

// Function to generate discovery sections
async function generateDiscoverySections(): Promise<DiscoverySection[]> {
  try {
    // Here we would normally fetch data from various APIs
    // For demo, we'll create mock sections
    
    const [trendingMedia, upcomingMedia, recommendedMedia] = await Promise.all([
      fetchTrendingMedia(),
      fetchUpcomingMedia(),
      fetchRecommendedMedia()
    ]);
    
    const sections: DiscoverySection[] = [
      {
        id: 'trending',
        title: 'Tendances',
        type: 'trending',
        items: trendingMedia
      },
      {
        id: 'upcoming',
        title: 'À venir',
        type: 'upcoming',
        items: upcomingMedia
      },
      {
        id: 'recommended',
        title: 'Recommandés pour vous',
        type: 'recommended',
        items: recommendedMedia
      },
      {
        id: 'popular-books',
        title: 'Livres populaires',
        type: 'popular',
        mediaType: 'book',
        items: [
          {
            id: "30",
            title: "Fourth Wing",
            type: "book",
            coverImage: "https://m.media-amazon.com/images/I/917Bc9C1MlL._AC_UF1000,1000_QL80_.jpg",
            year: 2023,
            rating: 8.7,
            genres: ["Fantasy", "Romance", "New Adult"],
            author: "Rebecca Yarros"
          },
          {
            id: "31",
            title: "The Covenant of Water",
            type: "book",
            coverImage: "https://m.media-amazon.com/images/I/51LyIUngr5L._SX327_BO1,204,203,200_.jpg",
            year: 2023,
            rating: 9.1,
            genres: ["Literary Fiction", "Historical Fiction"],
            author: "Abraham Verghese"
          },
          {
            id: "32",
            title: "Tomorrow, and Tomorrow, and Tomorrow",
            type: "book",
            coverImage: "https://m.media-amazon.com/images/I/71w1fu+XdNL._AC_UF1000,1000_QL80_.jpg",
            year: 2022,
            rating: 8.9,
            genres: ["Literary Fiction", "Contemporary"],
            author: "Gabrielle Zevin"
          },
          {
            id: "33",
            title: "Iron Flame",
            type: "book",
            coverImage: "https://m.media-amazon.com/images/I/91zv8G+eFiL._AC_UF1000,1000_QL80_.jpg",
            year: 2023,
            rating: 8.8,
            genres: ["Fantasy", "Romance"],
            author: "Rebecca Yarros"
          }
        ]
      },
      {
        id: 'popular-games',
        title: 'Jeux populaires',
        type: 'popular',
        mediaType: 'game',
        items: [
          {
            id: "40",
            title: "Baldur's Gate 3",
            type: "game",
            coverImage: "https://media.rawg.io/media/games/f99/f9979698c43fd84c3ab69280576dd3af.jpg",
            year: 2023,
            rating: 9.5,
            genres: ["RPG", "Adventure", "Strategy"],
            platform: "PC, PlayStation 5"
          },
          {
            id: "41",
            title: "Helldivers 2",
            type: "game",
            coverImage: "https://media.rawg.io/media/games/947/947f1266f6d2a0654c655aa1a96a4cfa.jpg",
            year: 2024,
            rating: 8.7,
            genres: ["Action", "Shooter", "Cooperative"],
            platform: "PC, PlayStation 5"
          },
          {
            id: "42",
            title: "The Last of Us Part II",
            type: "game",
            coverImage: "https://media.rawg.io/media/games/909/909fed43e4603a8f6616a61afc7e6af5.jpg",
            year: 2020,
            rating: 9.2,
            genres: ["Action", "Adventure", "Shooter"],
            platform: "PlayStation 4, PlayStation 5"
          }
        ]
      },
      {
        id: 'genre-scifi',
        title: 'Science-Fiction',
        type: 'genre',
        genre: 'Science Fiction',
        items: [
          {
            id: "50",
            title: "Dune: Part Two",
            type: "film",
            coverImage: "https://image.tmdb.org/t/p/w500/5RuYXjdebUVySNLmvGAI5OdAoyw.jpg",
            year: 2024,
            rating: 8.6,
            genres: ["Science Fiction", "Adventure", "Drama"]
          },
          {
            id: "51",
            title: "Foundation",
            type: "serie",
            coverImage: "https://image.tmdb.org/t/p/w500/5yF6MoJ8HPyVJwp7HSwILbXz0K5.jpg",
            year: 2021,
            rating: 8.0,
            genres: ["Sci-Fi & Fantasy", "Drama"]
          },
          {
            id: "52",
            title: "Starfield",
            type: "game",
            coverImage: "https://media.rawg.io/media/games/eda/edaa749997ca571aadca01a4c695e4ca.jpg",
            year: 2023,
            rating: 7.8,
            genres: ["RPG", "Adventure", "Action"],
            platform: "PC, Xbox Series X|S"
          },
          {
            id: "53",
            title: "Sea of Tranquility",
            type: "book",
            coverImage: "https://m.media-amazon.com/images/I/71P+43Z+dWL._AC_UF1000,1000_QL80_.jpg",
            year: 2022,
            rating: 8.9,
            genres: ["Science Fiction", "Literary Fiction"],
            author: "Emily St. John Mandel"
          }
        ]
      }
    ];
    
    return sections;
  } catch (error) {
    console.error("Error generating discovery sections:", error);
    return [];
  }
}

// Main handler for the edge function
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  try {
    const currentTime = Date.now();
    let sections;
    
    const url = new URL(req.url);
    // Force refresh if query parameter is present
    const forceRefresh = url.searchParams.get('refresh') === 'true';
    
    // Check if we need to fetch new data or can use cached data
    if (forceRefresh || !cachedSections || (currentTime - lastFetchTime > CACHE_DURATION)) {
      console.log("Fetching fresh discovery data");
      sections = await generateDiscoverySections();
      
      // Only update cache if we got data
      if (sections.length > 0) {
        cachedSections = sections;
        lastFetchTime = currentTime;
      } else if (cachedSections) {
        // Use cached data if fetch failed
        sections = cachedSections;
      }
    } else {
      // Use cached data
      console.log("Using cached discovery data");
      sections = cachedSections;
    }
    
    return new Response(
      JSON.stringify({
        sections: sections || []
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in discovery function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
