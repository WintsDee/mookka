
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { MessageCircle, Search, LibraryBig, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const MobileNav = () => {
  const location = useLocation();
  
  // Navigation items without Profile
  const navItems = [
    { icon: LibraryBig, path: "/bibliotheque", label: "Bibliothèque" },
    { icon: MessageCircle, path: "/social", label: "Social" },
    { icon: Search, path: "/recherche", label: "Recherche" },
    { icon: Globe, path: "/actualites", label: "Actualités" }
  ];

  return (
    <div className="mobile-nav fixed bottom-0 left-0 right-0 flex justify-around bg-background border-t border-border p-2 pb-safe">
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
