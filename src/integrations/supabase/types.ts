export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      blog_posts: {
        Row: {
          author_name: string
          category: string
          content: string
          cover_image: string | null
          created_at: string
          created_by: string | null
          excerpt: string | null
          id: string
          published: boolean | null
          read_time: number | null
          seo_description: string | null
          seo_keywords: string | null
          seo_title: string | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          author_name?: string
          category?: string
          content: string
          cover_image?: string | null
          created_at?: string
          created_by?: string | null
          excerpt?: string | null
          id?: string
          published?: boolean | null
          read_time?: number | null
          seo_description?: string | null
          seo_keywords?: string | null
          seo_title?: string | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          author_name?: string
          category?: string
          content?: string
          cover_image?: string | null
          created_at?: string
          created_by?: string | null
          excerpt?: string | null
          id?: string
          published?: boolean | null
          read_time?: number | null
          seo_description?: string | null
          seo_keywords?: string | null
          seo_title?: string | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      enquiries: {
        Row: {
          assigned_to: string | null
          bhk: string | null
          budget: string | null
          created_at: string
          email: string | null
          follow_up_at: string | null
          id: string
          last_contacted_at: string | null
          lost_reason: string | null
          message: string | null
          name: string
          page_url: string | null
          phone: string
          preferred_location: string | null
          priority: string
          property_id: string | null
          property_title: string | null
          property_type: string | null
          purpose: string | null
          source: string | null
          status: string
          tags: string[] | null
          updated_at: string
          utm_campaign: string | null
          utm_source: string | null
        }
        Insert: {
          assigned_to?: string | null
          bhk?: string | null
          budget?: string | null
          created_at?: string
          email?: string | null
          follow_up_at?: string | null
          id?: string
          last_contacted_at?: string | null
          lost_reason?: string | null
          message?: string | null
          name: string
          page_url?: string | null
          phone: string
          preferred_location?: string | null
          priority?: string
          property_id?: string | null
          property_title?: string | null
          property_type?: string | null
          purpose?: string | null
          source?: string | null
          status?: string
          tags?: string[] | null
          updated_at?: string
          utm_campaign?: string | null
          utm_source?: string | null
        }
        Update: {
          assigned_to?: string | null
          bhk?: string | null
          budget?: string | null
          created_at?: string
          email?: string | null
          follow_up_at?: string | null
          id?: string
          last_contacted_at?: string | null
          lost_reason?: string | null
          message?: string | null
          name?: string
          page_url?: string | null
          phone?: string
          preferred_location?: string | null
          priority?: string
          property_id?: string | null
          property_title?: string | null
          property_type?: string | null
          purpose?: string | null
          source?: string | null
          status?: string
          tags?: string[] | null
          updated_at?: string
          utm_campaign?: string | null
          utm_source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enquiries_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      gallery_images: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          id: string
          image_url: string
          sort_order: number | null
          title: string | null
        }
        Insert: {
          category?: string
          created_at?: string
          created_by?: string | null
          id?: string
          image_url: string
          sort_order?: number | null
          title?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          id?: string
          image_url?: string
          sort_order?: number | null
          title?: string | null
        }
        Relationships: []
      }
      homepage_content: {
        Row: {
          created_at: string
          description: string | null
          extra_data: Json | null
          icon: string | null
          id: string
          image: string | null
          section: string
          sort_order: number | null
          subtitle: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          extra_data?: Json | null
          icon?: string | null
          id?: string
          image?: string | null
          section: string
          sort_order?: number | null
          subtitle?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          extra_data?: Json | null
          icon?: string | null
          id?: string
          image?: string | null
          section?: string
          sort_order?: number | null
          subtitle?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      lead_activities: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          details: string | null
          enquiry_id: string
          id: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          details?: string | null
          enquiry_id: string
          id?: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          details?: string | null
          enquiry_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_activities_enquiry_id_fkey"
            columns: ["enquiry_id"]
            isOneToOne: false
            referencedRelation: "enquiries"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_notes: {
        Row: {
          author_email: string | null
          author_id: string | null
          created_at: string
          enquiry_id: string
          id: string
          note: string
        }
        Insert: {
          author_email?: string | null
          author_id?: string | null
          created_at?: string
          enquiry_id: string
          id?: string
          note: string
        }
        Update: {
          author_email?: string | null
          author_id?: string | null
          created_at?: string
          enquiry_id?: string
          id?: string
          note?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_notes_enquiry_id_fkey"
            columns: ["enquiry_id"]
            isOneToOne: false
            referencedRelation: "enquiries"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          active: boolean | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          listing_count: number | null
          name: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          listing_count?: number | null
          name: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          listing_count?: number | null
          name?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          amenities: string[] | null
          area: number
          area_unit: string
          bedrooms: number
          created_at: string
          created_by: string | null
          description: string | null
          featured: boolean | null
          id: string
          images: string[] | null
          latitude: number | null
          location: string
          longitude: number | null
          price: number
          slug: string
          status: string
          title: string
          type: string
          updated_at: string
          view_count: number
        }
        Insert: {
          amenities?: string[] | null
          area: number
          area_unit?: string
          bedrooms?: number
          created_at?: string
          created_by?: string | null
          description?: string | null
          featured?: boolean | null
          id?: string
          images?: string[] | null
          latitude?: number | null
          location: string
          longitude?: number | null
          price: number
          slug: string
          status?: string
          title: string
          type: string
          updated_at?: string
          view_count?: number
        }
        Update: {
          amenities?: string[] | null
          area?: number
          area_unit?: string
          bedrooms?: number
          created_at?: string
          created_by?: string | null
          description?: string | null
          featured?: boolean | null
          id?: string
          images?: string[] | null
          latitude?: number | null
          location?: string
          longitude?: number | null
          price?: number
          slug?: string
          status?: string
          title?: string
          type?: string
          updated_at?: string
          view_count?: number
        }
        Relationships: []
      }
      property_submissions: {
        Row: {
          area: number | null
          bedrooms: number | null
          created_at: string
          description: string | null
          id: string
          images: string[] | null
          location: string
          owner_email: string | null
          owner_name: string
          owner_phone: string
          price: number | null
          review_status: string
          status: string
          title: string
          type: string
        }
        Insert: {
          area?: number | null
          bedrooms?: number | null
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          location: string
          owner_email?: string | null
          owner_name: string
          owner_phone: string
          price?: number | null
          review_status?: string
          status?: string
          title: string
          type: string
        }
        Update: {
          area?: number | null
          bedrooms?: number | null
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          location?: string
          owner_email?: string | null
          owner_name?: string
          owner_phone?: string
          price?: number | null
          review_status?: string
          status?: string
          title?: string
          type?: string
        }
        Relationships: []
      }
      site_pages: {
        Row: {
          content: string
          id: string
          seo_description: string | null
          seo_title: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          content?: string
          id?: string
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          id?: string
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          id: string
          setting_key: string
          setting_value: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          id?: string
          setting_key: string
          setting_value?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          id?: string
          setting_key?: string
          setting_value?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      site_visits: {
        Row: {
          agent_id: string | null
          client_name: string
          client_phone: string
          created_at: string
          enquiry_id: string | null
          id: string
          notes: string | null
          property_id: string | null
          property_title: string | null
          status: string
          visit_at: string
        }
        Insert: {
          agent_id?: string | null
          client_name: string
          client_phone: string
          created_at?: string
          enquiry_id?: string | null
          id?: string
          notes?: string | null
          property_id?: string | null
          property_title?: string | null
          status?: string
          visit_at: string
        }
        Update: {
          agent_id?: string | null
          client_name?: string
          client_phone?: string
          created_at?: string
          enquiry_id?: string | null
          id?: string
          notes?: string | null
          property_id?: string | null
          property_title?: string | null
          status?: string
          visit_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "site_visits_enquiry_id_fkey"
            columns: ["enquiry_id"]
            isOneToOne: false
            referencedRelation: "enquiries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "site_visits_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      assign_role_by_email: {
        Args: { _email: string; _role: Database["public"]["Enums"]["app_role"] }
        Returns: string
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_staff: { Args: { _uid: string }; Returns: boolean }
      list_staff: {
        Args: never
        Returns: {
          email: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }[]
      }
      remove_team_member: { Args: { _user_id: string }; Returns: undefined }
      track_property_view: {
        Args: { _property_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "editor" | "agent"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "editor", "agent"],
    },
  },
} as const
