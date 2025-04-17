
import { Season, Episode } from '../types';
import { BROOKLYN_99_EPISODES } from '../data/mockEpisodes';

/**
 * Formats season data from media details into a standardized format
 */
export function formatSeasons(mediaDetails: any): Season[] {
  if (!mediaDetails) {
    console.log("No media details provided, creating default seasons");
    // Create default seasons if no media details are provided
    return createDefaultSeasons();
  }

  console.log("Media details seasons:", mediaDetails.seasons);
  
  let formattedSeasons: Season[] = [];
  
  // Brooklyn 99 specific data
  if (mediaDetails.id === "48891" || mediaDetails.id === 48891) {
    formattedSeasons = formatBrooklyn99Seasons(mediaDetails.seasons);
  } else if (Array.isArray(mediaDetails.seasons)) {
    // Use season data from the media if available
    formattedSeasons = formatGenericSeasons(mediaDetails.seasons);
  } else {
    // Fallback for media without season data
    const seasonCount = typeof mediaDetails.seasons === 'number' ? mediaDetails.seasons : 3;
    formattedSeasons = createCustomSeasons(seasonCount);
  }
  
  console.log("Formatted seasons:", formattedSeasons);
  return formattedSeasons;
}

/**
 * Creates default seasons when no media details are available
 */
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

/**
 * Format seasons for Brooklyn 99 using predefined episode data
 */
function formatBrooklyn99Seasons(seasons: any[]): Season[] {
  return seasons
    // Filter out season 0 (specials)
    .filter((season: any) => season.season_number > 0)
    .map((season: any) => {
      const seasonNumber = season.season_number;
      // Get episodes for this season from our predefined data
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

/**
 * Format generic seasons from media details
 */
function formatGenericSeasons(seasons: any[]): Season[] {
  return seasons
    .filter((season: any) => season.season_number > 0) // Filter out specials (season 0)
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

/**
 * Create a custom number of seasons with default episodes
 */
function createCustomSeasons(seasonCount: number): Season[] {
  return Array(seasonCount).fill(null).map((_, i) => ({ 
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

/**
 * Generate upcoming episodes data
 */
export function generateUpcomingEpisodes(mediaDetails: any, seasons: Season[]): any[] {
  if (mediaDetails?.upcoming_episodes) {
    return mediaDetails.upcoming_episodes;
  }
  
  // Create mock upcoming episodes if none are provided
  const today = new Date();
  const fakeUpcoming = [];
  
  for (let i = 0; i < 3; i++) {
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + (7 * (i + 1)));
    
    // Find the most recent season
    const lastSeason = [...seasons].sort((a, b) => 
      (b.season_number || 0) - (a.season_number || 0))[0];
    
    if (lastSeason) {
      fakeUpcoming.push({
        season_number: lastSeason.season_number,
        episode_number: lastSeason.episode_count + i + 1,
        name: `Épisode ${lastSeason.episode_count + i + 1}`,
        air_date: futureDate.toISOString().split('T')[0]
      });
    }
  }
  
  return fakeUpcoming;
}
