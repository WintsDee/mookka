
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { User, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const MobileHeader = () => {
  const location = useLocation();
  const isProfileActive = location.pathname === "/profil";
  
  return (
    <div className="mobile-header fixed top-0 left-0 right-0 flex justify-between items-center bg-background border-b border-border p-3 pt-safe h-16">
      {/* Logo ou titre de l'app à gauche */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 flex-shrink-0">
          <img 
            src="/lovable-uploads/59160824-2c34-4d40-82c6-d9f9f5b4d1f3.png" 
            alt="Mookka Logo" 
            className="w-full h-full object-contain"
          />
        </div>
      </div>
      
      {/* Icônes à droite */}
      <div className="flex items-center gap-4">
        <Link to="/notifications" className="relative">
          <Bell size={24} className="text-muted-foreground hover:text-foreground transition-colors" />
          {/* Notification indicator */}
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-primary"></span>
        </Link>
        
        <Link
          to="/profil"
          className={cn(
            "flex items-center justify-center",
            isProfileActive 
              ? "text-primary" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Avatar className="h-8 w-8 border border-muted">
            <AvatarFallback className="bg-primary/10 text-primary">
              <User size={18} />
            </AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </div>
  );
};

export { MobileHeader };
