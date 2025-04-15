
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the auth context of the function
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get request body
    const { type, query, id } = await req.json()

    // Get the appropriate API key based on media type
    let apiKey = ''
    let apiUrl = ''

    switch (type) {
      case 'film':
      case 'serie':
        apiKey = Deno.env.get('TMDB_API_KEY') ?? ''
        if (id) {
          apiUrl = `https://api.themoviedb.org/3/${type === 'film' ? 'movie' : 'tv'}/${id}?api_key=${apiKey}&language=fr-FR&include_adult=false`
        } else {
          apiUrl = `https://api.themoviedb.org/3/search/${type === 'film' ? 'movie' : 'tv'}?api_key=${apiKey}&language=fr-FR&query=${encodeURIComponent(query)}&page=1&include_adult=false`
        }
        break
      case 'book':
        apiKey = Deno.env.get('GOOGLE_BOOKS_API_KEY') ?? ''
        apiUrl = id 
          ? `https://www.googleapis.com/books/v1/volumes/${id}?key=${apiKey}`
          : `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${apiKey}&langRestrict=fr&orderBy=relevance&maxResults=30`
        break
      case 'game':
        apiKey = Deno.env.get('RAWG_API_KEY') ?? ''
        apiUrl = id
          ? `https://api.rawg.io/api/games/${id}?key=${apiKey}`
          : `https://api.rawg.io/api/games?key=${apiKey}&search=${encodeURIComponent(query)}&page=1&page_size=30&exclude_additions=true`
        break
      default:
        throw new Error('Type de média non pris en charge')
    }

    // Fetch data from the appropriate API
    const response = await fetch(apiUrl)
    const data = await response.json()

    // Filtrage supplémentaire des contenus pour adultes pour Google Books
    if (type === 'book' && !id && data.items) {
      const adultContentKeywords = [
        'xxx', 'erotic', 'érotique', 'adult', 'adulte', 'sex', 'sexe', 'sexy', 'porn', 'porno',
        'pornographique', 'nude', 'nu', 'nue', 'naked', 'mature', 'kinky', 'fetish', 'fétiche',
        'bdsm', 'kamasutra', 'nudité', 'explicit', 'explicite', 'hot', 'sensual', 'sensuel',
        'seduction', 'séduction'
      ]
      
      data.items = data.items.filter((item: any) => {
        const title = (item.volumeInfo?.title || '').toLowerCase()
        const description = (item.volumeInfo?.description || '').toLowerCase()
        const categories = Array.isArray(item.volumeInfo?.categories) 
          ? item.volumeInfo.categories.join(' ').toLowerCase() 
          : ''
        
        const contentText = `${title} ${description} ${categories}`
        
        return !adultContentKeywords.some(keyword => contentText.includes(keyword))
      })
    }

    // Return the response with CORS headers
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    // Return error with CORS headers
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
