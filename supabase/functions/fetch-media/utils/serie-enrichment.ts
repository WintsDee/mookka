
export async function enrichSerieSeasons(data: any, id: string, apiKey: string): Promise<void> {
  if (data.seasons && Array.isArray(data.seasons)) {
    const enrichedSeasons = [];
    
    for (const season of data.seasons) {
      if (season.season_number > 0) { // Ignore special "seasons" (0)
        try {
          if (enrichedSeasons.length < 3) { // Limit to 3 enriched seasons
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
          console.error(`Error fetching details for season ${season.season_number}:`, error);
          enrichedSeasons.push(season);
        }
      }
    }
    
    data.seasons = enrichedSeasons;
  }
}

