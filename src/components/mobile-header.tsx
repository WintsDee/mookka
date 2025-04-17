
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { User, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/use-profile";
import { HelpFeedback } from "@/components/profile/help-feedback";

interface MobileHeaderProps {
  title?: string;
  children?: React.ReactNode;
}

const MobileHeader = ({ title, children }: MobileHeaderProps) => {
  const location = useLocation();
  const isProfileActive = location.pathname === "/profil";
  const isNotificationsActive = location.pathname === "/notifications";
  
  const { profile } = useProfile();
  
  return (
    <div className="mobile-header fixed top-0 left-0 right-0 flex justify-between items-center bg-background px-6 pt-safe pb-4 h-auto min-h-16 z-50">
      {title && <h1 className="text-lg font-semibold">{title}</h1>}
      
      <div className="w-8 h-8 flex-shrink-0">
        {!title && (
          <img 
            src="/lovable-uploads/59160824-2c34-4d40-82c6-d9f9f5b4d1f3.png" 
            alt="Mookka Logo" 
            className="w-full h-full object-contain"
          />
        )}
      </div>
      
      <div className="flex items-center gap-4">
        {children}
        {/* Formulaire d'aide caché mais accessible via data attribute */}
        <div className="hidden">
          <HelpFeedback data-help-feedback-trigger />
        </div>
        
        <Link to="/notifications" className={cn(
          "relative",
          isNotificationsActive ? "text-primary" : "text-muted-foreground"
        )}>
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
          {profile?.avatar_url ? (
            <Avatar className="w-8 h-8 border border-border/20">
              <AvatarImage 
                src={profile.avatar_url} 
                alt={profile?.username || "Utilisateur"}
                className="object-cover w-full h-full"
              />
              <AvatarFallback>
                <User size={20} />
              </AvatarFallback>
            </Avatar>
          ) : (
            <Avatar className="w-8 h-8 border border-border/20">
              <AvatarFallback>
                <User size={20} />
              </AvatarFallback>
            </Avatar>
          )}
        </Link>
      </div>
    </div>
  );
};

export { MobileHeader };
