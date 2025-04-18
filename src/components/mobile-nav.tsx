
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
    { path: '/recherche', icon: Search, label: 'Recherche' },
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
              location.pathname === item.path 
                ? item.path === '/recherche' 
                  ? 'text-white' 
                  : 'text-[#3B82F6]'
                : 'text-muted-foreground'
            }`}
          >
            {item.path === '/recherche' && location.pathname !== '/recherche' ? (
              <div className="absolute -top-6 w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] shadow-lg transition-all hover:scale-105">
                <Search size={26} className="text-white" />
                <span className="sr-only">{item.label}</span>
              </div>
            ) : (
              <>
                <item.icon size={item.path === '/recherche' ? 26 : 22} className={`
                  ${item.path === '/recherche' && location.pathname === '/recherche' ? 'text-[#8B5CF6]' : ''}
                `} />
                <span className={`text-xs mt-1.5 ${
                  item.path === '/recherche' && location.pathname === '/recherche' ? 'text-[#8B5CF6] font-medium' : ''
                }`}>{item.label}</span>
              </>
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
}
