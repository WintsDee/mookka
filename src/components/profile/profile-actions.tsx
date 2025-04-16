
import React from "react";
import { Button } from "@/components/ui/button";
import { LogOut, HelpCircle } from "lucide-react";
import { FeedbackModule } from "@/components/help/feedback-module";

interface ProfileActionsProps {
  isAuthenticated: boolean;
  onLogout: () => Promise<void>;
}

export function ProfileActions({ isAuthenticated, onLogout }: ProfileActionsProps) {
  if (!isAuthenticated) return null;
  
  return (
    <div className="mt-8 space-y-3">
      <div className="flex justify-center">
        <FeedbackModule />
      </div>
      
      <Button 
        variant="outline" 
        className="w-full flex items-center justify-center gap-2 text-destructive border-destructive/30"
        onClick={onLogout}
      >
        <LogOut size={16} />
        Se déconnecter
      </Button>
    </div>
  );
}
