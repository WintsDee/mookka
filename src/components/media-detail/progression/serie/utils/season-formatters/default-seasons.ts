
import { Season } from "../../types/serie-progression";

export function createDefaultSeasons(): Season[] {
  return Array(3).fill(null).map((_, i) => ({ 
    season_number: i + 1, 
    name: `Saison ${i + 1}`,
    episode_count: 10,
    episodes: Array.from({ length: 10 }, (_, j) => ({
      number: j + 1,
      title: `Épisode ${j + 1}`,
      airDate: undefined
    }))
  }));
}
