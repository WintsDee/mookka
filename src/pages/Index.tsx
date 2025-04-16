
import React, { useState, useEffect } from "react";
import MainContent from "@/components/home/MainContent";
import { Loader2 } from "lucide-react";

const Index = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  useEffect(() => {
    // Précharger l'image du fond d'écran
    const img = new Image();
    img.src = "/lovable-uploads/72025526-1809-42a2-b072-b398f21bffca.png";
    img.onload = () => {
      setImageLoaded(true);
    };
    
    // Fallback si l'image prend trop de temps
    const timeout = setTimeout(() => {
      if (!imageLoaded) setImageLoaded(true);
    }, 800);
    
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-auto">
      <div className="absolute inset-0 z-0">
        <img 
          src="/lovable-uploads/72025526-1809-42a2-b072-b398f21bffca.png" 
          alt="Mookka Background" 
          className={`w-full h-full object-cover fixed ${imageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        />
        {/* Réduire l'opacité du fond sombre */}
        <div className="absolute inset-0 bg-black/50" />
      </div>
      
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-50">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
        </div>
      )}
      
      {/* Contenu principal */}
      <MainContent />
    </div>
  );
};

export default Index;
