
import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // État pour stocker la valeur
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Récupérer depuis localStorage
      const item = window.localStorage.getItem(key);
      // Analyser le JSON stocké ou renvoyer la valeur initiale
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Erreur lors de la récupération de ${key} depuis localStorage:`, error);
      return initialValue;
    }
  });

  // Mettre à jour localStorage lorsque l'état change
  useEffect(() => {
    try {
      // Stocker la valeur dans localStorage
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Erreur lors de l'enregistrement de ${key} dans localStorage:`, error);
    }
  }, [key, storedValue]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Permettre à la valeur d'être une fonction pour la même API que useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Enregistrer dans l'état
      setStoredValue(valueToStore);
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de ${key} dans useState:`, error);
    }
  };

  return [storedValue, setValue];
}
