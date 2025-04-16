
import React from "react";
import { Button } from "@/components/ui/button";
import { LogOut, Heart } from "lucide-react";
import { Link } from "react-router-dom";

interface ProfileActionsProps {
  isAuthenticated: boolean;
  onLogout: () => Promise<void>;
}

export function ProfileActions({ isAuthenticated, onLogout }: ProfileActionsProps) {
  return (
    <div className="mt-8 space-y-4">
      <Button 
        variant="secondary" 
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
        asChild
      >
        <Link to="/support">
          <Heart className="h-5 w-5 text-white" />
          Soutenir le projet
        </Link>
      </Button>
      
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
