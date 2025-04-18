
import { Season } from "../../types/serie-progression";

export function createDefaultSeasons(): Season[] {
  return [{
    season_number: 1,
    name: 'Saison 1',
    episode_count: 1,
    episodes: [{
      number: 1,
      title: 'Épisode 1',
      airDate: undefined
    }]
  }];
}
