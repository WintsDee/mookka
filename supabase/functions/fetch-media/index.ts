
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8'
import { corsHeaders } from './cors.ts'

const TMDB_API_KEY = Deno.env.get('TMDB_API_KEY')
const RAWG_API_KEY = Deno.env.get('RAWG_API_KEY')
const GOOGLE_BOOKS_API_KEY = Deno.env.get('GOOGLE_BOOKS_API_KEY')

interface SearchParams {
  type: 'film' | 'serie' | 'book' | 'game';
  query?: string;
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { type, query } = await req.json() as SearchParams
    let results = []

    if (type === 'film') {
      const trending = await fetch(
        `https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_API_KEY}&language=fr-FR`
      )
      const data = await trending.json()
      results = data.results.map((movie: any) => ({
        id: movie.id.toString(),
        type: 'film',
        title: movie.title,
        coverImage: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        rating: movie.vote_average,
        year: movie.release_date ? new Date(movie.release_date).getFullYear() : null,
        description: movie.overview,
        genres: movie.genre_ids?.slice(0, 3).map((id: number) => `Genre ${id}`) || []
      }))
    }
    
    if (type === 'serie') {
      const trending = await fetch(
        `https://api.themoviedb.org/3/trending/tv/week?api_key=${TMDB_API_KEY}&language=fr-FR`
      )
      const data = await trending.json()
      results = data.results.map((show: any) => ({
        id: show.id.toString(),
        type: 'serie',
        title: show.name,
        coverImage: `https://image.tmdb.org/t/p/w500${show.poster_path}`,
        rating: show.vote_average,
        year: show.first_air_date ? new Date(show.first_air_date).getFullYear() : null,
        description: show.overview,
        genres: show.genre_ids?.slice(0, 3).map((id: number) => `Genre ${id}`) || []
      }))
    }
    
    if (type === 'book') {
      // Rechercher des livres populaires
      const endpoint = query 
        ? `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${GOOGLE_BOOKS_API_KEY}&maxResults=20&langRestrict=fr`
        : `https://www.googleapis.com/books/v1/volumes?q=subject:fiction&orderBy=relevance&key=${GOOGLE_BOOKS_API_KEY}&maxResults=20&langRestrict=fr`;
      
      const response = await fetch(endpoint);
      const data = await response.json();
      
      if (data.items && Array.isArray(data.items)) {
        results = data.items.map((book: any) => {
          const volumeInfo = book.volumeInfo || {};
          const publishedDate = volumeInfo.publishedDate || '';
          const year = publishedDate ? parseInt(publishedDate.substring(0, 4)) : null;
          
          return {
            id: book.id,
            type: 'book',
            title: volumeInfo.title || 'Titre inconnu',
            coverImage: volumeInfo.imageLinks?.thumbnail || '/placeholder.svg',
            rating: volumeInfo.averageRating ? volumeInfo.averageRating * 2 : null, // Convert 5-point to 10-point scale
            year: year,
            description: volumeInfo.description || '',
            author: volumeInfo.authors ? volumeInfo.authors[0] : null,
            genres: volumeInfo.categories?.slice(0, 3) || []
          };
        });
      }
    }
    
    if (type === 'game') {
      // Updated to use 2025 as the current year
      const currentYear = 2025
      const trending = await fetch(
        `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&ordering=-rating&dates=${currentYear-1}-01-01,${currentYear}-12-31`
      )
      const data = await trending.json()
      results = data.results.map((game: any) => ({
        id: game.id.toString(),
        type: 'game',
        title: game.name,
        coverImage: game.background_image,
        rating: game.rating,
        year: game.released ? new Date(game.released).getFullYear() : null,
        description: game.description_raw || '',
        genres: game.genres?.slice(0, 3).map((genre: any) => genre.name) || []
      }))
    }

    // Log pour debug
    console.log(`Fetched ${results.length} ${type} results`);

    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Error in fetch-media function:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
