
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BookOpen, 
  MessageCircle, 
  Search, 
  Globe,
  BookmarkIcon,
} from 'lucide-react';
import { cn } from "@/lib/utils";

export function MobileNav() {
  const location = useLocation();

  const navItems = [
    { path: '/bibliotheque', icon: BookOpen, label: 'Bibliothèque' },
    { path: '/collections', icon: BookmarkIcon, label: 'Collections' },
    { path: '/recherche', icon: Search, label: 'Recherche' },
    { path: '/social', icon: MessageCircle, label: 'Social' },
    { path: '/actualites', icon: Globe, label: 'Actualités' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#1A1F2C] border-t border-border/30 pb-safe z-50">
      <div className="grid grid-cols-5 gap-1 py-3">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path} 
              to={item.path} 
              className="flex flex-col items-center justify-center py-1.5"
            >
              <div className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full mb-1",
                isActive ? "text-[#33C3F0]" : "text-neutral-400",
              )}>
                <item.icon size={22} strokeWidth={1.8} />
              </div>
              <span className={cn(
                "text-xs font-medium",
                isActive ? "text-[#33C3F0]" : "text-neutral-400"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
