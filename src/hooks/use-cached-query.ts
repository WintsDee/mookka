
import { useQuery, QueryKey, UseQueryOptions } from '@tanstack/react-query';
import { useAppServices } from '@/contexts/app-services-context';
import { CacheConfig } from '@/services/cache-service';

export function useCachedQuery<TData = unknown, TError = Error>(
  queryKey: QueryKey,
  queryFn: () => Promise<TData>,
  cacheConfig?: Partial<CacheConfig>,
  options?: Omit<UseQueryOptions<TData, TError, TData>, 'queryKey' | 'queryFn'>
) {
  const { cacheService } = useAppServices();
  const cacheKey = Array.isArray(queryKey) ? queryKey.join('-') : String(queryKey);
  
  return useQuery({
    queryKey,
    queryFn: () => cacheService.get(cacheKey, queryFn, cacheConfig),
    ...options,
  });
}
