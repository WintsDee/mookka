
import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState('page-transition-enter');
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (location !== displayLocation) {
      setTransitionStage('page-transition-exit');
      
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      
      timeoutRef.current = window.setTimeout(() => {
        setDisplayLocation(location);
        setTransitionStage('page-transition-enter');
      }, 150); // Match this with the CSS exit transition duration
    }
  }, [location, displayLocation]);
  
  useEffect(() => {
    if (transitionStage === 'page-transition-enter') {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      
      timeoutRef.current = window.setTimeout(() => {
        setTransitionStage('page-transition-enter-active');
      }, 10);
    }
  }, [transitionStage]);
  
  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);
  
  return (
    <div className={`${transitionStage}`}>
      {children}
    </div>
  );
}
