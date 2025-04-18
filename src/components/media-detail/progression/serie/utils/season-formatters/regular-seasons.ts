
import { Season } from "../../types/serie-progression";

export function formatRegularSeasons(mediaDetails: any): Season[] {
  if (!mediaDetails?.seasons?.length) {
    return [];
  }

  return mediaDetails.seasons
    .filter((season: any) => season.season_number > 0)
    .map((season: any) => ({
      season_number: season.season_number,
      name: season.name,
      episode_count: season.episode_count,
      air_date: season.air_date,
      episodes: season.episodes?.map((episode: any) => ({
        number: episode.number,
        title: episode.title,
        description: episode.description,
        airDate: episode.airDate,
        still_path: episode.still_path
      })) || Array.from({ length: season.episode_count }, (_, i) => ({
        number: i + 1,
        title: `Épisode ${i + 1}`
      }))
    }));
}

