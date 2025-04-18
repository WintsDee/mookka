
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
  const seasonRequests = [];
  
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
    
    seriesData.seasons = await Promise.all(seasonRequests);
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
