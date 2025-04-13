
import React from "react";
import { Background } from "@/components/ui/background";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Film, Tv, Book, GamepadIcon } from "lucide-react";

const Index = () => {
  return (
    <Background className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md animate-fade-in flex flex-col items-center">
        <img 
          src="/logo.png" 
          alt="Mookka Logo" 
          className="w-32 h-32 mb-6 animate-scale-in"
        />
        
        <h1 className="text-4xl font-bold mb-6">
          <span className="text-blue-500">Mookka</span>
        </h1>
        
        <p className="text-lg mb-8 text-muted-foreground">
          Gérez vos films, séries, livres et jeux vidéo en un seul endroit. 
          Suivez votre progression, notez vos favoris et découvrez les 
          recommandations de vos amis.
        </p>
        
        {/* Nouvelle section avec l'image */}
        <div className="mb-8 w-full">
          <img 
            src="/lovable-uploads/1207c6ca-56b8-421d-b536-7decdd515caa.png" 
            alt="Illustration Mookka" 
            className="w-full h-auto rounded-lg shadow-lg object-cover animate-fade-in"
          />
        </div>
        
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
        
        <div className="flex justify-between mt-16 px-8">
          <div className="flex flex-col items-center text-blue-500">
            <Film size={32} />
            <span className="text-sm mt-2">Films</span>
          </div>
          <div className="flex flex-col items-center text-purple-500">
            <Tv size={32} />
            <span className="text-sm mt-2">Séries</span>
          </div>
          <div className="flex flex-col items-center text-emerald-500">
            <Book size={32} />
            <span className="text-sm mt-2">Livres</span>
          </div>
          <div className="flex flex-col items-center text-amber-500">
            <GamepadIcon size={32} />
            <span className="text-sm mt-2">Jeux</span>
          </div>
        </div>
      </div>
    </Background>
  );
};

export default Index;
