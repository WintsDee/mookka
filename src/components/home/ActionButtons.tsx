
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

const ActionButtons: React.FC = () => {
  const { signOut } = useAuth();
  const { toast } = useToast();

  const handleDirectAccess = () => {
    // En mode test, on se déconnecte d'abord pour être sûr
    signOut();
    
    // On affiche un toast pour informer l'utilisateur
    toast({
      title: "Mode test",
      description: "Connexion automatique avec le compte de test...",
    });
  };

  return (
    <div className="space-y-3 sm:space-y-0 w-full flex flex-col sm:flex-row sm:space-x-4 justify-center">
      <Link to="/bibliotheque" className="w-full sm:w-auto">
        <Button size="lg" className="w-full font-medium shadow-md hover:shadow-lg transition-all">
          Commencer maintenant
        </Button>
      </Link>
      
      <Link to="/auth" className="w-full sm:w-auto">
        <Button 
          variant="outline" 
          size="lg" 
          className="w-full bg-black/20 backdrop-blur-sm border-white/20 text-white hover:bg-white/10 hover:border-white/30 shadow-md hover:shadow-lg transition-all"
        >
          Se connecter
        </Button>
      </Link>

      <Link to="/bibliotheque" className="w-full sm:w-auto" onClick={handleDirectAccess}>
        <Button 
          variant="secondary"
          size="lg" 
          className="w-full bg-purple-600/80 text-white hover:bg-purple-600 shadow-md hover:shadow-lg transition-all"
        >
          Accès Test
        </Button>
      </Link>
    </div>
  );
};

export default ActionButtons;
