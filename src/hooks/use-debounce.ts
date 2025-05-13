import { useState, useEffect, useRef } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  // Keep track of the latest value in a ref to avoid dependency issues
  const latestValue = useRef<T>(value);
  
  useEffect(() => {
    // Update the ref with the current value
    latestValue.current = value;
    
    // Set a timer to update the debounced value after the specified delay
    const handler = setTimeout(() => {
      // Use the ref value to ensure we're getting the latest
      setDebouncedValue(latestValue.current);
    }, delay);

    // Clear the timer if the value changes again within the delay period
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Fonction pour filtrer le contenu adulte dans les résultats de recherche
export function filterAdultContent<T extends { title: string }>(items: T[]): T[] {
  const adultContentKeywords = [
    'xxx', 'porn', 'adult', 'sex', 'nude', 'naked', 'erotic', 
    'porno', 'nsfw', 'mature', 'explicit', 'hentai'
  ];
  
  return items.filter(item => {
    const title = item.title.toLowerCase();
    return !adultContentKeywords.some(keyword => title.includes(keyword));
  });
}
