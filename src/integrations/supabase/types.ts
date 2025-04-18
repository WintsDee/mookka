export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activity_comments: {
        Row: {
          activity_id: string
          content: string
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          activity_id: string
          content: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          activity_id?: string
          content?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_comments_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "user_media"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_likes: {
        Row: {
          activity_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          activity_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          activity_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_likes_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "user_media"
            referencedColumns: ["id"]
          },
        ]
      }
      collection_contributors: {
        Row: {
          added_at: string
          collection_id: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          added_at?: string
          collection_id: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          added_at?: string
          collection_id?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_contributors_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
        ]
      }
      collection_followers: {
        Row: {
          collection_id: string
          followed_at: string
          id: string
          user_id: string
        }
        Insert: {
          collection_id: string
          followed_at?: string
          id?: string
          user_id: string
        }
        Update: {
          collection_id?: string
          followed_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_followers_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
        ]
      }
      collection_items: {
        Row: {
          added_at: string
          added_by: string | null
          collection_id: string
          id: string
          media_id: string
          position: number
        }
        Insert: {
          added_at?: string
          added_by?: string | null
          collection_id: string
          id?: string
          media_id: string
          position?: number
        }
        Update: {
          added_at?: string
          added_by?: string | null
          collection_id?: string
          id?: string
          media_id?: string
          position?: number
        }
        Relationships: [
          {
            foreignKeyName: "collection_items_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_items_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
        ]
      }
      collections: {
        Row: {
          cover_image: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          owner_id: string
          type: string
          updated_at: string
          visibility: string
        }
        Insert: {
          cover_image?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          owner_id: string
          type: string
          updated_at?: string
          visibility: string
        }
        Update: {
          cover_image?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          owner_id?: string
          type?: string
          updated_at?: string
          visibility?: string
        }
        Relationships: []
      }
      friend_requests: {
        Row: {
          created_at: string
          id: string
          receiver_id: string
          sender_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          receiver_id: string
          sender_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          receiver_id?: string
          sender_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      media: {
        Row: {
          author: string | null
          cover_image: string | null
          created_at: string
          description: string | null
          director: string | null
          duration: string | null
          external_id: string
          genres: string[] | null
          id: string
          platform: string | null
          publisher: string | null
          rating: number | null
          title: string
          type: string
          updated_at: string
          year: number | null
        }
        Insert: {
          author?: string | null
          cover_image?: string | null
          created_at?: string
          description?: string | null
          director?: string | null
          duration?: string | null
          external_id: string
          genres?: string[] | null
          id?: string
          platform?: string | null
          publisher?: string | null
          rating?: number | null
          title: string
          type: string
          updated_at?: string
          year?: number | null
        }
        Update: {
          author?: string | null
          cover_image?: string | null
          created_at?: string
          description?: string | null
          director?: string | null
          duration?: string | null
          external_id?: string
          genres?: string[] | null
          id?: string
          platform?: string | null
          publisher?: string | null
          rating?: number | null
          title?: string
          type?: string
          updated_at?: string
          year?: number | null
        }
        Relationships: []
      }
      media_progressions: {
        Row: {
          created_at: string
          id: string
          media_id: string
          progression_data: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          media_id: string
          progression_data?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          media_id?: string
          progression_data?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      media_subscriptions: {
        Row: {
          created_at: string | null
          id: string
          media_id: string
          media_type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          media_id: string
          media_type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          media_id?: string
          media_type?: string
          user_id?: string
        }
        Relationships: []
      }
      media_suggestions: {
        Row: {
          admin_notes: string | null
          author: string | null
          cover_url: string | null
          creator: string | null
          description: string | null
          director: string | null
          id: string
          platform: string | null
          processed_at: string | null
          processed_by: string | null
          publisher: string | null
          status: string
          suggested_at: string | null
          suggested_by: string | null
          title: string
          type: string
          year: number | null
        }
        Insert: {
          admin_notes?: string | null
          author?: string | null
          cover_url?: string | null
          creator?: string | null
          description?: string | null
          director?: string | null
          id?: string
          platform?: string | null
          processed_at?: string | null
          processed_by?: string | null
          publisher?: string | null
          status?: string
          suggested_at?: string | null
          suggested_by?: string | null
          title: string
          type: string
          year?: number | null
        }
        Update: {
          admin_notes?: string | null
          author?: string | null
          cover_url?: string | null
          creator?: string | null
          description?: string | null
          director?: string | null
          id?: string
          platform?: string | null
          processed_at?: string | null
          processed_by?: string | null
          publisher?: string | null
          status?: string
          suggested_at?: string | null
          suggested_by?: string | null
          title?: string
          type?: string
          year?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          cover_image: string | null
          created_at: string | null
          followers_count: number | null
          following_count: number | null
          full_name: string | null
          id: string
          social_share_settings: Json | null
          updated_at: string | null
          username: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          cover_image?: string | null
          created_at?: string | null
          followers_count?: number | null
          following_count?: number | null
          full_name?: string | null
          id: string
          social_share_settings?: Json | null
          updated_at?: string | null
          username: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          cover_image?: string | null
          created_at?: string | null
          followers_count?: number | null
          following_count?: number | null
          full_name?: string | null
          id?: string
          social_share_settings?: Json | null
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      user_media: {
        Row: {
          added_at: string
          id: string
          media_id: string
          notes: string | null
          status: string | null
          updated_at: string
          user_id: string
          user_rating: number | null
        }
        Insert: {
          added_at?: string
          id?: string
          media_id: string
          notes?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
          user_rating?: number | null
        }
        Update: {
          added_at?: string
          id?: string
          media_id?: string
          notes?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
          user_rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_media_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
        ]
      }
      user_relations: {
        Row: {
          created_at: string | null
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string | null
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string | null
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      are_friends: {
        Args: { user_id1: string; user_id2: string }
        Returns: boolean
      }
      get_pending_friend_requests: {
        Args: { user_id: string }
        Returns: {
          request_id: string
          sender_id: string
          username: string
          avatar_url: string
          created_at: string
        }[]
      }
      get_user_friends: {
        Args: { user_id: string }
        Returns: {
          friend_id: string
          username: string
          avatar_url: string
          status: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
