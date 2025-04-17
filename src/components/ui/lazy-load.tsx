
import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";

interface LazyLoadProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  placeholder?: React.ReactNode;
}

export const LazyLoad: React.FC<LazyLoadProps> = ({
  children,
  className,
  delay = 0,
  placeholder
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className={cn("transition-opacity duration-300", 
      isLoaded ? "opacity-100" : "opacity-0",
      className
    )}>
      {isLoaded ? children : placeholder || <div className="animate-pulse bg-gray-200/10 rounded h-16 w-full" />}
    </div>
  );
};
