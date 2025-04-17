
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, BookOpen, Search, Activity, Bell } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";

export function MobileNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoading, user } = useAuth();
  
  const isActive = (path: string) => location.pathname === path;
  
  const handleNavigation = (path: string) => {
    navigate(path);
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border/40 pt-2 pb-safe z-40">
      <div className="mx-auto px-4">
        <div className="flex items-center justify-around">
          <div
            onClick={() => handleNavigation("/")}
            className={`flex flex-col items-center justify-center min-w-[60px] pt-1 pb-1 text-xs cursor-pointer ${
              isActive("/") 
                ? "text-primary" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Home className="h-5 w-5 mb-1" />
            <span>Accueil</span>
          </div>
          
          <div
            onClick={() => handleNavigation("/bibliotheque")}
            className={`flex flex-col items-center justify-center min-w-[60px] pt-1 pb-1 text-xs cursor-pointer ${
              isActive("/bibliotheque") 
                ? "text-primary" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <BookOpen className="h-5 w-5 mb-1" />
            <span>Bibliothèque</span>
          </div>
          
          <div
            onClick={() => handleNavigation("/recherche")}
            className={`flex flex-col items-center justify-center min-w-[60px] pt-1 pb-1 text-xs cursor-pointer ${
              isActive("/recherche") 
                ? "text-primary" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Search className="h-5 w-5 mb-1" />
            <span>Recherche</span>
          </div>
          
          <div
            onClick={() => handleNavigation("/social")}
            className={`flex flex-col items-center justify-center min-w-[60px] pt-1 pb-1 text-xs cursor-pointer ${
              isActive("/social") 
                ? "text-primary" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Activity className="h-5 w-5 mb-1" />
            <span>Social</span>
          </div>
          
          <div
            onClick={() => handleNavigation("/profil")}
            className={`flex flex-col items-center justify-center min-w-[60px] pt-1 pb-1 text-xs cursor-pointer ${
              isActive("/profil") || isActive("/auth")
                ? "text-primary" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {!isLoading && (
              <div className="relative">
                {/* Toujours utiliser l'avatar basique en phase de test */}
                <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-[10px] font-bold mb-1">
                  U
                </div>
              </div>
            )}
            <span>Profil</span>
          </div>
        </div>
      </div>
    </div>
  );
};
