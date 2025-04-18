import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

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

    const { type, query, id } = await req.json()

    let apiKey = ''
    let apiUrl = ''

    switch (type) {
      case 'film':
      case 'serie':
        apiKey = Deno.env.get('TMDB_API_KEY') ?? ''
        if (id) {
          const appendParams = type === 'serie' 
            ? 'credits,seasons,episode_groups,external_ids,content_ratings,videos,watch/providers' 
            : 'credits,external_ids,videos,watch/providers,release_dates';
            
          apiUrl = `https://api.themoviedb.org/3/${type === 'film' ? 'movie' : 'tv'}/${id}?api_key=${apiKey}&language=fr-FR&include_adult=false&append_to_response=${appendParams}`
          
          if (type === 'serie') {
            const response = await fetch(apiUrl);
            let data = await response.json();
            
            const enrichedSeasons = [];
            
            for (const season of data.seasons) {
              if (season.season_number > 0) { // Ignorer les "saisons" spéciales (0)
                try {
                  const seasonDetailUrl = `https://api.themoviedb.org/3/tv/${id}/season/${season.season_number}?api_key=${apiKey}&language=fr-FR`;
                  const seasonResponse = await fetch(seasonDetailUrl);
                  const seasonDetail = await seasonResponse.json();
                  
                  enrichedSeasons.push({
                    ...season,
                    episodes: seasonDetail.episodes.map((episode: any) => ({
                      number: episode.episode_number,
                      title: episode.name,
                      description: episode.overview,
                      airDate: episode.air_date,
                      still_path: episode.still_path
                    }))
                  });
                } catch (error) {
                  console.error(`Erreur lors de la récupération des détails pour la saison ${season.season_number}:`, error);
                  enrichedSeasons.push(season);
                }
              }
            }
            
            data.seasons = enrichedSeasons;
            
            if (data.next_episode_to_air) {
              data.upcoming_episodes = [data.next_episode_to_air];
            }
            
            const futureEpisodesUrl = `https://api.themoviedb.org/3/tv/${id}/episode_group/5f7b4d940090dd003accce33?api_key=${apiKey}&language=fr-FR`;
            try {
              const futureResponse = await fetch(futureEpisodesUrl);
              const futureData = await futureResponse.json();
              if (futureData.groups?.[0]?.episodes) {
                const today = new Date();
                const thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));
                const upcomingEpisodes = futureData.groups[0].episodes
                  .filter((episode: any) => {
                    const airDate = new Date(episode.air_date);
                    return airDate > today && airDate <= thirtyDaysFromNow;
                  })
                  .map((episode: any) => ({
                    season_number: episode.season_number,
                    episode_number: episode.episode_number,
                    name: episode.name,
                    air_date: episode.air_date
                  }));
                
                if (upcomingEpisodes.length > 0) {
                  data.upcoming_episodes = data.upcoming_episodes || [];
                  data.upcoming_episodes.push(...upcomingEpisodes);
                }
              }
            } catch (error) {
              console.error("Erreur lors de la récupération des épisodes futurs:", error);
            }
            
            return new Response(JSON.stringify(data), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200,
            });
          }
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
        apiUrl = id
          ? `https://api.rawg.io/api/games/${id}?key=${apiKey}&language=fr`
          : `https://api.rawg.io/api/games?key=${apiKey}&search=${encodeURIComponent(query)}&search_precise=true&page=1&page_size=40&exclude_additions=true&exclude_parents=false&ordering=-rating&language=fr`
        break
      default:
        throw new Error('Type de média non pris en charge')
    }

    const response = await fetch(apiUrl)
    let data = await response.json()

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
    
    if (type === 'game' && !id && data.results) {
      const queryLower = query.toLowerCase()
      
      data.results.sort((a: any, b: any) => {
        const titleA = (a.name || '').toLowerCase()
        const titleB = (b.name || '').toLowerCase()
        
        const titleMatchScoreA = 
          (titleA === queryLower ? 20 : 0) + 
          (titleA.includes(queryLower) ? 10 : 0)
          
        const titleMatchScoreB = 
          (titleB === queryLower ? 20 : 0) + 
          (titleB.includes(queryLower) ? 10 : 0)
        
        const ratingA = a.rating || 0
        const ratingB = b.rating || 0
        
        const ratingsCountA = a.ratings_count || 0
        const ratingsCountB = b.ratings_count || 0
        
        const yearA = a.released ? parseInt(a.released.substring(0, 4)) : 0
        const yearB = b.released ? parseInt(b.released.substring(0, 4)) : 0
        
        const scoreA = titleMatchScoreA + (ratingA * 5) + Math.min(ratingsCountA / 200, 20) + (yearA >= 2015 ? 5 : 0)
        const scoreB = titleMatchScoreB + (ratingB * 5) + Math.min(ratingsCountB / 200, 20) + (yearB >= 2015 ? 5 : 0)
        
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
