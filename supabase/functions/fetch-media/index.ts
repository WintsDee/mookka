import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8'
import { corsHeaders } from './cors.ts'
import { fetchTrendingFilms, fetchFilmById } from './media-handlers/films.ts'
import { fetchTrendingSeries, fetchSerieById } from './media-handlers/series.ts'
import { fetchTrendingBooks, fetchBookById } from './media-handlers/books.ts'
import { fetchTrendingGames, fetchGameById } from './media-handlers/games.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { type, query, id, categories } = await req.json()

    // Handle new releases request type
    if (type === "new-releases") {
      console.log("Processing new releases request for categories:", categories);
      const allNewReleases = []
      
      const currentDate = new Date();
      const oneMonthAgo = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
      
      for (const category of categories) {
        console.log(`Fetching new releases for ${category}`);
        
        switch (category) {
          case 'film':
            const filmResponse = await fetch(
              `https://api.themoviedb.org/3/movie/now_playing?api_key=${Deno.env.get('TMDB_API_KEY')}&language=fr-FR&page=1`
            );
            const filmData = await filmResponse.json();
            allNewReleases.push(...(filmData.results || []).map((item: any) => ({
              id: item.id,
              title: item.title,
              type: 'film',
              coverImage: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
              year: item.release_date ? parseInt(item.release_date.substring(0, 4)) : null,
              rating: item.vote_average,
              releaseDate: item.release_date,
              popularity: item.popularity
            })));
            break;
            
          case 'serie':
            const serieResponse = await fetch(
              `https://api.themoviedb.org/3/tv/on_the_air?api_key=${Deno.env.get('TMDB_API_KEY')}&language=fr-FR&page=1`
            );
            const serieData = await serieResponse.json();
            allNewReleases.push(...(serieData.results || []).map((item: any) => ({
              id: item.id,
              title: item.name,
              type: 'serie',
              coverImage: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
              year: item.first_air_date ? parseInt(item.first_air_date.substring(0, 4)) : null,
              rating: item.vote_average,
              releaseDate: item.first_air_date,
              popularity: item.popularity
            })));
            break;
            
          case 'book':
            const bookResponse = await fetch(
              `https://www.googleapis.com/books/v1/volumes?q=subject:fiction&orderBy=newest&maxResults=10&key=${Deno.env.get('GOOGLE_BOOKS_API_KEY')}`
            );
            const bookData = await bookResponse.json();
            allNewReleases.push(...(bookData.items || []).map((item: any) => ({
              id: item.id,
              title: item.volumeInfo?.title,
              type: 'book',
              coverImage: item.volumeInfo?.imageLinks?.thumbnail || '/placeholder.svg',
              year: item.volumeInfo?.publishedDate ? parseInt(item.volumeInfo.publishedDate.substring(0, 4)) : null,
              author: item.volumeInfo?.authors?.[0],
              rating: item.volumeInfo?.averageRating ? item.volumeInfo.averageRating * 2 : null,
              releaseDate: item.volumeInfo?.publishedDate,
              popularity: (item.volumeInfo?.averageRating || 0) * ((item.volumeInfo?.ratingsCount || 0) + 1) * 10
            })));
            break;
            
          case 'game':
            const today = new Date().toISOString().split('T')[0];
            const monthAgo = oneMonthAgo.toISOString().split('T')[0];
            const gameResponse = await fetch(
              `https://api.rawg.io/api/games?key=${Deno.env.get('RAWG_API_KEY')}&dates=${monthAgo},${today}&ordering=-released&page_size=10`
            );
            const gameData = await gameResponse.json();
            allNewReleases.push(...(gameData.results || []).map((item: any) => ({
              id: item.id,
              title: item.name,
              type: 'game',
              coverImage: item.background_image,
              year: item.released ? parseInt(item.released.substring(0, 4)) : null,
              rating: item.rating,
              releaseDate: item.released,
              popularity: item.ratings_count * (item.rating || 1)
            })));
            break;
        }
      }
      
      // Trier par date de sortie (le plus récent d'abord)
      const sortedReleases = allNewReleases
        .filter(item => item.releaseDate) // Garder seulement les items avec une date
        .sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
      
      // Équilibrer les types de médias (assurer au moins 2 de chaque type si disponible)
      const balancedResults = balanceMediaTypes(sortedReleases, categories);
      
      console.log(`Returning ${balancedResults.length} new releases`);
      
      return new Response(JSON.stringify({ results: balancedResults }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    // Handle trending request type
    if (type === "trending") {
      console.log("Processing trending request for categories:", categories);
      const allTrendingResults = []
      
      // Récupérer tous les médias tendance par catégorie
      for (const category of categories) {
        console.log(`Fetching trending ${category} items`);
        
        switch (category) {
          case 'film':
            allTrendingResults.push(...await fetchTrendingFilms(Deno.env.get('TMDB_API_KEY') ?? ''))
            break
            
          case 'serie':
            allTrendingResults.push(...await fetchTrendingSeries(Deno.env.get('TMDB_API_KEY') ?? ''))
            break
            
          case 'book':
            allTrendingResults.push(...await fetchTrendingBooks(Deno.env.get('GOOGLE_BOOKS_API_KEY') ?? ''))
            break
            
          case 'game':
            allTrendingResults.push(...await fetchTrendingGames(Deno.env.get('RAWG_API_KEY') ?? ''))
            break
        }
      }
      
      // Trier par popularité
      const sortedResults = allTrendingResults.sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      
      // Équilibrer les types de médias (assurer au moins 2 de chaque type si disponible)
      const balancedResults = balanceMediaTypes(sortedResults, categories)
      
      console.log(`Returning ${balancedResults.length} trending items`);
      
      return new Response(JSON.stringify({ results: balancedResults }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    // Handle individual media requests
    let data;
    const apiKey = type === 'film' || type === 'serie' 
      ? Deno.env.get('TMDB_API_KEY')
      : type === 'book'
      ? Deno.env.get('GOOGLE_BOOKS_API_KEY')
      : Deno.env.get('RAWG_API_KEY');

    if (id) {
      switch (type) {
        case 'film':
          data = await fetchFilmById(apiKey ?? '', id)
          break
        case 'serie':
          data = await fetchSerieById(apiKey ?? '', id)
          break
        case 'book':
          data = await fetchBookById(apiKey ?? '', id)
          break
        case 'game':
          data = await fetchGameById(apiKey ?? '', id)
          break
        default:
          throw new Error('Type de média non pris en charge')
      }
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})

// Fonction pour équilibrer les types de médias dans les résultats
function balanceMediaTypes(items: any[], categories: string[]) {
  const result = [];
  const typeMap: Record<string, any[]> = {};
  
  // Organiser les items par type
  for (const item of items) {
    if (!typeMap[item.type]) typeMap[item.type] = [];
    typeMap[item.type].push(item);
  }
  
  // Assurer un minimum de 2 items par catégorie si disponible
  const minimumPerType = 2;
  for (const category of categories) {
    if (typeMap[category] && typeMap[category].length > 0) {
      const toAdd = Math.min(minimumPerType, typeMap[category].length);
      result.push(...typeMap[category].slice(0, toAdd));
      typeMap[category] = typeMap[category].slice(toAdd);
    }
  }
  
  // Répartir le reste en fonction de la popularité
  const remaining = Object.values(typeMap).flat()
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
  
  // Limiter à 20 résultats au total pour éviter un trop grand nombre
  const totalDesired = 20;
  const toFill = Math.max(0, totalDesired - result.length);
  
  result.push(...remaining.slice(0, toFill));
  
  return result;
}
