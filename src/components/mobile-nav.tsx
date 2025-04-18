
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Search, 
  MessagesSquare, 
  Globe,
  Bookmark,
  Library  
} from 'lucide-react';
import { SearchButton } from './navigation/SearchButton';
import { NavItem } from './navigation/NavItem';

export function MobileNav() {
  const location = useLocation();
  
  if (location.pathname.startsWith('/media/') || location.pathname === '/soutenir') {
    return null;
  }

  const navItems = [
    { path: '/bibliotheque', icon: Library, label: 'Bibliothèque' },
    { path: '/collections', icon: Bookmark, label: 'Collections' },
    { path: '/recherche', icon: Search, label: 'Recherche', special: true },
    { path: '/social', icon: MessagesSquare, label: 'Social' },
    { path: '/actualites', icon: Globe, label: 'Actualités' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#0F1524] border-t pb-safe z-50">
      <div className="grid grid-cols-5 gap-2 py-3 pb-6 px-4 relative">
        {navItems.map((item) => (
          <Link 
            key={item.path} 
            to={item.path} 
            className={`flex flex-col items-center justify-center ${
              item.special ? 'relative -mt-8 animate-fade-in' : ''
            } ${
              location.pathname === item.path ? 'text-[#3B82F6]' : 'text-muted-foreground'
            }`}
          >
            {item.special ? (
              <SearchButton />
            ) : (
              <NavItem 
                path={item.path}
                icon={item.icon}
                label={item.label}
                isActive={location.pathname === item.path}
              />
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
}
