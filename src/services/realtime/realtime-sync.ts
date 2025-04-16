
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

// Types des tables à surveiller
type TableName = 'user_media' | 'collections' | 'profiles' | 'media_progressions';

// Types d'événements de la base de données
type DatabaseEvent = 'INSERT' | 'UPDATE' | 'DELETE';

// Types pour stocker les callbacks
type EventCallbacks = {
  [key in `${TableName}:${DatabaseEvent}`]?: ((payload: any) => void)[];
};

class RealtimeSyncService {
  private channels: Record<string, any> = {}; // Stocke les canaux actifs
  private callbacks: EventCallbacks = {}; // Stocke les callbacks
  private subscribed = false;
  private userLoggedIn = false;
  private _syncStatus: 'synced' | 'local' | 'offline' = 'synced';

  constructor() {
    this.init();
    this.setupAuthListener();
  }

  // Initialiser le service
  private init(): void {
    // Vérifier la connexion internet
    window.addEventListener('online', this.handleOnline.bind(this));
    window.addEventListener('offline', this.handleOffline.bind(this));
    
    // État initial
    this._syncStatus = navigator.onLine ? 'synced' : 'offline';
  }
  
  // Configurer l'écouteur d'auth
  private setupAuthListener(): void {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        this.userLoggedIn = true;
        this.setupRealtimeChannels();
      } else if (event === 'SIGNED_OUT') {
        this.userLoggedIn = false;
        this.unsubscribeAll();
      }
    });
    
    // Vérifier l'état actuel
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        this.userLoggedIn = true;
        this.setupRealtimeChannels();
      }
    });
  }

  // Configurer les canaux en temps réel
  private setupRealtimeChannels(): void {
    if (!this.userLoggedIn || this.subscribed || this._syncStatus === 'offline') {
      return;
    }

    const mainChannel = supabase.channel('db-changes');
    
    // Configurer l'écoute pour chaque table
    ['user_media', 'collections', 'profiles', 'media_progressions'].forEach((table: TableName) => {
      ['INSERT', 'UPDATE', 'DELETE'].forEach((event: DatabaseEvent) => {
        mainChannel.on(
          'postgres_changes',
          {
            event,
            schema: 'public',
            table,
          },
          (payload) => this.handleDatabaseChange(table, event as DatabaseEvent, payload)
        );
      });
    });

    // S'abonner au canal
    mainChannel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        this.subscribed = true;
        this._syncStatus = 'synced';
        console.log('Subscribed to realtime changes');
      }
    });
    
    this.channels['db-changes'] = mainChannel;
  }

  // Gérer les changements dans la base de données
  private handleDatabaseChange(table: TableName, event: DatabaseEvent, payload: any): void {
    console.log(`Change detected in ${table}:`, event, payload);
    
    // Appeler les callbacks
    const key = `${table}:${event}` as const;
    const handlers = this.callbacks[key] || [];
    
    handlers.forEach(callback => callback(payload));
  }

  // S'abonner à un événement sur une table
  public subscribe(
    table: TableName, 
    event: DatabaseEvent, 
    callback: (payload: any) => void
  ): () => void {
    const key = `${table}:${event}` as const;
    
    if (!this.callbacks[key]) {
      this.callbacks[key] = [];
    }
    
    this.callbacks[key]!.push(callback);
    
    // Si l'utilisateur est connecté mais pas encore abonné, configurer les canaux
    if (this.userLoggedIn && !this.subscribed && this._syncStatus !== 'offline') {
      this.setupRealtimeChannels();
    }
    
    // Renvoyer une fonction pour se désabonner
    return () => {
      if (this.callbacks[key]) {
        this.callbacks[key] = this.callbacks[key]!.filter(cb => cb !== callback);
      }
    };
  }

  // Se désabonner de tous les canaux
  public unsubscribeAll(): void {
    Object.values(this.channels).forEach(channel => {
      supabase.removeChannel(channel);
    });
    
    this.channels = {};
    this.callbacks = {};
    this.subscribed = false;
  }

  // Gérer la reconnexion
  private handleOnline(): void {
    this._syncStatus = 'synced';
    
    // Afficher une notification
    toast({
      title: "Connexion rétablie",
      description: "Synchronisation des données en cours...",
    });
    
    // Réabonner aux canaux si l'utilisateur est connecté
    if (this.userLoggedIn && !this.subscribed) {
      this.setupRealtimeChannels();
    }
  }

  // Gérer la déconnexion
  private handleOffline(): void {
    this._syncStatus = 'offline';
    
    // Afficher une notification
    toast({
      title: "Mode hors ligne",
      description: "Certaines fonctionnalités peuvent être limitées",
      variant: "destructive",
    });
    
    // Se désabonner car nous sommes hors ligne
    this.unsubscribeAll();
  }

  // Obtenir l'état actuel de synchronisation
  get syncStatus(): 'synced' | 'local' | 'offline' {
    return this._syncStatus;
  }

  // Forcer manuellement le statut (utile pour tester)
  set syncStatus(status: 'synced' | 'local' | 'offline') {
    this._syncStatus = status;
  }
}

// Exporter une instance unique du service
export const realtimeSync = new RealtimeSyncService();
