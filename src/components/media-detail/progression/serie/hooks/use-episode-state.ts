
import { useState, useEffect } from "react";
import { Season } from "../types/serie-progression";
import { formatSeasons } from "../utils/format-seasons";
import { generateUpcomingEpisodes } from "../utils/generate-upcoming";

export function useEpisodeState(mediaDetails: any, initialProgression: any) {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [totalEpisodes, setTotalEpisodes] = useState<number>(0);
  const [watchedEpisodes, setWatchedEpisodes] = useState<number>(0);
  const [upcomingEpisodes, setUpcomingEpisodes] = useState<any[]>([]);

  useEffect(() => {
    if (mediaDetails) {
      const formattedSeasons = formatSeasons(mediaDetails);
      setSeasons(formattedSeasons);
      
      const totalEpisodeCount = formattedSeasons.reduce((acc: number, season) => 
        acc + (season.episode_count || 0), 0);
      setTotalEpisodes(totalEpisodeCount);
      
      // Calculate watched episodes count
      const watchedEpisodesObj = initialProgression?.watched_episodes || {};
      let watchedCount = 0;
      
      Object.values(watchedEpisodesObj).forEach((episodes: any) => {
        if (Array.isArray(episodes)) {
          watchedCount += episodes.length;
        }
      });
      
      setWatchedEpisodes(watchedCount);
      
      const upcomingEps = generateUpcomingEpisodes(mediaDetails, formattedSeasons);
      setUpcomingEpisodes(upcomingEps);
    }
  }, [mediaDetails]);

  return {
    seasons,
    totalEpisodes,
    watchedEpisodes,
    setWatchedEpisodes,
    upcomingEpisodes
  };
}
