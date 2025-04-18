
import { Compass, Home, Library, Search, Share2 } from 'lucide-react';
import { NavigationItem } from './types';

export const navigationItems: NavigationItem[] = [
  {
    path: '/',
    icon: Home,
    label: 'Accueil'
  },
  {
    path: '/bibliotheque',
    icon: Library,
    label: 'Bibliothèque'
  },
  {
    path: '/recherche',
    icon: Search,
    label: 'Recherche',
    special: true
  },
  {
    path: '/decouverte',
    icon: Compass,
    label: 'Découverte'
  },
  {
    path: '/social',
    icon: Share2,
    label: 'Social'
  }
];
