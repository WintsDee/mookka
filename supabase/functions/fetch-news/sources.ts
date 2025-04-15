
import { NewsSource } from './types.ts';

export const SOURCES: NewsSource[] = [
  {
    name: 'ActuGaming',
    url: 'https://www.actugaming.net/',
    category: 'game',
    rss: 'https://www.actugaming.net/feed/'
  },
  {
    name: 'Ecran Large',
    url: 'https://www.ecranlarge.com/',
    category: 'film',
    rss: 'https://www.ecranlarge.com/rss.xml'
  },
  {
    name: 'ActuaLitté',
    url: 'https://www.actualitte.com/',
    category: 'book',
    rss: 'https://www.actualitte.com/flux/rss/actualites'
  },
  {
    name: 'Fnac',
    url: 'https://leclaireur.fnac.com/',
    category: 'general',
    rss: 'https://leclaireur.fnac.com/feed/'
  },
  {
    name: 'Numerama',
    url: 'https://www.numerama.com/',
    category: 'general',
    rss: 'https://www.numerama.com/feed/'
  },
  {
    name: 'Jeuxvideo.com',
    url: 'https://www.jeuxvideo.com/',
    category: 'game',
    rss: 'https://www.jeuxvideo.com/rss/rss.xml'
  },
  {
    name: 'Le Monde Culture',
    url: 'https://www.lemonde.fr/culture/',
    category: 'general',
  },
];
