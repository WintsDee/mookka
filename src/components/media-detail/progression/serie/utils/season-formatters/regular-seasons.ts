
import { Season } from "../../types/serie-progression";

export function formatRegularSeasons(mediaDetails: any): Season[] {
  return mediaDetails.seasons
    .filter((season: any) => season.season_number > 0)
    .map(season => ({
      season_number: season.season_number,
      name: season.name || `Saison ${season.season_number}`,
      episode_count: season.episode_count || 10,
      air_date: season.air_date,
      episodes: Array.from({ length: season.episode_count || 10 }, (_, i) => ({
        number: i + 1,
        title: `Épisode ${i + 1}`,
        airDate: undefined
      }))
    }));
}
