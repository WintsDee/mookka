
import { NewsSource } from './types.ts';

export const SOURCES: NewsSource[] = [
  // Cinéma et Séries
  {
    name: 'AlloCiné',
    url: 'https://www.allocine.fr/',
    category: 'film',
    rss: 'https://www.allocine.fr/rss/news.xml'
  },
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
  
  // Livres
  {
    name: 'Fnac',
    url: 'https://leclaireur.fnac.com/',
    category: 'book',
    rss: 'https://leclaireur.fnac.com/feed/'
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
    name: 'Jeuxvideo.com',
    url: 'https://www.jeuxvideo.com/',
    category: 'game',
    rss: 'https://www.jeuxvideo.com/rss/rss.xml'
  },
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
  
  // Sources généralistes
  {
    name: 'Numerama',
    url: 'https://www.numerama.com/',
    category: 'general',
    rss: 'https://www.numerama.com/feed/'
  },
];
