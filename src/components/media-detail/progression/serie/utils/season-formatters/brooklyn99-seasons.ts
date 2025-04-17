
import { Season } from "../../types/serie-progression";
import { BROOKLYN_99_EPISODES } from "../../data/brooklyn99-episodes";

export function formatBrooklyn99Seasons(mediaDetails: any): Season[] {
  return mediaDetails.seasons
    .filter((season: any) => season.season_number > 0)
    .map((season: any) => {
      const seasonNumber = season.season_number;
      const episodes = BROOKLYN_99_EPISODES[seasonNumber] || 
        Array.from({ length: season.episode_count }, (_, i) => ({
          number: i + 1,
          title: `Épisode ${i + 1}`,
          airDate: season.air_date
        }));
      
      return {
        season_number: seasonNumber,
        name: season.name || `Saison ${seasonNumber}`,
        episode_count: season.episode_count,
        air_date: season.air_date,
        episodes: episodes
      };
    });
}
