
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
        
        // Pour les livres, améliorer la requête pour favoriser les romans, mangas, etc.
        let bookQuery = query
        if (!id) {
          // Ajouter des paramètres pour améliorer la qualité des résultats
          // Utiliser des opérateurs de recherche avancée
          const genreFilter = 'subject:fiction OR subject:roman OR subject:manga OR subject:bande-dessinee OR subject:comics'
          bookQuery = `${query} ${genreFilter}`
        }
        
        apiUrl = id 
          ? `https://www.googleapis.com/books/v1/volumes/${id}?key=${apiKey}`
          : `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(bookQuery)}&key=${apiKey}&langRestrict=fr&orderBy=relevance&maxResults=40`
        break
      case 'game':
        apiKey = Deno.env.get('RAWG_API_KEY') ?? ''
        apiUrl = id
          ? `https://api.rawg.io/api/games/${id}?key=${apiKey}`
          : `https://api.rawg.io/api/games?key=${apiKey}&search=${encodeURIComponent(query)}&page=1&page_size=40&exclude_additions=true&exclude_parents=false&ordering=-rating`
        break
      default:
        throw new Error('Type de média non pris en charge')
    }

    // Fetch data from the appropriate API
    const response = await fetch(apiUrl)
    const data = await response.json()

    // Filtrage des contenus inappropriés et académiques pour Google Books
    if (type === 'book' && !id && data.items) {
      // Mots-clés pour le contenu adulte
      const adultContentKeywords = [
        'xxx', 'erotic', 'érotique', 'adult', 'adulte', 'sex', 'sexe', 'sexy', 'porn', 'porno',
        'pornographique', 'nude', 'nu', 'nue', 'naked', 'mature', 'kinky', 'fetish', 'fétiche',
        'bdsm', 'kamasutra', 'nudité', 'explicit', 'explicite', 'hot', 'sensual', 'sensuel',
        'seduction', 'séduction'
      ]
      
      // Mots-clés pour les contenus académiques et essais à éviter
      const academicKeywords = [
        'academic', 'textbook', 'manuel', 'thesis', 'thèse', 'dissertation', 'essay', 
        'essai', 'biography', 'biographie', 'self-help', 'développement personnel',
        'business', 'management', 'education', 'reference', 'mathematics',
        'mathématiques', 'philosophy', 'philosophie', 'religion', 'political', 'politique',
        'economics', 'économie', 'medical', 'médical', 'law', 'droit', 'computer science',
        'étude', 'studies', 'research', 'recherche', 'scientific', 'scientifique',
        'proceedings', 'conference', 'journal', 'revue', 'encyclopedia', 'encyclopédie'
      ]
      
      data.items = data.items.filter((item: any) => {
        const title = (item.volumeInfo?.title || '').toLowerCase()
        const description = (item.volumeInfo?.description || '').toLowerCase()
        const categories = Array.isArray(item.volumeInfo?.categories) 
          ? item.volumeInfo.categories.join(' ').toLowerCase() 
          : ''
        
        const contentText = `${title} ${description} ${categories}`
        
        // Éliminer les contenus inappropriés
        const hasAdultContent = adultContentKeywords.some(keyword => contentText.includes(keyword))
        if (hasAdultContent) return false
        
        // Éliminer la plupart des contenus académiques sauf s'ils ont des caractéristiques de fiction
        const hasAcademicContent = academicKeywords.some(keyword => contentText.includes(keyword))
        const hasFictionContent = contentText.includes('fiction') || 
                                 contentText.includes('roman') || 
                                 contentText.includes('manga') ||
                                 contentText.includes('bande dessinée') ||
                                 contentText.includes('comics') ||
                                 contentText.includes('fantasy') ||
                                 contentText.includes('aventure') ||
                                 contentText.includes('fantastique')
        
        // Garder les contenus qui ne sont pas académiques ou qui sont clairement de la fiction
        return !hasAcademicContent || hasFictionContent
      })
    }
    
    // Filtrage supplémentaire pour les jeux vidéo
    if (type === 'game' && !id && data.results) {
      // Ordonner les jeux par pertinence
      data.results.sort((a: any, b: any) => {
        // Facteur 1: Note moyenne
        const ratingA = a.rating || 0
        const ratingB = b.rating || 0
        
        // Facteur 2: Nombre de notes (popularité)
        const ratingsCountA = a.ratings_count || 0
        const ratingsCountB = b.ratings_count || 0
        
        // Facteur 3: Année de sortie (favoriser les jeux récents mais pas trop)
        const yearA = a.released ? parseInt(a.released.substring(0, 4)) : 0
        const yearB = b.released ? parseInt(b.released.substring(0, 4)) : 0
        
        // Calcul du score total (favorise la qualité et la popularité)
        const scoreA = (ratingA * 10) + Math.min(ratingsCountA / 100, 40) + (yearA >= 2015 ? 10 : 0)
        const scoreB = (ratingB * 10) + Math.min(ratingsCountB / 100, 40) + (yearB >= 2015 ? 10 : 0)
        
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
