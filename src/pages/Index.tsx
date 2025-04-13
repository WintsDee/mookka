
import React from "react";
import { Background } from "@/components/ui/background";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Film, Tv, Book, GamepadIcon } from "lucide-react";

const Index = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Nouveau fond d'écran avec fond bleu dégradé et icônes */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/lovable-uploads/72025526-1809-42a2-b072-b398f21bffca.png" 
          alt="Mookka Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>
      
      {/* Contenu principal */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md animate-fade-in flex flex-col items-center backdrop-blur-sm bg-black/30 p-6 rounded-xl">
          <img 
            src="/lovable-uploads/59160824-2c34-4d40-82c6-d9f9f5b4d1f3.png" 
            alt="Mookka Logo" 
            className="w-32 h-32 mb-6 animate-scale-in"
          />
          
          <h1 className="text-4xl font-bold mb-6">
            <span className="text-blue-500">Mookka</span>
          </h1>
          
          <p className="text-lg mb-8 text-white">
            Gérez vos films, séries, livres et jeux vidéo en un seul endroit. 
            Suivez votre progression, notez vos favoris et découvrez les 
            recommandations de vos amis.
          </p>
          
          <div className="space-y-4 w-full">
            <Link to="/bibliotheque">
              <Button size="lg" className="w-full">
                Commencer maintenant
              </Button>
            </Link>
            
            <Link to="/connexion">
              <Button variant="outline" size="lg" className="w-full">
                Se connecter
              </Button>
            </Link>
          </div>
          
          <div className="flex justify-between mt-10 w-full px-4">
            <div className="flex flex-col items-center text-blue-500">
              <Film size={28} />
              <span className="text-sm mt-2">Films</span>
            </div>
            <div className="flex flex-col items-center text-purple-500">
              <Tv size={28} />
              <span className="text-sm mt-2">Séries</span>
            </div>
            <div className="flex flex-col items-center text-emerald-500">
              <Book size={28} />
              <span className="text-sm mt-2">Livres</span>
            </div>
            <div className="flex flex-col items-center text-amber-500">
              <GamepadIcon size={28} />
              <span className="text-sm mt-2">Jeux</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
