
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { User, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProfile } from "@/hooks/use-profile";

interface MobileHeaderProps {
  title?: string;
  children?: React.ReactNode;
}

// Using an abstract image that fits with the app's style
const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1493397212122-2b85dda8106b?q=80&w=1635&auto=format&fit=crop";

const MobileHeader = ({ title, children }: MobileHeaderProps) => {
  const location = useLocation();
  const isProfileActive = location.pathname === "/profil";
  const isNotificationsActive = location.pathname === "/notifications";
  
  const { profile } = useProfile();
  
  return (
    <div className="mobile-header fixed top-0 left-0 right-0 flex justify-between items-center bg-background px-6 py-4 h-16">
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
          <Avatar className="w-8 h-8">
            <AvatarImage 
              src={profile?.avatar_url || DEFAULT_AVATAR} 
              alt={profile?.username || "Utilisateur"} 
            />
            <AvatarFallback>
              <User size={20} />
            </AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </div>
  );
};

export { MobileHeader };
