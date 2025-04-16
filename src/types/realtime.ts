
export interface RealtimeBroadcastPayload<T = any> {
  type: 'broadcast';
  event: string;
  payload: T;
}

export interface RealtimePostgresChangesPayload<T = any> {
  schema: string;
  table: string;
  commit_timestamp: string;
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new: T;
  old: T | null;
  errors: any[] | null;
}

export type SynchronizationEvent = {
  type: 'MEDIA_CHANGE' | 'COLLECTION_CHANGE' | 'PROFILE_CHANGE' | 'APP_VERSION';
  resourceId?: string;
  userId?: string;
  timestamp: number;
  data?: any;
};

export enum ConnectionState {
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
}

export enum SyncState {
  SYNCED = 'synced',
  SYNCING = 'syncing',
  FAILED = 'failed',
}
