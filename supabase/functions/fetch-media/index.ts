
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

    // Handle trending request type
    if (type === "trending") {
      console.log("Processing trending request for categories:", categories);
      const trendingResults = []
      
      for (const category of categories) {
        console.log(`Fetching trending ${category} items`);
        
        switch (category) {
          case 'film':
            trendingResults.push(...await fetchTrendingFilms(Deno.env.get('TMDB_API_KEY') ?? ''))
            break
            
          case 'serie':
            trendingResults.push(...await fetchTrendingSeries(Deno.env.get('TMDB_API_KEY') ?? ''))
            break
            
          case 'book':
            trendingResults.push(...await fetchTrendingBooks(Deno.env.get('GOOGLE_BOOKS_API_KEY') ?? ''))
            break
            
          case 'game':
            trendingResults.push(...await fetchTrendingGames(Deno.env.get('RAWG_API_KEY') ?? ''))
            break
        }
      }
      
      // Shuffle results to mix categories
      const results = trendingResults.sort(() => Math.random() - 0.5)
      console.log(`Returning ${results.length} trending items`);
      
      return new Response(JSON.stringify({ results }), {
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
