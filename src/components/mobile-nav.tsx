
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SearchButton } from './navigation/SearchButton';
import { NavItem } from './navigation/NavItem';
import { navigationItems } from './navigation/config';

export function MobileNav() {
  const location = useLocation();
  
  if (location.pathname.startsWith('/media/') || location.pathname === '/soutenir') {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#0F1524] border-t pb-safe z-50">
      <div className="grid grid-cols-5 gap-2 py-3 pb-6 px-4 relative">
        {navigationItems.map((item) => (
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
