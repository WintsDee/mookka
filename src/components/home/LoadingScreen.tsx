
import { useState, useEffect } from "react";
import { Loader } from "lucide-react";

interface LoadingScreenProps {
  onLoadComplete: () => void;
}

const LoadingScreen = ({ onLoadComplete }: LoadingScreenProps) => {
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    // Précharger les images principales
    const images = [
      "/lovable-uploads/59160824-2c34-4d40-82c6-d9f9f5b4d1f3.png", // Logo
      "/lovable-uploads/72025526-1809-42a2-b072-b398f21bffca.png", // Background
    ];

    let loadedImages = 0;

    const preloadImage = (src: string) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          loadedImages++;
          setLoadingProgress((loadedImages / images.length) * 100);
          resolve(true);
        };
        img.onerror = () => resolve(false);
      });
    };

    const loadAllImages = async () => {
      await Promise.all(images.map(preloadImage));
      
      // Ajouter un petit délai pour une transition plus douce
      setTimeout(() => {
        onLoadComplete();
      }, 500);
    };

    loadAllImages();
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
