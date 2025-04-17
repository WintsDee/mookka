
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Search, 
  MessagesSquare, 
  Globe,
  Bookmark,
  Library
} from 'lucide-react';
import { usePWAStatus } from '@/hooks/use-pwa-status';

export function MobileNav() {
  const location = useLocation();
  const { isPWA } = usePWAStatus();
  
  // Hide navigation on media detail pages
  if (location.pathname.startsWith('/media/')) {
    return null;
  }

  // Get padding class based on whether this is PWA or not
  const paddingClass = isPWA ? 'pb-6' : 'pb-safe';

  const navItems = [
    { path: '/bibliotheque', icon: Library, label: 'Bibliothèque' },
    { path: '/collections', icon: Bookmark, label: 'Collections' },
    { path: '/recherche', icon: Search, label: 'Recherche' },
    { path: '/social', icon: MessagesSquare, label: 'Social' },
    { path: '/actualites', icon: Globe, label: 'Actualités' },
  ];

  return (
    <nav className={`fixed bottom-0 left-0 right-0 bg-[#0F1524] border-t ${paddingClass} z-50`}>
      <div className="grid grid-cols-5 gap-2 py-3 pb-6 px-4">
        {navItems.map((item) => (
          <Link 
            key={item.path} 
            to={item.path} 
            className={`flex flex-col items-center justify-center transition-colors duration-200 ${
              location.pathname === item.path ? 'text-[#3B82F6]' : 'text-muted-foreground'
            }`}
            onClick={(e) => {
              // Prevent navigation if we're already on this page to avoid double rendering
              if (location.pathname === item.path) {
                e.preventDefault();
              }
            }}
          >
            <item.icon size={22} />
            <span className="text-xs mt-1.5">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
