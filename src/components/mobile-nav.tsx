
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Library, 
  Search, 
  Users, 
  BookOpen,  // Ajout d'une icône pour les collections
} from 'lucide-react';

export function MobileNav() {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Accueil' },
    { path: '/bibliotheque', icon: Library, label: 'Bibliothèque' },
    { path: '/collections', icon: BookOpen, label: 'Collections' }, // Nouvel onglet Collections
    { path: '/recherche', icon: Search, label: 'Recherche' },
    { path: '/social', icon: Users, label: 'Social' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t">
      <div className="grid grid-cols-5 gap-2 py-2">
        {navItems.map((item) => (
          <Link 
            key={item.path} 
            to={item.path} 
            className={`flex flex-col items-center justify-center ${
              location.pathname === item.path ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <item.icon size={20} />
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
