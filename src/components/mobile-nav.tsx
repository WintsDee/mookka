
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
  
  // Cache la navigation sur les pages de détail de média et sur la page "Soutenir"
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
      <div className="grid grid-cols-5 gap-2 py-3 pb-6 px-4">
        {navItems.map((item) => (
          <Link 
            key={item.path} 
            to={item.path} 
            className={`flex flex-col items-center justify-center ${
              item.special 
                ? 'bg-gradient-to-br from-purple-500/90 to-purple-700/90 backdrop-blur-lg text-white rounded-2xl shadow-xl shadow-purple-500/20 transform -translate-y-6 scale-110 hover:scale-115 hover:shadow-purple-500/30 transition-all duration-300 animate-pulse-slow' 
                : (location.pathname === item.path ? 'text-[#3B82F6]' : 'text-muted-foreground')
            } ${item.special ? 'w-16 h-16 justify-center' : ''}`}
          >
            <item.icon 
              size={item.special ? 28 : 22} 
              className={item.special ? 'filter drop-shadow-lg' : ''}
            />
            <span className={`text-xs mt-1.5 ${
              item.special ? 'text-white font-medium tracking-wide' : ''
            }`}>
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

