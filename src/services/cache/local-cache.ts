
import { openDB, IDBPDatabase } from 'idb';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

// Type des options de cache
interface CacheOptions {
  // Durée de validité du cache en millisecondes
  ttl?: number;
  // Force le rafraîchissement des données
  forceRefresh?: boolean;
}

// Configuration par défaut
const DEFAULT_OPTIONS: CacheOptions = {
  ttl: 24 * 60 * 60 * 1000, // 24 heures par défaut
  forceRefresh: false
};

// Nom de la base de données IndexedDB
const DB_NAME = 'mookka-cache';
const DB_VERSION = 1;
const STORE_NAME = 'cached-data';

class LocalCacheService {
  private db: IDBPDatabase | null = null;
  private dbPromise: Promise<IDBPDatabase>;

  constructor() {
    this.dbPromise = this.initDatabase();
  }

  // Initialisation de la base de données
  private async initDatabase(): Promise<IDBPDatabase> {
    if (this.db) return this.db;

    try {
      this.db = await openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
          // Créer le store si nécessaire
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME);
          }
        },
      });
      return this.db;
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de la base de données IndexedDB:', error);
      throw error;
    }
  }

  // Stocker des données dans le cache
  async set<T>(key: string, data: T, options: CacheOptions = {}): Promise<void> {
    const { ttl } = { ...DEFAULT_OPTIONS, ...options };
    const now = Date.now();
    
    const cacheItem: CacheItem<T> = {
      data,
      timestamp: now,
      expiresAt: now + (ttl || 0)
    };
    
    const db = await this.dbPromise;
    await db.put(STORE_NAME, cacheItem, key);
  }

  // Récupérer des données du cache
  async get<T>(key: string, options: CacheOptions = {}): Promise<T | null> {
    const { forceRefresh } = { ...DEFAULT_OPTIONS, ...options };
    
    // Si on force le rafraîchissement, on ne récupère pas du cache
    if (forceRefresh) return null;
    
    try {
      const db = await this.dbPromise;
      const cacheItem = await db.get(STORE_NAME, key) as CacheItem<T> | undefined;
      
      // Si aucune donnée trouvée ou cache expiré
      if (!cacheItem || cacheItem.expiresAt < Date.now()) {
        return null;
      }
      
      return cacheItem.data;
    } catch (error) {
      console.error('Erreur lors de la récupération depuis le cache:', error);
      return null;
    }
  }

  // Supprimer des données du cache
  async delete(key: string): Promise<void> {
    const db = await this.dbPromise;
    await db.delete(STORE_NAME, key);
  }

  // Vider tout le cache
  async clear(): Promise<void> {
    const db = await this.dbPromise;
    await db.clear(STORE_NAME);
  }

  // Supprimer les données expirées du cache
  async clearExpired(): Promise<void> {
    try {
      const db = await this.dbPromise;
      const now = Date.now();
      const allKeys = await db.getAllKeys(STORE_NAME);
      
      for (const key of allKeys) {
        const item = await db.get(STORE_NAME, key) as CacheItem<any> | undefined;
        if (item && item.expiresAt < now) {
          await db.delete(STORE_NAME, key);
        }
      }
    } catch (error) {
      console.error('Erreur lors du nettoyage du cache expiré:', error);
    }
  }
}

// Export d'une instance unique du service
export const localCache = new LocalCacheService();
