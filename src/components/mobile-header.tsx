
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { User, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { currentUser } from "@/data/mockData";

interface MobileHeaderProps {
  title?: string;
  children?: React.ReactNode;
}

const MobileHeader = ({ title, children }: MobileHeaderProps) => {
  const location = useLocation();
  const isProfileActive = location.pathname === "/profil";
  const isNotificationsActive = location.pathname === "/notifications";
  
  // Random avatar for visitors
  const [randomAvatar, setRandomAvatar] = useState("");
  
  useEffect(() => {
    // List of random avatars
    const avatarOptions = [
      "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=150&h=150&auto=format",
      "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=150&h=150&auto=format",
      "https://images.unsplash.com/photo-1501286353178-1ec881214838?w=150&h=150&auto=format",
      "https://images.unsplash.com/photo-1485833077593-4278bba3f11f?w=150&h=150&auto=format"
    ];
    
    // Random avatar selection
    const randomIndex = Math.floor(Math.random() * avatarOptions.length);
    setRandomAvatar(avatarOptions[randomIndex]);
  }, []);
  
  return (
    <div className="mobile-header fixed top-0 left-0 right-0 flex justify-between items-center bg-background px-6 py-4 h-16 z-50 border-b border-border/10">
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
          isNotificationsActive ? "text-[#33C3F0]" : "text-muted-foreground"
        )}>
          <Bell size={24} className={isNotificationsActive ? "animate-scale-in" : ""} />
          {/* Notification indicator */}
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#33C3F0]"></span>
        </Link>
        
        <Link
          to="/profil"
          className={cn(
            "flex items-center justify-center",
            isProfileActive 
              ? "text-[#33C3F0]" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Avatar className="w-8 h-8">
            <AvatarImage src={currentUser.avatar || randomAvatar} alt={currentUser.name} />
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
