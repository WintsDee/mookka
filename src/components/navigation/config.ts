
import { 
  Search, 
  MessagesSquare, 
  Settings,
  Bookmark,
  Library  
} from 'lucide-react';
import { NavigationItem } from './types';

export const navigationItems: NavigationItem[] = [
  { path: '/bibliotheque', icon: Library, label: 'Bibliothèque' },
  { path: '/collections', icon: Bookmark, label: 'Collections' },
  { path: '/recherche', icon: Search, label: 'Recherche', special: true },
  { path: '/social', icon: MessagesSquare, label: 'Social' },
  { path: '/settings', icon: Settings, label: 'Paramètres' },
];
