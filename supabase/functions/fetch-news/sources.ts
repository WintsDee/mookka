
import { NewsSource } from './types.ts';

export const SOURCES: NewsSource[] = [
  // Cinéma et Séries
  {
    name: 'CineSeries',
    url: 'https://www.cineserie.com/',
    category: 'serie',
    rss: 'https://www.cineserie.com/feed/'
  },
  {
    name: 'Première',
    url: 'https://www.premiere.fr/',
    category: 'film',
    rss: 'https://www.premiere.fr/rss'
  },
  {
    name: 'CinémaTeaser',
    url: 'https://www.cinemateaser.com/',
    category: 'film',
    rss: 'https://www.cinemateaser.com/feed/'
  },
  {
    name: 'Ecran Large',
    url: 'https://www.ecranlarge.com/',
    category: 'film',
    rss: 'https://www.ecranlarge.com/rss'
  },
  
  // Livres
  {
    name: 'Actualitté',
    url: 'https://actualitte.com',
    category: 'book',
    rss: 'https://actualitte.com/rss'
  },
  {
    name: 'Idboox',
    url: 'https://www.idboox.com/',
    category: 'book',
    rss: 'https://www.idboox.com/feed/'
  },
  {
    name: 'Librairie Mollat',
    url: 'https://www.mollat.com/',
    category: 'book',
    rss: 'https://www.mollat.com/rss/selections'
  },
  
  // Jeux Vidéo
  {
    name: 'ActuGaming',
    url: 'https://www.actugaming.net/',
    category: 'game',
    rss: 'https://www.actugaming.net/rss'
  },
  {
    name: 'Gamekult',
    url: 'https://www.gamekult.com/',
    category: 'game',
    rss: 'https://www.gamekult.com/rss.xml'
  },
  {
    name: 'Canard PC',
    url: 'https://www.canardpc.com/',
    category: 'game',
    rss: 'https://www.canardpc.com/flux-rss/'
  },
];
