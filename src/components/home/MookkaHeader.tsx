
import React from "react";

const MookkaHeader: React.FC = () => {
  return (
    <>
      <img 
        src="/lovable-uploads/59160824-2c34-4d40-82c6-d9f9f5b4d1f3.png" 
        alt="Mookka Logo" 
        className="w-32 h-32 mb-6 animate-scale-in"
      />
      
      <h1 className="text-4xl font-bold mb-2 flex items-center justify-center">
        <span className="text-blue-500">Mookka</span>
      </h1>
      
      <p className="text-lg mb-4 text-white font-medium">
        Votre bibliothèque numérique
      </p>
      
      <p className="text-md mb-8 text-white/90 px-4">
        Suivez vos films, séries, livres et jeux. Découvrez, notez et partagez 
        vos médias préférés avec votre communauté.
      </p>
    </>
  );
};

export default MookkaHeader;
