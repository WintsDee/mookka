
import { useState, useEffect } from 'react';
import { localCache } from '@/services/cache/local-cache';
import { realtimeSync } from '@/services/realtime';
import { QueryKey, useQuery, UseQueryOptions, useQueryClient } from '@tanstack/react-query';
import { TableName, DatabaseEvent } from '@/services/realtime/types';

// Options pour le cache
interface CachedQueryOptions<TData, TError> extends Omit<UseQueryOptions<TData, TError, TData>, 'queryKey' | 'queryFn'> {
  // Clé pour identifier le cache
  cacheKey?: string;
  // Durée de vie du cache en ms (par défaut 24h)
  cacheTtl?: number;
  // Tables Supabase à surveiller pour les mises à jour en temps réel
  watchTables?: Array<{
    table: TableName;
    event: DatabaseEvent;
  }>;
  // Forcer le rechargement depuis la source (ignorer le cache)
  forceRefresh?: boolean;
}

export function useCachedQuery<TData = unknown, TError = Error>(
  queryKey: QueryKey,
  queryFn: () => Promise<TData>,
  options?: CachedQueryOptions<TData, TError>
) {
  const {
    cacheKey = queryKey.join('-'),
    cacheTtl = 24 * 60 * 60 * 1000, // 24h par défaut
    watchTables = [],
    forceRefresh = false,
    ...queryOptions
  } = options || {};

  const queryClient = useQueryClient();
  const [isLoadingFromCache, setIsLoadingFromCache] = useState(false);

  // Vérifier s'il y a des données en cache au démarrage
  useEffect(() => {
    const checkCache = async () => {
      // Ne pas vérifier le cache si forceRefresh est activé
      if (forceRefresh) return;
      
      setIsLoadingFromCache(true);
      const cachedData = await localCache.get<TData>(cacheKey);
      
      if (cachedData) {
        // Utiliser les données du cache pour un rendu immédiat
        queryClient.setQueryData(queryKey, cachedData);
      }
      
      setIsLoadingFromCache(false);
    };
    
    checkCache();
  }, [cacheKey, forceRefresh, queryClient, queryKey]);

  // Configurer les abonnements en temps réel pour les tables à surveiller
  useEffect(() => {
    const unsubscribes = watchTables.map(({ table, event }) => {
      return realtimeSync.subscribe(table, event, () => {
        // Invalider la requête quand une donnée change
        queryClient.invalidateQueries({ queryKey });
      });
    });

    // Nettoyer les abonnements
    return () => {
      unsubscribes.forEach(unsubscribe => unsubscribe());
    };
  }, [watchTables, queryClient, queryKey]);

  // Utiliser useQuery avec un wrapper pour mettre en cache les résultats
  const query = useQuery({
    queryKey,
    queryFn: async () => {
      try {
        // Récupérer les données de l'API
        const data = await queryFn();
        
        // Mettre en cache les résultats
        await localCache.set(cacheKey, data, { ttl: cacheTtl });
        
        return data;
      } catch (error) {
        // En cas d'erreur, essayer de récupérer depuis le cache
        const cachedData = await localCache.get<TData>(cacheKey);
        
        if (cachedData) {
          // Si on a des données en cache, les utiliser comme fallback
          realtimeSync.syncStatus = 'local';
          return cachedData;
        }
        
        // Sinon propager l'erreur
        throw error;
      }
    },
    ...queryOptions
  });

  // Exposer l'état de chargement du cache
  return {
    ...query,
    isLoadingFromCache,
    syncStatus: realtimeSync.syncStatus
  };
}
