
import { Season } from "../types/serie-progression";
import { BROOKLYN_99_EPISODES } from "../data/brooklyn99-episodes";

export function formatSeasons(mediaDetails: any): Season[] {
  if (!mediaDetails) {
    return createDefaultSeasons();
  }

  if (mediaDetails.id === "48891" || mediaDetails.id === 48891) {
    return formatBrooklyn99Seasons(mediaDetails);
  }

  if (Array.isArray(mediaDetails.seasons)) {
    return formatRegularSeasons(mediaDetails);
  }

  return createDefaultSeasons();
}

function createDefaultSeasons(): Season[] {
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

function formatBrooklyn99Seasons(mediaDetails: any): Season[] {
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

function formatRegularSeasons(mediaDetails: any): Season[] {
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
