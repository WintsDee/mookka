
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Home, BookOpen, Search, Activity } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";

export function MobileNav() {
  const location = useLocation();
  const { isLoading, user } = useAuth();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="mobile-nav">
      <div className="flex items-center justify-around">
        <Link
          to="/bibliotheque"
          className={`flex flex-col items-center justify-center min-w-[60px] pt-1 pb-1 text-xs ${
            isActive("/bibliotheque") 
              ? "text-primary" 
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <BookOpen className="h-5 w-5 mb-1" />
          <span>Bibliothèque</span>
        </Link>
        
        <Link
          to="/recherche"
          className={`flex flex-col items-center justify-center min-w-[60px] pt-1 pb-1 text-xs ${
            isActive("/recherche") 
              ? "text-primary" 
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Search className="h-5 w-5 mb-1" />
          <span>Recherche</span>
        </Link>
        
        <Link
          to="/social"
          className={`flex flex-col items-center justify-center min-w-[60px] pt-1 pb-1 text-xs ${
            isActive("/social") 
              ? "text-primary" 
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Activity className="h-5 w-5 mb-1" />
          <span>Social</span>
        </Link>
        
        <Link
          to={user ? "/profil" : "/auth"}
          className={`flex flex-col items-center justify-center min-w-[60px] pt-1 pb-1 text-xs ${
            isActive("/profil") || isActive("/auth")
              ? "text-primary" 
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {!isLoading && (
            <div className="relative">
              {user ? (
                <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-[10px] font-bold mb-1">
                  {user.email?.charAt(0).toUpperCase() || "U"}
                </div>
              ) : (
                <div className="h-5 w-5 rounded-full border border-primary flex items-center justify-center text-primary text-[10px] font-bold mb-1">
                  ?
                </div>
              )}
            </div>
          )}
          <span>{user ? 'Profil' : 'Connexion'}</span>
        </Link>
      </div>
    </div>
  );
}
