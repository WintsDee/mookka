
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8'
import { corsHeaders } from './cors.ts'

const TMDB_API_KEY = Deno.env.get('TMDB_API_KEY')
const RAWG_API_KEY = Deno.env.get('RAWG_API_KEY')

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
        image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        rating: movie.vote_average,
        year: new Date(movie.release_date).getFullYear(),
        description: movie.overview
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
        image: `https://image.tmdb.org/t/p/w500${show.poster_path}`,
        rating: show.vote_average,
        year: new Date(show.first_air_date).getFullYear(),
        description: show.overview
      }))
    }
    
    if (type === 'game') {
      const currentYear = new Date().getFullYear()
      const trending = await fetch(
        `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&ordering=-rating&dates=${currentYear}-01-01,${currentYear}-12-31`
      )
      const data = await trending.json()
      results = data.results.map((game: any) => ({
        id: game.id.toString(),
        type: 'game',
        title: game.name,
        image: game.background_image,
        rating: game.rating,
        year: new Date(game.released).getFullYear(),
        description: game.description_raw || ''
      }))
    }

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
