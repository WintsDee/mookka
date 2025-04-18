
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
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-tr from-violet-500 via-violet-400 to-fuchsia-400 rounded-full opacity-75 blur-sm group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gradient-to-tr from-violet-500 via-violet-400 to-fuchsia-400 p-4 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-violet-500/25">
                  <Search size={24} className="text-white" strokeWidth={2.5} />
                </div>
                <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-white opacity-90">
                  {item.label}
                </span>
              </div>
            ) : (
              <>
                <item.icon size={22} />
                <span className="text-xs mt-1.5">{item.label}</span>
              </>
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
}
