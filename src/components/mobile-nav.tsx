
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';
import { BookMarked } from 'lucide-react';

// Custom icons that match the style from the image
const BibliothequeIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M7 6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V6Z" />
    <path d="M5 8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2" />
    <path d="M5 4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2" />
  </svg>
);

const SocialIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2" />
    <path d="M8 12h8" />
    <path d="M10 9h4" />
    <path d="M14 6h1" />
    <path d="M19 6V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1" />
  </svg>
);

const ActualitesIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

export function MobileNav() {
  const location = useLocation();

  const navItems = [
    { path: '/bibliotheque', icon: BibliothequeIcon, label: 'Bibliothèque' },
    { path: '/collections', icon: BookMarked, label: 'Collections' },
    { path: '/recherche', icon: Search, label: 'Recherche' },
    { path: '/social', icon: SocialIcon, label: 'Social' },
    { path: '/actualites', icon: ActualitesIcon, label: 'Actualités' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#0F1524] border-t pb-safe z-50">
      <div className="grid grid-cols-5 gap-2 py-3 pb-7">
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
