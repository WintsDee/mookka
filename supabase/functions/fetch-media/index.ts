
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
    const { type, query, id, categories } = await req.json()

    // Get the appropriate API key based on media type
    let apiKey = ''
    let apiUrl = ''
    let results = []

    // Handle trending request type - fetch popular items from each category
    if (type === "trending") {
      console.log("Processing trending request for categories:", categories);
      const trendingResults = []
      
      // Process each requested category
      for (const category of categories) {
        let categoryResults = []
        console.log(`Fetching trending ${category} items`);
        
        switch (category) {
          case 'film':
          case 'serie':
            apiKey = Deno.env.get('TMDB_API_KEY') ?? ''
            apiUrl = `https://api.themoviedb.org/3/${category === 'film' ? 'movie' : 'tv'}/popular?api_key=${apiKey}&language=fr-FR&page=1`
            
            const tmdbResponse = await fetch(apiUrl)
            const tmdbData = await tmdbResponse.json()
            
            categoryResults = tmdbData.results?.slice(0, 8).map((item: any) => ({
              id: item.id,
              title: item.title || item.name,
              type: category,
              coverImage: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
              year: item.release_date ? parseInt(item.release_date.substring(0, 4)) : 
                    item.first_air_date ? parseInt(item.first_air_date.substring(0, 4)) : null,
              rating: item.vote_average,
              genres: item.genre_ids,
              popularity: item.popularity
            }))
            break
            
          case 'book':
            apiKey = Deno.env.get('GOOGLE_BOOKS_API_KEY') ?? ''
            // For books, we'll get recent bestsellers by specific categories
            apiUrl = `https://www.googleapis.com/books/v1/volumes?q=subject:fiction&orderBy=newest&maxResults=8&key=${apiKey}`
            
            const booksResponse = await fetch(apiUrl)
            const booksData = await booksResponse.json()
            
            categoryResults = booksData.items?.map((item: any) => ({
              id: item.id,
              title: item.volumeInfo?.title,
              type: 'book',
              coverImage: item.volumeInfo?.imageLinks?.thumbnail,
              year: item.volumeInfo?.publishedDate ? parseInt(item.volumeInfo.publishedDate.substring(0, 4)) : null,
              author: item.volumeInfo?.authors?.[0],
              rating: item.volumeInfo?.averageRating ? item.volumeInfo.averageRating * 2 : null, // Convert 5-star to 10-star
              genres: item.volumeInfo?.categories
            })) || []
            break
            
          case 'game':
            apiKey = Deno.env.get('RAWG_API_KEY') ?? ''
            // Get popular games from the last year
            const currentYear = new Date().getFullYear()
            apiUrl = `https://api.rawg.io/api/games?key=${apiKey}&dates=${currentYear-1}-01-01,${currentYear}-12-31&ordering=-added&page_size=8`
            
            const gamesResponse = await fetch(apiUrl)
            const gamesData = await gamesResponse.json()
            
            categoryResults = gamesData.results?.map((item: any) => ({
              id: item.id,
              title: item.name,
              type: 'game',
              coverImage: item.background_image,
              year: item.released ? parseInt(item.released.substring(0, 4)) : null,
              rating: item.rating,
              genres: item.genres?.map((g: any) => g.name)
            })) || []
            break
        }
        
        // Add category results to the main trending results
        trendingResults.push(...categoryResults)
      }
      
      // Shuffle results to mix categories
      results = trendingResults.sort(() => Math.random() - 0.5);
      console.log(`Returning ${results.length} trending items`);
      
      // Return the combined trending results
      return new Response(JSON.stringify({ results }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    switch (type) {
      case 'film':
      case 'serie':
        apiKey = Deno.env.get('TMDB_API_KEY') ?? ''
        if (id) {
          // Ajouter append_to_response pour obtenir plus de détails, y compris les saisons détaillées pour les séries
          const appendParams = type === 'serie' 
            ? 'credits,seasons,episode_groups,external_ids,content_ratings,videos,watch/providers' 
            : 'credits,external_ids,videos,watch/providers,release_dates';
            
          apiUrl = `https://api.themoviedb.org/3/${type === 'film' ? 'movie' : 'tv'}/${id}?api_key=${apiKey}&language=fr-FR&include_adult=false&append_to_response=${appendParams}`
          
          // Pour les séries, on peut également récupérer les informations détaillées sur chaque saison
          if (type === 'serie') {
            // La requête principale inclut déjà les saisons de base, mais on pourrait enrichir avec plus de détails
            // par exemple en faisant des requêtes pour chaque saison si nécessaire
          }
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
          ? `https://api.rawg.io/api/games/${id}?key=${apiKey}&language=fr`
          : `https://api.rawg.io/api/games?key=${apiKey}&search=${encodeURIComponent(query)}&search_precise=true&page=1&page_size=40&exclude_additions=true&exclude_parents=false&ordering=-rating&language=fr`
        break
      default:
        throw new Error('Type de média non pris en charge')
    }

    // Fetch data from the appropriate API
    const response = await fetch(apiUrl)
    let data = await response.json()

    // Pour les séries, récupérer des détails supplémentaires sur chaque saison
    if (type === 'serie' && id && data.seasons && Array.isArray(data.seasons)) {
      // Enrichir chaque saison avec des détails si nécessaire
      // Note: Cette approche peut générer beaucoup de requêtes API
      // On le fait uniquement pour les premières saisons ou selon une logique métier
      const enrichedSeasons = [];
      
      for (const season of data.seasons) {
        if (season.season_number > 0) { // Ignorer les "saisons" spéciales (0)
          // Optionnellement, récupérer des détails supplémentaires pour certaines saisons
          try {
            // On peut limiter le nombre de requêtes pour éviter de surcharger l'API
            if (enrichedSeasons.length < 3) { // Limiter à 3 saisons enrichies
              const seasonDetailUrl = `https://api.themoviedb.org/3/tv/${id}/season/${season.season_number}?api_key=${apiKey}&language=fr-FR`;
              const seasonResponse = await fetch(seasonDetailUrl);
              const seasonDetail = await seasonResponse.json();
              
              // Fusionner les données de base avec les détails
              enrichedSeasons.push({
                ...season,
                episodes: seasonDetail.episodes
              });
            } else {
              enrichedSeasons.push(season);
            }
          } catch (error) {
            console.error(`Erreur lors de la récupération des détails pour la saison ${season.season_number}:`, error);
            enrichedSeasons.push(season);
          }
        }
      }
      
      // Mettre à jour les données avec les saisons enrichies
      data.seasons = enrichedSeasons;
    }
    
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
    console.error("Error processing request:", error);
    // Return error with CORS headers
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
