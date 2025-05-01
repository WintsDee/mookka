
import { useState, useEffect } from "react";
import { Loader } from "lucide-react";

interface LoadingScreenProps {
  onLoadComplete: () => void;
}

const LoadingScreen = ({ onLoadComplete }: LoadingScreenProps) => {
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    // Précharger les images principales en priorité
    const images = [
      "/lovable-uploads/59160824-2c34-4d40-82c6-d9f9f5b4d1f3.png", // Logo
      "/lovable-uploads/72025526-1809-42a2-b072-b398f21bffca.png", // Background
    ];

    let loadedImages = 0;
    let startTime = Date.now();

    const preloadImage = (src: string) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          loadedImages++;
          setLoadingProgress((loadedImages / images.length) * 100);
          resolve(true);
        };
        img.onerror = () => {
          loadedImages++;
          setLoadingProgress((loadedImages / images.length) * 100);
          console.warn(`Failed to load image: ${src}`);
          resolve(false);
        };
        img.src = src;
      });
    };

    const loadAllImages = async () => {
      try {
        await Promise.all(images.map(preloadImage));
      } catch (error) {
        console.error("Error preloading images:", error);
      }
      
      // Garantir un temps minimum de chargement pour montrer le loader
      const elapsedTime = Date.now() - startTime;
      const minLoadingTime = 1000; // 1 seconde minimum
      
      if (elapsedTime < minLoadingTime) {
        setTimeout(() => {
          onLoadComplete();
        }, minLoadingTime - elapsedTime);
      } else {
        onLoadComplete();
      }
    };

    loadAllImages();

    // Ajouter un fallback en cas de problème de chargement
    const fallbackTimer = setTimeout(() => {
      console.log("Fallback timer completing loading screen");
      onLoadComplete();
    }, 5000); // 5 secondes maximum
    
    return () => {
      clearTimeout(fallbackTimer);
    };
  }, [onLoadComplete]);

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center flex-col gap-6 z-50">
      <Loader className="w-12 h-12 animate-spin text-primary" />
      <div className="w-48 h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
          style={{ width: `${loadingProgress}%` }}
        />
      </div>
    </div>
  );
};

export default LoadingScreen;
