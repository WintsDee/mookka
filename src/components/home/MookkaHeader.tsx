
import React from "react";

const MookkaHeader: React.FC = () => {
  return (
    <>
      <img 
        src="/lovable-uploads/59160824-2c34-4d40-82c6-d9f9f5b4d1f3.png" 
        alt="Mookka Logo" 
        className="w-36 h-36 sm:w-40 sm:h-40 mb-4 animate-scale-in drop-shadow-lg" 
      />
      
      <h1 className="text-5xl font-bold mb-2 flex items-center justify-center">
        <span className="text-blue-500 drop-shadow-md">Mookka</span>
      </h1>
      
      <p className="text-lg mb-4 text-white/90 font-medium drop-shadow-sm">
        Votre bibliothèque numérique
      </p>
    </>
  );
};

export default MookkaHeader;
