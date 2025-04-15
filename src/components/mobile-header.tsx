
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { User, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

const MobileHeader = () => {
  const location = useLocation();
  const isProfileActive = location.pathname === "/profil";
  const isNotificationsActive = location.pathname === "/notifications";
  
  return (
    <div className="mobile-header fixed top-0 left-0 right-0 flex justify-end items-center bg-background border-b border-border p-4 pt-10 ios-safe-area-pt">
      <div className="flex items-center gap-4">
        <Link 
          to="/notifications" 
          className={cn(
            "relative",
            isNotificationsActive 
              ? "text-primary" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Bell size={24} className={isNotificationsActive ? "animate-scale-in" : ""} />
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
          <User size={24} className={isProfileActive ? "animate-scale-in" : ""} />
        </Link>
      </div>
    </div>
  );
};

export { MobileHeader };
