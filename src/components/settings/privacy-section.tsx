
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Lock, ChevronRight } from "lucide-react";

export function PrivacySection() {
  const navigate = useNavigate();

  return (
    <div>
      <h2 className="text-lg font-medium mb-4">Confidentialité</h2>
      <div className="space-y-4">
        <Button 
          variant="ghost" 
          className="w-full flex items-center justify-between px-0 h-auto py-2"
          onClick={() => navigate('/settings/privacy')}
        >
          <div className="flex items-center gap-3">
            <Shield size={18} className="text-primary" />
            <span>Confidentialité du compte</span>
          </div>
          <ChevronRight size={18} className="text-muted-foreground" />
        </Button>
        
        <Button 
          variant="ghost" 
          className="w-full flex items-center justify-between px-0 h-auto py-2"
          onClick={() => {}}
        >
          <div className="flex items-center gap-3">
            <Lock size={18} className="text-primary" />
            <span>Changer le mot de passe</span>
          </div>
          <ChevronRight size={18} className="text-muted-foreground" />
        </Button>
      </div>
    </div>
  );
}
