
import React, { useState, useEffect } from "react";
import MainContent from "@/components/home/MainContent";
import { Loader2 } from "lucide-react";

const Index = () => {
  const [imageLoaded, setImageLoaded] = useState(true); // Préchargée par défaut
  
  useEffect(() => {
    // Précharger l'image en arrière-plan sans bloquer l'affichage
    const img = new Image();
    img.src = "/lovable-uploads/72025526-1809-42a2-b072-b398f21bffca.png";
    // Image déjà considérée comme chargée pour un affichage immédiat
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-auto">
      <div className="absolute inset-0 z-0">
        <img 
          src="/lovable-uploads/72025526-1809-42a2-b072-b398f21bffca.png" 
          alt="Mookka Background" 
          className="w-full h-full object-cover fixed opacity-100 transition-opacity duration-300"
        />
        {/* Réduire l'opacité du fond sombre */}
        <div className="absolute inset-0 bg-black/50" />
      </div>
      
      {/* Contenu principal */}
      <MainContent />
    </div>
  );
};

export default Index;
