
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Search, 
  MessagesSquare, 
  Globe,
  Bookmark,
} from 'lucide-react';

// Custom Library Icon Component matching the exact design
const BookIcon = ({ size = 22, className = '' }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

export function MobileNav() {
  const location = useLocation();
  
  // Hide navigation on media detail pages
  if (location.pathname.startsWith('/media/')) {
    return null;
  }

  const navItems = [
    { path: '/bibliotheque', icon: BookIcon, label: 'Bibliothèque' },
    { path: '/collections', icon: Bookmark, label: 'Collections' },
    { path: '/recherche', icon: Search, label: 'Recherche' },
    { path: '/social', icon: MessagesSquare, label: 'Social' },
    { path: '/actualites', icon: Globe, label: 'Actualités' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#0F1524] border-t pb-safe z-50">
      <div className="grid grid-cols-5 gap-2 py-3 pb-6 px-4"> {/* Added px-4 for horizontal padding */}
        {navItems.map((item) => (
          <Link 
            key={item.path} 
            to={item.path} 
            className={`flex flex-col items-center justify-center ${
              location.pathname === item.path ? 'text-[#3B82F6]' : 'text-muted-foreground'
            }`}
          >
            <item.icon size={22} />
            <span className="text-xs mt-1.5">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
