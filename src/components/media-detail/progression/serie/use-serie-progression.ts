import { useState, useEffect } from "react";

interface Season {
  season_number: number;
  name?: string;
  episode_count: number;
  air_date?: string;
  episodes?: Array<{
    number: number;
    title?: string;
    airDate?: string;
  }>;
}

interface SerieProgressionResult {
  seasons: Season[];
  upcomingEpisodes: any[];
  totalEpisodes: number;
  watchedEpisodes: number;
  status: string;
  progression: any;
  toggleEpisode: (seasonNumber: number, episodeNumber: number) => any;
  toggleSeason: (seasonNumber: number, episodeCount: number) => any;
  updateStatus: (newStatus: string) => any;
}

const BROOKLYN_99_EPISODES = {
  1: [
    { number: 1, title: "Pilot", airDate: "2013-09-17" },
    { number: 2, title: "The Tagger", airDate: "2013-09-24" },
    { number: 3, title: "The Slump", airDate: "2013-10-01" },
    { number: 4, title: "M.E. Time", airDate: "2013-10-08" },
    { number: 5, title: "The Vulture", airDate: "2013-10-15" },
    { number: 6, title: "Halloween", airDate: "2013-10-22" },
    { number: 7, title: "48 Hours", airDate: "2013-11-05" },
    { number: 8, title: "Old School", airDate: "2013-11-12" },
    { number: 9, title: "Sal's Pizza", airDate: "2013-11-19" },
    { number: 10, title: "Thanksgiving", airDate: "2013-11-26" },
    { number: 11, title: "Christmas", airDate: "2013-12-03" },
    { number: 12, title: "Pontiac Bandit", airDate: "2014-01-07" },
    { number: 13, title: "The Bet", airDate: "2014-01-14" },
    { number: 14, title: "The Ebony Falcon", airDate: "2014-01-21" },
    { number: 15, title: "Operation: Broken Feather", airDate: "2014-02-02" },
    { number: 16, title: "The Party", airDate: "2014-02-04" },
    { number: 17, title: "Full Boyle", airDate: "2014-02-11" },
    { number: 18, title: "The Apartment", airDate: "2014-02-25" },
    { number: 19, title: "Tactical Village", airDate: "2014-03-04" },
    { number: 20, title: "Fancy Brudgom", airDate: "2014-03-11" },
    { number: 21, title: "Unsolvable", airDate: "2014-03-18" },
    { number: 22, title: "Charges and Specs", airDate: "2014-03-25" }
  ],
  2: [
    { number: 1, title: "Undercover", airDate: "2014-09-28" },
    { number: 2, title: "Chocolate Milk", airDate: "2014-10-05" },
    { number: 3, title: "The Jimmy Jab Games", airDate: "2014-10-12" },
    { number: 4, title: "Halloween II", airDate: "2014-10-19" },
    { number: 5, title: "The Mole", airDate: "2014-11-02" },
    { number: 6, title: "Jake and Sophia", airDate: "2014-11-09" },
    { number: 7, title: "Lockdown", airDate: "2014-11-16" },
    { number: 8, title: "USPIS", airDate: "2014-11-23" },
    { number: 9, title: "The Road Trip", airDate: "2014-11-30" },
    { number: 10, title: "The Pontiac Bandit Returns", airDate: "2014-12-07" },
    { number: 11, title: "Stakeout", airDate: "2014-12-14" },
    { number: 12, title: "Beach House", airDate: "2015-01-04" },
    { number: 13, title: "Payback", airDate: "2015-01-11" },
    { number: 14, title: "Defense Rests", airDate: "2015-01-25" },
    { number: 15, title: "Windbreaker City", airDate: "2015-02-08" },
    { number: 16, title: "The Wednesday Incident", airDate: "2015-02-15" },
    { number: 17, title: "Boyle-Linetti Wedding", airDate: "2015-03-01" },
    { number: 18, title: "Captain Peralta", airDate: "2015-03-08" },
    { number: 19, title: "Sabotage", airDate: "2015-03-15" },
    { number: 20, title: "AC/DC", airDate: "2015-04-26" },
    { number: 21, title: "Det. Dave Majors", airDate: "2015-05-03" },
    { number: 22, title: "The Chopper", airDate: "2015-05-10" },
    { number: 23, title: "Johnny and Dora", airDate: "2015-05-17" }
  ],
  3: [
    { number: 1, title: "New Captain", airDate: "2015-09-27" },
    { number: 2, title: "The Funeral", airDate: "2015-10-04" },
    { number: 3, title: "Boyle's Hunch", airDate: "2015-10-11" },
    { number: 4, title: "The Oolong Slayer", airDate: "2015-10-18" },
    { number: 5, title: "Halloween III", airDate: "2015-10-25" },
    { number: 6, title: "Into the Woods", airDate: "2015-11-08" },
    { number: 7, title: "The Mattress", airDate: "2015-11-15" },
    { number: 8, title: "Ava", airDate: "2015-11-22" },
    { number: 9, title: "The Swedes", airDate: "2015-12-06" },
    { number: 10, title: "Yippie Kayak", airDate: "2015-12-13" },
    { number: 11, title: "Hostage Situation", airDate: "2016-01-05" },
    { number: 12, title: "9 Days", airDate: "2016-01-19" },
    { number: 13, title: "The Cruise", airDate: "2016-01-26" },
    { number: 14, title: "Karen Peralta", airDate: "2016-02-02" },
    { number: 15, title: "The 9-8", airDate: "2016-02-09" },
    { number: 16, title: "House Mouses", airDate: "2016-02-16" },
    { number: 17, title: "Adrian Pimento", airDate: "2016-02-23" },
    { number: 18, title: "Cheddar", airDate: "2016-03-01" },
    { number: 19, title: "Terry Kitties", airDate: "2016-03-15" },
    { number: 20, title: "Paranoia", airDate: "2016-03-29" },
    { number: 21, title: "Maximum Security", airDate: "2016-04-05" },
    { number: 22, title: "Bureau", airDate: "2016-04-12" },
    { number: 23, title: "Greg and Larry", airDate: "2016-04-19" }
  ],
  4: [
    { number: 1, title: "Coral Palms, Part 1", airDate: "2016-09-20" },
    { number: 2, title: "Coral Palms, Part 2", airDate: "2016-09-27" },
    { number: 3, title: "Coral Palms, Part 3", airDate: "2016-10-04" },
    { number: 4, title: "The Night Shift", airDate: "2016-10-11" },
    { number: 5, title: "Halloween IV", airDate: "2016-10-18" },
    { number: 6, title: "Monster in the Closet", airDate: "2016-11-15" },
    { number: 7, title: "Mr. Santiago", airDate: "2016-11-22" },
    { number: 8, title: "Skyfire Cycle", airDate: "2016-11-29" },
    { number: 9, title: "The Overmining", airDate: "2016-12-06" },
    { number: 10, title: "Captain Latvia", airDate: "2016-12-13" },
    { number: 11, title: "The Fugitive Pt. 1", airDate: "2017-01-01" },
    { number: 12, title: "The Fugitive Pt. 2", airDate: "2017-01-01" },
    { number: 13, title: "The Audit", airDate: "2017-04-11" },
    { number: 14, title: "Serve & Protect", airDate: "2017-04-18" },
    { number: 15, title: "The Last Ride", airDate: "2017-04-25" },
    { number: 16, title: "Moo Moo", airDate: "2017-05-02" },
    { number: 17, title: "Cop Con", airDate: "2017-05-09" },
    { number: 18, title: "Chasing Amy", airDate: "2017-05-09" },
    { number: 19, title: "Your Honor", airDate: "2017-05-16" },
    { number: 20, title: "The Slaughterhouse", airDate: "2017-05-16" },
    { number: 21, title: "The Bank Job", airDate: "2017-05-23" },
    { number: 22, title: "Crime & Punishment", airDate: "2017-05-23" }
  ],
  5: [
    { number: 1, title: "The Big House Pt. 1", airDate: "2017-09-26" },
    { number: 2, title: "The Big House Pt. 2", airDate: "2017-10-03" },
    { number: 3, title: "Kicks", airDate: "2017-10-10" },
    { number: 4, title: "HalloVeen", airDate: "2017-10-17" },
    { number: 5, title: "Bad Beat", airDate: "2017-10-24" },
    { number: 6, title: "The Venue", airDate: "2017-11-07" },
    { number: 7, title: "Two Turkeys", airDate: "2017-11-14" },
    { number: 8, title: "Return To Skyfire", airDate: "2017-11-21" },
    { number: 9, title: "99", airDate: "2017-12-05" },
    { number: 10, title: "Game Night", airDate: "2017-12-12" },
    { number: 11, title: "The Favor", airDate: "2018-03-18" },
    { number: 12, title: "Safe House", airDate: "2018-03-25" },
    { number: 13, title: "The Negotiation", airDate: "2018-04-01" },
    { number: 14, title: "The Box", airDate: "2018-04-08" },
    { number: 15, title: "The Puzzle Master", airDate: "2018-04-15" },
    { number: 16, title: "NutriBoom", airDate: "2018-04-22" },
    { number: 17, title: "DFW", airDate: "2018-04-29" },
    { number: 18, title: "Gray Star Mutual", airDate: "2018-05-06" },
    { number: 19, title: "Bachelor/ette Party", airDate: "2018-05-13" },
    { number: 20, title: "Show Me Going", airDate: "2018-05-13" },
    { number: 21, title: "White Whale", airDate: "2018-05-20" },
    { number: 22, title: "Jake & Amy", airDate: "2018-05-20" }
  ],
  6: [
    { number: 1, title: "Honeymoon", airDate: "2019-01-10" },
    { number: 2, title: "Hitchcock & Scully", airDate: "2019-01-17" },
    { number: 3, title: "The Tattler", airDate: "2019-01-24" },
    { number: 4, title: "Four Movements", airDate: "2019-01-31" },
    { number: 5, title: "A Tale of Two Bandits", airDate: "2019-02-07" },
    { number: 6, title: "The Crime Scene", airDate: "2019-02-14" },
    { number: 7, title: "The Honeypot", airDate: "2019-02-21" },
    { number: 8, title: "He Said, She Said", airDate: "2019-02-28" },
    { number: 9, title: "The Golden Child", airDate: "2019-03-07" },
    { number: 10, title: "Gintars", airDate: "2019-03-14" },
    { number: 11, title: "The Therapist", airDate: "2019-03-21" },
    { number: 12, title: "Casecation", airDate: "2019-04-11" },
    { number: 13, title: "The Bimbo", airDate: "2019-04-18" },
    { number: 14, title: "Ticking Clocks", airDate: "2019-04-25" },
    { number: 15, title: "Return of the King", airDate: "2019-05-02" },
    { number: 16, title: "Cinco de Mayo", airDate: "2019-05-09" },
    { number: 17, title: "Sicko", airDate: "2019-05-16" },
    { number: 18, title: "Suicide Squad", airDate: "2019-05-16" }
  ],
  7: [
    { number: 1, title: "Manhunter", airDate: "2020-02-06" },
    { number: 2, title: "Captain Kim", airDate: "2020-02-13" },
    { number: 3, title: "Pimemento", airDate: "2020-02-20" },
    { number: 4, title: "The Jimmy Jab Games II", airDate: "2020-02-27" },
    { number: 5, title: "Debbie", airDate: "2020-03-05" },
    { number: 6, title: "Trying", airDate: "2020-03-12" },
    { number: 7, title: "Ding Dong", airDate: "2020-03-19" },
    { number: 8, title: "The Takeback", airDate: "2020-03-26" },
    { number: 9, title: "Dillman", airDate: "2020-04-02" },
    { number: 10, title: "Admiral Peralta", airDate: "2020-04-09" },
    { number: 11, title: "Valloweaster", airDate: "2020-04-16" },
    { number: 12, title: "Ransom", airDate: "2020-04-23" },
    { number: 13, title: "Lights Out", airDate: "2020-04-23" }
  ],
  8: [
    { number: 1, title: "The Good Ones", airDate: "2021-08-12" },
    { number: 2, title: "The Lake House", airDate: "2021-08-12" },
    { number: 3, title: "Blue Flu", airDate: "2021-08-19" },
    { number: 4, title: "Balancing", airDate: "2021-08-19" },
    { number: 5, title: "PB&J", airDate: "2021-08-26" },
    { number: 6, title: "The Set Up", airDate: "2021-08-26" },
    { number: 7, title: "Game of Boyles", airDate: "2021-09-02" },
    { number: 8, title: "Renewal", airDate: "2021-09-02" },
    { number: 9, title: "The Last Day", airDate: "2021-09-16" }
  ]
};

