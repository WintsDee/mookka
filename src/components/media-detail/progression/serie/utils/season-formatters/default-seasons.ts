
import { Season } from "../../types/serie-progression";

export function createDefaultSeasons(): Season[] {
  return [
    {
      season_number: 1,
      name: "Saison 1",
      episode_count: 10,
      episodes: Array.from({ length: 10 }, (_, i) => ({
        number: i + 1,
        title: `Épisode ${i + 1}`,
        airDate: undefined
      }))
    }
  ];
}
