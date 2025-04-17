
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ActionButtons: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="space-y-3 sm:space-y-0 w-full flex flex-col sm:flex-row sm:space-x-4 justify-center">
      <Button 
        size="lg" 
        className="w-full font-medium shadow-md hover:shadow-lg transition-all"
        onClick={() => handleNavigation("/bibliotheque")}
      >
        Commencer maintenant
      </Button>
      
      <Button 
        variant="outline" 
        size="lg" 
        className="w-full bg-black/20 backdrop-blur-sm border-white/20 text-white hover:bg-white/10 hover:border-white/30 shadow-md hover:shadow-lg transition-all"
        onClick={() => handleNavigation("/auth")}
      >
        Se connecter
      </Button>
    </div>
  );
};

export default ActionButtons;
