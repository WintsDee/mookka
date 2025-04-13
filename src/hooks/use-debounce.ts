
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

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
