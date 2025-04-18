
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Search, 
  MessagesSquare, 
  Globe,
  Bookmark,
  Library  
} from 'lucide-react';

export function MobileNav() {
  const location = useLocation();
  
  if (location.pathname.startsWith('/media/') || location.pathname === '/soutenir') {
    return null;
  }

  const navItems = [
    { path: '/bibliotheque', icon: Library, label: 'Bibliothèque' },
    { path: '/collections', icon: Bookmark, label: 'Collections' },
    { path: '/recherche', icon: Search, label: 'Recherche', highlight: true },
    { path: '/social', icon: MessagesSquare, label: 'Social' },
    { path: '/actualites', icon: Globe, label: 'Actualités' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#0F1524] border-t pb-safe z-50">
      <div className="grid grid-cols-5 gap-2 py-3 pb-6 px-4">
        {navItems.map((item) => (
          <Link 
            key={item.path} 
            to={item.path} 
            className={`flex flex-col items-center justify-center transition-all duration-300 ${
              location.pathname === item.path 
                ? item.highlight 
                  ? 'text-blue-400 scale-110 animate-pulse' 
                  : 'text-[#3B82F6]'
                : item.highlight
                  ? 'text-blue-400 hover:scale-110'
                  : 'text-muted-foreground hover:text-gray-300'
            }`}
          >
            <div 
              className={`rounded-full p-2 transition-all duration-300 ${
                location.pathname === item.path && item.highlight
                  ? 'bg-blue-500/20'
                  : item.highlight 
                    ? 'bg-blue-500/10 group-hover:bg-blue-500/20' 
                    : ''
              }`}
            >
              <item.icon size={22} />
            </div>
            <span className={`text-xs mt-1.5 ${
              item.highlight ? 'font-medium' : ''
            }`}>
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
