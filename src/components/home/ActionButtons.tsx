
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ActionButtons: React.FC = () => {
  return (
    <div className="space-y-3 sm:space-y-4 w-full flex flex-col sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
      <Link to="/bibliotheque" className="w-full sm:w-auto">
        <Button size="lg" className="w-full">
          Commencer maintenant
        </Button>
      </Link>
      
      <Link to="/connexion" className="w-full sm:w-auto">
        <Button variant="outline" size="lg" className="w-full">
          Se connecter
        </Button>
      </Link>
    </div>
  );
};

export default ActionButtons;
