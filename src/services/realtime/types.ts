
// Type definitions for the realtime sync service
import type { RealtimeChannel, RealtimePostgresChangesPayload as SupabaseRealtimePayload } from '@supabase/supabase-js';

// Types of tables to monitor
export type TableName = 'user_media' | 'collections' | 'profiles' | 'media_progressions';

// Database event types
export type DatabaseEvent = 'INSERT' | 'UPDATE' | 'DELETE';

// Type for the sync status
export type SyncStatus = 'synced' | 'local' | 'offline';

// Types for storing callbacks
export type EventCallbacks = {
  [key in `${TableName}:${DatabaseEvent}`]?: ((payload: SupabaseRealtimePayload<any>) => void)[];
};

// Export the RealtimeChannel type and RealtimePostgresChangesPayload from Supabase
export type { RealtimeChannel };
export type RealtimePostgresChangesPayload<T> = SupabaseRealtimePayload<T>;
