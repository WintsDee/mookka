
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ActionButtons: React.FC = () => {
  return (
    <div className="space-y-3 sm:space-y-4 w-full flex flex-col sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
      <Link to="/bibliotheque" className="w-full sm:w-auto">
        <Button size="lg" className="w-full font-medium shadow-md hover:shadow-lg transition-all">
          Commencer maintenant
        </Button>
      </Link>
      
      <Link to="/connexion" className="w-full sm:w-auto">
        <Button 
          variant="outline" 
          size="lg" 
          className="w-full bg-black/20 backdrop-blur-sm border-white/20 text-white hover:bg-white/10 hover:border-white/30 shadow-md hover:shadow-lg transition-all"
        >
          Se connecter
        </Button>
      </Link>
    </div>
  );
};

export default ActionButtons;