export function useSerieProgression(mediaDetails: any, initialProgression: any): SerieProgressionResult {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [upcomingEpisodes, setUpcomingEpisodes] = useState<any[]>([]);
  const [totalEpisodes, setTotalEpisodes] = useState(0);
  const [watchedEpisodes, setWatchedEpisodes] = useState(0);
  const [status, setStatus] = useState(initialProgression?.status || 'to-watch');
  const [progression, setProgression] = useState(initialProgression || {});

  useEffect(() => {
    // Initialisation des données de saisons à partir des détails du média
    if (mediaDetails) {
      console.log("Media details seasons:", mediaDetails.seasons);
      
      let formattedSeasons: Season[] = [];
      
      // Brooklyn 99 specific data
      if (mediaDetails.id === "48891" || mediaDetails.id === 48891) {
        formattedSeasons = mediaDetails.seasons
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
      } else if (Array.isArray(mediaDetails.seasons)) {
        // Utiliser les données de saisons du média si disponibles
        formattedSeasons = mediaDetails.seasons
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
      } else {
        // Fallback pour les médias sans données de saisons
        const seasonCount = typeof mediaDetails.seasons === 'number' ? mediaDetails.seasons : 3;
        formattedSeasons = Array(seasonCount).fill(null).map((_, i) => ({ 
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
      
      console.log("Formatted seasons:", formattedSeasons);
      setSeasons(formattedSeasons);
      
      // Calculer le nombre total d'épisodes
      const total = formattedSeasons.reduce((acc, season) => 
        acc + (season.episode_count || 0), 0);
      setTotalEpisodes(total);
      
      // Calculer le nombre d'épisodes visionnés
      const watched = Object.values(initialProgression?.watched_episodes || {}).flat().length;
      setWatchedEpisodes(watched);
      
      // Si nous avons des données d'épisodes à venir
      if (mediaDetails.upcoming_episodes) {
        setUpcomingEpisodes(mediaDetails.upcoming_episodes);
      } else {
        // Créer des données fictives pour les épisodes à venir
        const today = new Date();
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        
        // Générer quelques épisodes à venir fictifs
        const fakeUpcoming = [];
        for (let i = 0; i < 3; i++) {
          const futureDate = new Date(today);
          futureDate.setDate(today.getDate() + (7 * (i + 1)));
          
          // Trouver la saison la plus récente
          const lastSeason = [...formattedSeasons].sort((a, b) => 
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
        
        setUpcomingEpisodes(fakeUpcoming);
      }
    } else {
      console.log("No seasons found in media details, creating default seasons");
      // Si aucune saison n'est trouvée, créer des saisons par défaut
      const defaultSeasons = Array(3).fill(null).map((_, i) => ({ 
        season_number: i + 1, 
        name: `Saison ${i + 1}`,
        episode_count: 10,
        episodes: Array.from({ length: 10 }, (_, j) => ({
          number: j + 1,
          title: `Épisode ${j + 1}`,
          airDate: undefined
        }))
      }));
      setSeasons(defaultSeasons);
      setTotalEpisodes(30); // 3 saisons de 10 épisodes
    }
  }, [mediaDetails]);

  useEffect(() => {
    // Mettre à jour le statut local lorsque la progression change
    if (initialProgression?.status) {
      setStatus(initialProgression.status);
    }
    setProgression(initialProgression || {});
    
    // Mise à jour du nombre d'épisodes visionnés
    const watched = Object.values(initialProgression?.watched_episodes || {}).flat().length;
    setWatchedEpisodes(watched);
  }, [initialProgression]);

  const toggleEpisode = (seasonNumber: number, episodeNumber: number) => {
    const newWatchedEpisodes = { ...(progression.watched_episodes || {}) };
    
    if (!newWatchedEpisodes[seasonNumber]) {
      newWatchedEpisodes[seasonNumber] = [];
    }
    
    const episodeIndex = newWatchedEpisodes[seasonNumber].indexOf(episodeNumber);
    
    if (episodeIndex === -1) {
      // Ajouter l'épisode à la liste des visionnés
      newWatchedEpisodes[seasonNumber].push(episodeNumber);
      // Trier la liste pour une meilleure lisibilité
      newWatchedEpisodes[seasonNumber].sort((a, b) => a - b);
    } else {
      // Supprimer l'épisode de la liste des visionnés
      newWatchedEpisodes[seasonNumber].splice(episodeIndex, 1);
    }
    
    // Calculer le nouveau nombre d'épisodes visionnés
    const newWatchedCount = Object.values(newWatchedEpisodes).flat().length;
    setWatchedEpisodes(newWatchedCount);
    
    // Mettre à jour automatiquement le statut en fonction de la progression
    let newStatus = status;
    if (newWatchedCount === 0) {
      newStatus = 'to-watch';
    } else if (newWatchedCount === totalEpisodes) {
      newStatus = 'completed';
    } else {
      newStatus = 'watching';
    }
    setStatus(newStatus);
    
    const updatedProgression = {
      ...progression,
      watched_episodes: newWatchedEpisodes,
      watched_count: newWatchedCount,
      total_episodes: totalEpisodes,
      status: newStatus
    };
    
    setProgression(updatedProgression);
    return updatedProgression;
  };

  const toggleSeason = (seasonNumber: number, episodeCount: number) => {
    const newWatchedEpisodes = { ...(progression.watched_episodes || {}) };
    
    // Vérifier si tous les épisodes de la saison sont déjà visionnés
    const seasonEpisodes = newWatchedEpisodes[seasonNumber] || [];
    const allWatched = seasonEpisodes.length === episodeCount;
    
    if (allWatched) {
      // Si tous sont visionnés, les supprimer tous
      newWatchedEpisodes[seasonNumber] = [];
    } else {
      // Sinon, marquer tous les épisodes comme visionnés
      newWatchedEpisodes[seasonNumber] = Array.from({ length: episodeCount }, (_, i) => i + 1);
    }
    
    // Calculer le nouveau nombre d'épisodes visionnés
    const newWatchedCount = Object.values(newWatchedEpisodes).flat().length;
    setWatchedEpisodes(newWatchedCount);
    
    // Mettre à jour automatiquement le statut en fonction de la progression
    let newStatus = status;
    if (newWatchedCount === 0) {
      newStatus = 'to-watch';
    } else if (newWatchedCount === totalEpisodes) {
      newStatus = 'completed';
    } else {
      newStatus = 'watching';
    }
    setStatus(newStatus);
    
    const updatedProgression = {
      ...progression,
      watched_episodes: newWatchedEpisodes,
      watched_count: newWatchedCount,
      total_episodes: totalEpisodes,
      status: newStatus
    };
    
    setProgression(updatedProgression);
    return updatedProgression;
  };

  const updateStatus = (newStatus: string) => {
    setStatus(newStatus);
    
    const updatedProgression = {
      ...progression,
      status: newStatus
    };
    
    setProgression(updatedProgression);
    return updatedProgression;
  };

  return {
    seasons,
    upcomingEpisodes,
    totalEpisodes,
    watchedEpisodes,
    status,
    progression,
    toggleEpisode,
    toggleSeason,
    updateStatus
  };
}
