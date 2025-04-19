
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { User, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/use-profile";
import { HelpFeedback } from "@/components/profile/help-feedback";

interface MobileHeaderProps {
  title?: string;
  children?: React.ReactNode;
  showBackButton?: boolean;
}

const MobileHeader = ({ title, children, showBackButton = false }: MobileHeaderProps) => {
  const location = useLocation();
  const isProfileActive = location.pathname === "/profil";
  const isSoutienPage = location.pathname === "/soutenir";
  
  const { profile } = useProfile();
  
  return (
    <div className="mobile-header fixed top-0 left-0 right-0 flex justify-between items-center bg-background px-6 py-4 h-16 z-50">
      {showBackButton && (
        <Link to="/" className="absolute left-4 top-1/2 -translate-y-1/2 transition-opacity duration-200">
          <ArrowLeft size={24} />
        </Link>
      )}

      {title && <h1 className="text-lg font-semibold w-full text-left transition-opacity duration-200">{title}</h1>}
      
      <div className="w-8 h-8 flex-shrink-0 absolute right-6">
        {!title && !isSoutienPage && (
          <img 
            src="/lovable-uploads/59160824-2c34-4d40-82c6-d9f9f5b4d1f3.png" 
            alt="Mookka Logo" 
            className="w-full h-full object-contain"
          />
        )}
      </div>
      
      {!isSoutienPage && (
        <div className="flex items-center gap-4">
          {children}
          <div className="hidden">
            <HelpFeedback data-help-feedback-trigger />
          </div>
          
          <Link
            to="/profil"
            className={cn(
              "flex items-center justify-center transition-colors duration-200",
              isProfileActive 
                ? "text-primary" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {profile?.avatar_url ? (
              <Avatar className="w-8 h-8 border border-border/20 transition-transform duration-200">
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
              <Avatar className="w-8 h-8 border border-border/20 transition-transform duration-200">
                <AvatarFallback>
                  <User size={20} />
                </AvatarFallback>
              </Avatar>
            )}
          </Link>
        </div>
      )}
    </div>
  );
};

export { MobileHeader };
