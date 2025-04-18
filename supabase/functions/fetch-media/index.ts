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
          const appendParams = type === 'serie' 
            ? 'aggregate_credits,season/1,external_ids,episode_groups,recommendations,similar,translations,videos,watch/providers,content_ratings,keywords' 
            : 'credits,external_ids,videos,watch/providers,release_dates';
            
          apiUrl = `https://api.themoviedb.org/3/${type === 'film' ? 'movie' : 'tv'}/${id}?api_key=${apiKey}&language=fr-FR&include_adult=false&append_to_response=${appendParams}`
          
          if (type === 'serie') {
            const seasonRequests = [];
            const response = await fetch(apiUrl);
            const seriesData = await response.json();
            
            // Get richer data for the first 3 seasons
            if (seriesData.seasons) {
              for (const season of seriesData.seasons) {
                if (season.season_number > 0 && seasonRequests.length < 3) {
                  seasonRequests.push(
                    fetch(`https://api.themoviedb.org/3/tv/${id}/season/${season.season_number}?api_key=${apiKey}&language=fr-FR`)
                      .then(res => res.json())
                      .then(seasonData => ({
                        ...season,
                        episodes: seasonData.episodes?.map((episode: any) => ({
                          id: episode.id,
                          number: episode.episode_number,
                          title: episode.name,
                          airDate: episode.air_date,
                          overview: episode.overview,
                          stillPath: episode.still_path,
                          crew: episode.crew,
                          guestStars: episode.guest_stars,
                          runtime: episode.runtime,
                          voteAverage: episode.vote_average
                        }))
                      }))
                  );
                } else {
                  seasonRequests.push(Promise.resolve(season));
                }
              }
              
              const enrichedSeasons = await Promise.all(seasonRequests);
              seriesData.seasons = enrichedSeasons;
            }
            
            // Add translations data
            if (seriesData.translations?.translations) {
              const frenchTranslation = seriesData.translations.translations.find(
                (t: any) => t.iso_639_1 === 'fr'
              );
              if (frenchTranslation) {
                seriesData.frenchData = frenchTranslation.data;
              }
            }
            
            // Include keyword data
            if (seriesData.keywords?.results) {
              seriesData.keywordsList = seriesData.keywords.results.map((k: any) => k.name);
            }
            
            // Restructure credits data
            if (seriesData.aggregate_credits) {
              seriesData.cast = seriesData.aggregate_credits.cast?.map((member: any) => ({
                id: member.id,
                name: member.name,
                character: member.roles?.[0]?.character || '',
                profilePath: member.profile_path,
                episodeCount: member.total_episode_count,
                order: member.order
              }));
              
              seriesData.crew = seriesData.aggregate_credits.crew?.map((member: any) => ({
                id: member.id,
                name: member.name,
                job: member.jobs?.[0]?.job || '',
                department: member.department,
                profilePath: member.profile_path,
                episodeCount: member.total_episode_count
              }));
            }
            
            return new Response(JSON.stringify(seriesData), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200,
            });
          }
        } else {
          apiUrl = `https://api.themoviedb.org/3/search/${type === 'film' ? 'movie' : 'tv'}?api_key=${apiKey}&language=fr-FR&query=${encodeURIComponent(query)}&page=1&include_adult=false`
        }
        break
      case 'book':
        apiKey = Deno.env.get('GOOGLE_BOOKS_API_KEY') ?? ''
        
        let bookQuery = query
        if (!id) {
          bookQuery = `${query} OR inauthor:${query}`
        }
        
        apiUrl = id 
          ? `https://www.googleapis.com/books/v1/volumes/${id}?key=${apiKey}`
          : `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(bookQuery)}&key=${apiKey}&maxResults=40`
        break
      case 'game':
        apiKey = Deno.env.get('RAWG_API_KEY') ?? ''
        if (id) {
          apiUrl = `https://api.rawg.io/api/games/${id}?key=${apiKey}`
        } else {
          apiUrl = `https://api.rawg.io/api/games?key=${apiKey}&search=${encodeURIComponent(query)}&page=1&page_size=40&exclude_additions=true&search_precise=false&search_exact=false&ordering=-relevance,-rating`
        }
        break
      default:
        throw new Error('Type de média non pris en charge')
    }

    // Fetch data from the appropriate API
    const response = await fetch(apiUrl)
    let data = await response.json()

    // Pour les séries, récupérer des détails supplémentaires sur chaque saison
    if (type === 'serie' && id && data.seasons && Array.isArray(data.seasons)) {
      const enrichedSeasons = [];
      
      for (const season of data.seasons) {
        if (season.season_number > 0) { // Ignorer les "saisons" spéciales (0)
          try {
            if (enrichedSeasons.length < 3) { // Limiter à 3 saisons enrichies
              const seasonDetailUrl = `https://api.themoviedb.org/3/tv/${id}/season/${season.season_number}?api_key=${apiKey}&language=fr-FR`;
              const seasonResponse = await fetch(seasonDetailUrl);
              const seasonDetail = await seasonResponse.json();
              
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
      
      data.seasons = enrichedSeasons;
    }
    
    if (type === 'book' && !id && data.items) {
      const adultContentKeywords = [
        'xxx', 'erotic', 'érotique', 'porn', 'porno',
        'pornographique', 'bdsm', 'kamasutra', 'explicit', 'explicite'
      ]
      
      data.items = data.items.filter((item: any) => {
        const title = (item.volumeInfo?.title || '').toLowerCase()
        const description = (item.volumeInfo?.description || '').toLowerCase()
        
        const contentText = `${title} ${description}`
        
        return !adultContentKeywords.some(keyword => contentText.includes(keyword))
      })
      
      const queryLower = query.toLowerCase()
      
      data.items.sort((a: any, b: any) => {
        const titleA = (a.volumeInfo?.title || '').toLowerCase()
        const titleB = (b.volumeInfo?.title || '').toLowerCase()
        
        const authorA = (a.volumeInfo?.authors || []).join(' ').toLowerCase()
        const authorB = (b.volumeInfo?.authors || []).join(' ').toLowerCase()
        
        // Prioritize exact matches
        const exactTitleMatchA = titleA === queryLower ? 100 : 0
        const exactTitleMatchB = titleB === queryLower ? 100 : 0
        
        // If we have one exact match, prioritize it heavily
        if (exactTitleMatchA !== exactTitleMatchB) {
          return exactTitleMatchB - exactTitleMatchA
        }
        
        // Otherwise use the existing scoring system
        const scoreA = 
          (titleA.includes(queryLower) ? 30 : 0) + 
          (authorA === queryLower ? 25 : 0) + 
          (authorA.includes(queryLower) ? 15 : 0)
          
        const scoreB = 
          (titleB.includes(queryLower) ? 30 : 0) + 
          (authorB === queryLower ? 25 : 0) + 
          (authorB.includes(queryLower) ? 15 : 0)
          
        return scoreB - scoreA
      })
    }
    
    if (type === 'game' && !id && data.results) {
      const queryLower = query.toLowerCase()
      
      data.results.sort((a: any, b: any) => {
        const nameA = (a.name || '').toLowerCase()
        const nameB = (b.name || '').toLowerCase()
        
        // Prioritize exact matches (100 points)
        const exactMatchA = nameA === queryLower ? 100 : 0
        const exactMatchB = nameB === queryLower ? 100 : 0
        
        // If we have an exact match, it should absolutely get priority
        if (exactMatchA !== exactMatchB) {
          return exactMatchB - exactMatchA
        }
        
        // Otherwise fall back to the regular scoring system
        const scoreA = 
          (nameA.includes(queryLower) ? 30 : 0) + 
          (queryLower.includes(nameA) ? 15 : 0) +
          (a.rating || 0) * 3 +
          Math.min((a.ratings_count || 0) / 100, 15)
          
        const scoreB = 
          (nameB.includes(queryLower) ? 30 : 0) + 
          (queryLower.includes(nameB) ? 15 : 0) +
          (b.rating || 0) * 3 +
          Math.min((b.ratings_count || 0) / 100, 15)
        
        return scoreB - scoreA
      })
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
