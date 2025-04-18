
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
                ? 'bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] text-white rounded-full shadow-lg transform -translate-y-4 scale-110 hover:scale-115 transition-all duration-300' 
                : (location.pathname === item.path ? 'text-[#3B82F6]' : 'text-muted-foreground')
            } ${item.special ? 'w-14 h-14 justify-center' : ''}`}
          >
            <item.icon size={item.special ? 28 : 22} />
            <span className={`text-xs mt-1.5 ${item.special ? 'text-white' : ''}`}>
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
