
import React from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { FeedbackModule } from "@/components/help/feedback-module";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProfileActionsProps {
  isAuthenticated: boolean;
  onLogout: () => Promise<void>;
}

export function ProfileActions({ isAuthenticated, onLogout }: ProfileActionsProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className="mt-8 space-y-3">
      {/* Afficher uniquement sur les appareils de bureau, car on l'a déjà dans le header mobile */}
      <div className="hidden md:flex justify-center">
        <FeedbackModule />
      </div>
      
      {isAuthenticated && (
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center gap-2 text-destructive border-destructive/30"
          onClick={onLogout}
        >
          <LogOut size={16} />
          Se déconnecter
        </Button>
      )}
    </div>
  );
}
