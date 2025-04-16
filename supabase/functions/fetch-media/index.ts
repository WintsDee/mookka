
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
          // Utiliser une requête plus complète pour inclure les personnes (réalisateurs, acteurs)
          apiUrl = `https://api.themoviedb.org/3/search/${type === 'film' ? 'movie' : 'tv'}?api_key=${apiKey}&language=fr-FR&query=${encodeURIComponent(query)}&page=1&include_adult=false&append_to_response=credits`
        }
        break
      case 'book':
        apiKey = Deno.env.get('GOOGLE_BOOKS_API_KEY') ?? ''
        
        // Requête améliorée pour livres qui considère le titre et l'auteur
        let bookQuery = query
        if (!id) {
          // Inclure une recherche par auteur
          bookQuery = `${query} OR inauthor:${query}`
        }
        
        apiUrl = id 
          ? `https://www.googleapis.com/books/v1/volumes/${id}?key=${apiKey}`
          : `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(bookQuery)}&key=${apiKey}&maxResults=40`
        break
      case 'game':
        apiKey = Deno.env.get('RAWG_API_KEY') ?? ''
        apiUrl = id
          ? `https://api.rawg.io/api/games/${id}?key=${apiKey}`
          : `https://api.rawg.io/api/games?key=${apiKey}&search=${encodeURIComponent(query)}&search_precise=true&page=1&page_size=40&exclude_additions=true&exclude_parents=false&ordering=-rating`
        break
      default:
        throw new Error('Type de média non pris en charge')
    }

    // Fetch data from the appropriate API
    const response = await fetch(apiUrl)
    const data = await response.json()

    // Filtrage plus flexible pour les livres
    if (type === 'book' && !id && data.items) {
      // Mots-clés pour le contenu adulte (keep only the most explicit ones)
      const adultContentKeywords = [
        'xxx', 'erotic', 'érotique', 'porn', 'porno',
        'pornographique', 'bdsm', 'kamasutra', 'explicit', 'explicite'
      ]
      
      data.items = data.items.filter((item: any) => {
        const title = (item.volumeInfo?.title || '').toLowerCase()
        const description = (item.volumeInfo?.description || '').toLowerCase()
        
        const contentText = `${title} ${description}`
        
        // Only filter out explicit adult content, be more permissive otherwise
        return !adultContentKeywords.some(keyword => contentText.includes(keyword))
      })
      
      // Améliorer le classement des résultats en fonction de la pertinence
      const queryLower = query.toLowerCase()
      
      data.items.sort((a: any, b: any) => {
        const titleA = (a.volumeInfo?.title || '').toLowerCase()
        const titleB = (b.volumeInfo?.title || '').toLowerCase()
        
        const authorA = (a.volumeInfo?.authors || []).join(' ').toLowerCase()
        const authorB = (b.volumeInfo?.authors || []).join(' ').toLowerCase()
        
        // Score pour titre exact, titre contient, auteur exact, auteur contient
        const scoreA = 
          (titleA === queryLower ? 10 : 0) + 
          (titleA.includes(queryLower) ? 5 : 0) + 
          (authorA === queryLower ? 8 : 0) + 
          (authorA.includes(queryLower) ? 4 : 0)
          
        const scoreB = 
          (titleB === queryLower ? 10 : 0) + 
          (titleB.includes(queryLower) ? 5 : 0) + 
          (authorB === queryLower ? 8 : 0) + 
          (authorB.includes(queryLower) ? 4 : 0)
          
        return scoreB - scoreA
      })
    }
    
    // Filtering for games - amélioration pour les jeux
    if (type === 'game' && !id && data.results) {
      // Ordonner les jeux par pertinence
      const queryLower = query.toLowerCase()
      
      data.results.sort((a: any, b: any) => {
        // Facteur 1: Correspondance avec le terme recherché
        const titleA = (a.name || '').toLowerCase()
        const titleB = (b.name || '').toLowerCase()
        
        const titleMatchScoreA = 
          (titleA === queryLower ? 20 : 0) + 
          (titleA.includes(queryLower) ? 10 : 0)
          
        const titleMatchScoreB = 
          (titleB === queryLower ? 20 : 0) + 
          (titleB.includes(queryLower) ? 10 : 0)
        
        // Facteur 2: Note moyenne
        const ratingA = a.rating || 0
        const ratingB = b.rating || 0
        
        // Facteur 3: Nombre de notes (popularité)
        const ratingsCountA = a.ratings_count || 0
        const ratingsCountB = b.ratings_count || 0
        
        // Facteur 4: Année de sortie (favoriser les jeux récents mais pas trop)
        const yearA = a.released ? parseInt(a.released.substring(0, 4)) : 0
        const yearB = b.released ? parseInt(b.released.substring(0, 4)) : 0
        
        // Calcul du score total (favorise d'abord la correspondance puis la qualité et la popularité)
        const scoreA = titleMatchScoreA + (ratingA * 5) + Math.min(ratingsCountA / 200, 20) + (yearA >= 2015 ? 5 : 0)
        const scoreB = titleMatchScoreB + (ratingB * 5) + Math.min(ratingsCountB / 200, 20) + (yearB >= 2015 ? 5 : 0)
        
        return scoreB - scoreA
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
