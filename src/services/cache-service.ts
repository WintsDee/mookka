import { create } from 'zustand';
import { useLocalStorage } from '@/hooks/use-local-storage';

export interface CacheConfig {
  maxAge: number; // milliseconds
  staleWhileRevalidate: boolean;
}

interface CacheItem<T> {
  data: T;
  timestamp: number;
  key: string;
}

interface CacheState {
  items: Record<string, CacheItem<any>>;
  addItem: <T>(key: string, data: T) => void;
  getItem: <T>(key: string) => CacheItem<T> | null;
  removeItem: (key: string) => void;
  clear: () => void;
  isStale: (key: string, config?: Partial<CacheConfig>) => boolean;
}

const DEFAULT_CACHE_CONFIG: CacheConfig = {
  maxAge: 5 * 60 * 1000, // 5 minutes default
  staleWhileRevalidate: true,
};

// In-memory cache for fast access
export const useCacheStore = create<CacheState>((set, get) => ({
  items: {},
  addItem: (key, data) => set((state) => {
    const newItems = {
      ...state.items,
      [key]: {
        data,
        timestamp: Date.now(),
        key,
      },
    };
    return { items: newItems };
  }),
  getItem: (key) => {
    const state = get();
    return state.items[key] || null;
  },
  removeItem: (key) => set((state) => {
    const newItems = { ...state.items };
    delete newItems[key];
    return { items: newItems };
  }),
  clear: () => set({ items: {} }),
  isStale: (key, config = {}) => {
    const item = get().getItem(key);
    if (!item) return true;
    
    const { maxAge } = { ...DEFAULT_CACHE_CONFIG, ...config };
    const now = Date.now();
    return now - item.timestamp > maxAge;
  },
}));

export class CacheService {
  private static instance: CacheService;
  
  private constructor() {}
  
  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }
  
  public initialize(): void {
    // Load persisted cache items from localStorage
    this.loadFromStorage();
    
    // Setup cleanup for old cache items
    this.setupCacheCleanup();
  }
  
  private loadFromStorage(): void {
    const [storedCache] = useLocalStorage<Record<string, CacheItem<any>>>('app-cache', {});
    
    // Only load items that are not stale
    Object.values(storedCache).forEach((item) => {
      if (!this.isItemExpired(item)) {
        useCacheStore.getState().addItem(item.key, item.data);
      }
    });
  }
  
  private saveToStorage(): void {
    const { items } = useCacheStore.getState();
    const [_, setStoredCache] = useLocalStorage<Record<string, CacheItem<any>>>('app-cache', {});
    
    // Only store items that are not expired
    const filteredItems = Object.values(items).reduce((acc, item) => {
      if (!this.isItemExpired(item)) {
        acc[item.key] = item;
      }
      return acc;
    }, {} as Record<string, CacheItem<any>>);
    
    setStoredCache(filteredItems);
  }
  
  private isItemExpired(item: CacheItem<any>, maxAgeOverride?: number): boolean {
    const maxAge = maxAgeOverride || DEFAULT_CACHE_CONFIG.maxAge;
    const now = Date.now();
    return now - item.timestamp > maxAge;
  }
  
  private setupCacheCleanup(): void {
    // Clean up expired items every hour
    setInterval(() => {
      const { items, removeItem } = useCacheStore.getState();
      
      Object.values(items).forEach((item) => {
        if (this.isItemExpired(item)) {
          removeItem(item.key);
        }
      });
      
      this.saveToStorage();
    }, 60 * 60 * 1000);
  }
  
  public async get<T>(
    key: string,
    fetchFn: () => Promise<T>,
    config: Partial<CacheConfig> = {}
  ): Promise<T> {
    const { getItem, addItem, isStale } = useCacheStore.getState();
    const fullConfig = { ...DEFAULT_CACHE_CONFIG, ...config };
    
    const cached = getItem<T>(key);
    
    // If we have a cached item that's not stale, return it
    if (cached && !isStale(key, fullConfig)) {
      return cached.data;
    }
    
    // If staleWhileRevalidate is enabled and we have cached data, fetch in background
    if (fullConfig.staleWhileRevalidate && cached) {
      // Return stale data immediately
      const data = cached.data;
      
      // Fetch fresh data in the background
      fetchFn().then((freshData) => {
        addItem(key, freshData);
        this.saveToStorage();
      }).catch((error) => {
        console.error(`Background refresh failed for ${key}:`, error);
      });
      
      return data;
    }
    
    // Otherwise, fetch fresh data
    try {
      const data = await fetchFn();
      addItem(key, data);
      this.saveToStorage();
      return data;
    } catch (error) {
      // If fetch fails and we have stale data, return it as a fallback
      if (cached) {
        console.warn(`Fetch failed for ${key}, using stale data:`, error);
        return cached.data;
      }
      throw error;
    }
  }
  
  public set<T>(key: string, data: T): void {
    useCacheStore.getState().addItem(key, data);
    this.saveToStorage();
  }
  
  public remove(key: string): void {
    useCacheStore.getState().removeItem(key);
    this.saveToStorage();
  }
  
  public clear(): void {
    useCacheStore.getState().clear();
    this.saveToStorage();
  }
  
  public cleanup(): void {
    this.saveToStorage();
  }
}

export default CacheService;
