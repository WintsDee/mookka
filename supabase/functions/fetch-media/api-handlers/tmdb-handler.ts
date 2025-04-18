
const getTMDBApiUrl = (type: string, query?: string, id?: string) => {
  const apiKey = Deno.env.get('TMDB_API_KEY') ?? '';
  
  if (id) {
    const appendParams = type === 'serie' 
      ? 'aggregate_credits,season/1,external_ids,episode_groups,recommendations,similar,translations,videos,watch/providers,content_ratings,keywords' 
      : 'credits,external_ids,videos,watch/providers,release_dates';
      
    return `https://api.themoviedb.org/3/${type === 'film' ? 'movie' : 'tv'}/${id}?api_key=${apiKey}&language=fr-FR&include_adult=false&append_to_response=${appendParams}`;
  }
  
  return `https://api.themoviedb.org/3/search/${type === 'film' ? 'movie' : 'tv'}?api_key=${apiKey}&language=fr-FR&query=${encodeURIComponent(query!)}&page=1&include_adult=false`;
};

export async function handleTMDBMedia(type: string, query?: string, id?: string) {
  const url = getTMDBApiUrl(type, query, id);
  const response = await fetch(url);
  let data = await response.json();
  
  if (type === 'serie' && id && data.seasons) {
    data = await enrichSeriesData(data, id);
  }
  
  return data;
}

async function enrichSeriesData(seriesData: any, id: string) {
  const apiKey = Deno.env.get('TMDB_API_KEY') ?? '';
  
  // Fetch more detailed season data for the first 3 seasons at most to avoid too many requests
  const seasonRequests = [];
  const allSeasonPromises = [];
  
  if (seriesData.seasons) {
    // Filter out season 0 (specials) and limit to first 10 seasons for performance
    const regularSeasons = seriesData.seasons
      .filter((season: any) => season.season_number > 0)
      .slice(0, 10);
    
    // Fetch full details for all seasons
    for (const season of regularSeasons) {
      const seasonPromise = fetch(`https://api.themoviedb.org/3/tv/${id}/season/${season.season_number}?api_key=${apiKey}&language=fr-FR`)
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
        }));
      
      allSeasonPromises.push(seasonPromise);
    }
    
    // Wait for all season data
    const detailedSeasons = await Promise.all(allSeasonPromises);
    seriesData.seasons = detailedSeasons;
    
    // Generate upcoming episodes based on the latest season's air date pattern
    if (detailedSeasons.length > 0) {
      const latestSeason = [...detailedSeasons].sort((a, b) => b.season_number - a.season_number)[0];
      if (latestSeason.episodes && latestSeason.episodes.length > 0) {
        const upcomingEpisodes = generateUpcomingEpisodes(latestSeason);
        seriesData.upcoming_episodes = upcomingEpisodes;
      }
    }
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
  
  return seriesData;
}

// Function to generate upcoming episodes based on air date pattern
function generateUpcomingEpisodes(latestSeason: any) {
  if (!latestSeason.episodes || latestSeason.episodes.length === 0) {
    return [];
  }
  
  // Get the latest episode with an air date
  const episodesWithAirDates = latestSeason.episodes
    .filter((ep: any) => ep.airDate)
    .sort((a: any, b: any) => new Date(b.airDate).getTime() - new Date(a.airDate).getTime());
  
  if (episodesWithAirDates.length === 0) {
    return [];
  }
  
  const latestEpisode = episodesWithAirDates[0];
  const latestAirDate = new Date(latestEpisode.airDate);
  
  // Calculate typical gap between episodes (usually 7 days)
  let episodeGap = 7;
  if (episodesWithAirDates.length > 1) {
    const previousEpisode = episodesWithAirDates[1];
    const previousAirDate = new Date(previousEpisode.airDate);
    const daysDiff = Math.floor((latestAirDate.getTime() - previousAirDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff > 0 && daysDiff < 30) {
      episodeGap = daysDiff;
    }
  }
  
  // Generate 3 upcoming episodes
  const upcomingEpisodes = [];
  for (let i = 1; i <= 3; i++) {
    const upcomingDate = new Date(latestAirDate);
    upcomingDate.setDate(latestAirDate.getDate() + (episodeGap * i));
    
    upcomingEpisodes.push({
      season_number: latestSeason.season_number,
      episode_number: latestEpisode.number + i,
      name: `Épisode ${latestEpisode.number + i}`,
      air_date: upcomingDate.toISOString().split('T')[0]
    });
  }
  
  return upcomingEpisodes;
}
