
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
    name: 'Ecran Large',
    url: 'https://www.ecranlarge.com/',
    category: 'film',
    rss: 'https://www.ecranlarge.com/rss'
  },
  
  // Livres
  {
    name: 'ActuaLitté',
    url: 'https://actualitte.com/',
    category: 'book',
    rss: 'https://actualitte.com/rss'
  },
  {
    name: 'Babelio',
    url: 'https://www.babelio.com/',
    category: 'book',
    rss: 'https://www.babelio.com/rss/actualites.xml'
  },
  {
    name: 'Éditions Points',
    url: 'https://www.editionspoints.com/',
    category: 'book',
    rss: 'https://www.editionspoints.com/rss'
  },
  
  // Jeux Vidéo
  {
    name: 'Jeuxvideo.com',
    url: 'https://www.jeuxvideo.com/',
    category: 'game',
    rss: 'https://www.jeuxvideo.com/rss/rss.xml'
  },
  {
    name: 'JeuxActu',
    url: 'https://www.jeuxactu.com/',
    category: 'game',
    rss: 'https://www.jeuxactu.com/rss'
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
  {
    name: 'Fnac',
    url: 'https://leclaireur.fnac.com/',
    category: 'general',
    rss: 'https://leclaireur.fnac.com/feed/'
  },
];
