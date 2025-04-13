
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
    rss: 'https://www.ecranlarge.com/rss'
  },
  {
    name: 'ActuaLitté',
    url: 'https://www.actualitte.com/',
    category: 'book',
    rss: 'https://www.actualitte.com/rss/flux.xml'
  },
  {
    name: 'Fnac',
    url: 'https://leclaireur.fnac.com/',
    category: 'general',
  },
  {
    name: 'Le Monde Culture',
    url: 'https://www.lemonde.fr/culture/',
    category: 'general',
  },
];
