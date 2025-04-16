
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { User, Bell, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
    <div className="mobile-header fixed top-0 left-0 right-0 flex justify-between items-center bg-background px-6 py-4 h-16 z-50">
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
        <div className="hidden">
          {/* Hidden HelpFeedback component for programmatic triggering */}
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
            <Avatar className="w-8 h-8">
              <AvatarImage 
                src={profile.avatar_url} 
                alt={profile?.username || "Utilisateur"}
                className="object-cover"
              />
              <AvatarFallback>
                <User size={20} />
              </AvatarFallback>
            </Avatar>
          ) : (
            <Avatar className="w-8 h-8">
              <AvatarFallback>
                <User size={20} />
              </AvatarFallback>
            </Avatar>
          )}
        </Link>
        
        {/* Help button added to the header */}
        <Button 
          variant="ghost" 
          size="icon"
          className="text-muted-foreground hover:text-foreground"
          onClick={() => {
            // Find and click the hidden trigger button
            const helpFeedback = document.querySelector('[data-help-feedback-trigger]') as HTMLButtonElement;
            if (helpFeedback) {
              helpFeedback.click();
            }
          }}
        >
          <HelpCircle size={20} />
        </Button>
      </div>
    </div>
  );
};

export { MobileHeader };
