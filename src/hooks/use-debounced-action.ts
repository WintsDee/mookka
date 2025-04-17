
import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Hook pour débouncer une action (une fonction) afin de limiter 
 * le nombre d'appels dans un intervalle de temps donné
 */
export function useDebouncedAction<T extends (...args: any[]) => Promise<any>>(
  action: T, 
  delay: number = 300
): [boolean, T] {
  const [isLoading, setIsLoading] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const actionRef = useRef<T>(action);
  
  // Mettre à jour la référence de l'action lorsqu'elle change
  useEffect(() => {
    actionRef.current = action;
  }, [action]);
  
  // Nettoyer le timer quand le composant est démonté
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);
  
  // Fonction enrobée avec debounce - avec mémorisation pour éviter les re-rendus
  const debouncedAction = useCallback((...args: Parameters<T>) => {
    // Annuler le timer précédent si existant
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    setIsLoading(true);
    
    // Créer une promesse qui sera résolue après le délai
    return new Promise<ReturnType<T>>((resolve, reject) => {
      timerRef.current = setTimeout(async () => {
        try {
          const result = await actionRef.current(...args);
          setIsLoading(false);
          resolve(result as ReturnType<T>);
        } catch (error) {
          setIsLoading(false);
          reject(error);
        }
      }, delay);
    });
  }, [delay]) as unknown as T; // Fix: use explicit unknown cast first, then cast to T
  
  return [isLoading, debouncedAction];
}
