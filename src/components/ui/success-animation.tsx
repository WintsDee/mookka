
import React, { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SuccessAnimationProps {
  show: boolean;
  message?: string;
  onComplete?: () => void;
}

export function SuccessAnimation({ show, message, onComplete }: SuccessAnimationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setIsAnimating(true);
      
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(() => {
          setIsVisible(false);
          onComplete?.();
        }, 300);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className={cn(
        "bg-primary text-primary-foreground rounded-full p-6 shadow-lg transition-all duration-300",
        isAnimating ? "scale-100 opacity-100" : "scale-75 opacity-0"
      )}>
        <Check className="h-8 w-8 animate-pulse" />
      </div>
      {message && (
        <div className={cn(
          "absolute mt-20 bg-background/90 backdrop-blur-sm text-foreground px-4 py-2 rounded-lg shadow-lg transition-all duration-300",
          isAnimating ? "scale-100 opacity-100" : "scale-75 opacity-0"
        )}>
          {message}
        </div>
      )}
    </div>
  );
}
