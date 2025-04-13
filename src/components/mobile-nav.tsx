
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { MessageCircle, Search, User, LibraryBig, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const MobileNav = () => {
  const location = useLocation();
  
  // Navigation items with updated order and social icon
  const navItems = [
    { icon: LibraryBig, path: "/bibliotheque", label: "Bibliothèque" },
    { icon: MessageCircle, path: "/social", label: "Social" },
    { icon: Search, path: "/recherche", label: "Recherche" },
    { icon: Globe, path: "/actualites", label: "Actualités" },
    { icon: User, path: "/profil", label: "Profil" }
  ];

  return (
    <div className="mobile-nav">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        
        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center justify-center gap-1",
              isActive 
                ? "text-primary" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <item.icon size={20} className={isActive ? "animate-scale-in" : ""} />
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
};

export { MobileNav };
