
import { Season } from "../types/serie-progression";

export function generateUpcomingEpisodes(mediaDetails: any, seasons: Season[]): any[] {
  if (mediaDetails?.upcoming_episodes) {
    return mediaDetails.upcoming_episodes;
  }

  // If no information on upcoming episodes,
  // create placeholder data for ongoing series
  if (mediaDetails?.status === 'Returning Series' || mediaDetails?.status === 'In Production') {
    const today = new Date();
    const fakeUpcoming = [];
    
    for (let i = 0; i < 3; i++) {
      const futureDate = new Date(today);
      futureDate.setDate(today.getDate() + (7 * (i + 1)));
      
      const lastSeason = [...seasons].sort((a, b) => 
        (b.season_number || 0) - (a.season_number || 0))[0];
      
      if (lastSeason) {
        fakeUpcoming.push({
          season_number: lastSeason.season_number,
          episode_number: (lastSeason.episode_count || 0) + i + 1,
          name: `Épisode ${(lastSeason.episode_count || 0) + i + 1}`,
          air_date: futureDate.toISOString().split('T')[0]
        });
      }
    }
    
    return fakeUpcoming;
  }
  
  return [];
}
