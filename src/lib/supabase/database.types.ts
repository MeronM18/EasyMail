export type Json =
  string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      classification_corrections: {
        Row: {
          created_at: string;
          from_intent: string;
          id: string;
          message_id: string;
          to_intent: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          from_intent: string;
          id?: string;
          message_id: string;
          to_intent: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          from_intent?: string;
          id?: string;
          message_id?: string;
          to_intent?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "classification_corrections_message_id_fkey";
            columns: ["message_id"];
            isOneToOne: false;
            referencedRelation: "messages";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "classification_corrections_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      mail_account_secrets: {
        Row: {
          access_token_ciphertext: string | null;
          access_token_expires_at: string | null;
          mail_account_id: string;
          refresh_token_ciphertext: string | null;
          token_payload_version: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          access_token_ciphertext?: string | null;
          access_token_expires_at?: string | null;
          mail_account_id: string;
          refresh_token_ciphertext?: string | null;
          token_payload_version?: number;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          access_token_ciphertext?: string | null;
          access_token_expires_at?: string | null;
          mail_account_id?: string;
          refresh_token_ciphertext?: string | null;
          token_payload_version?: number;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "mail_account_secrets_mail_account_id_fkey";
            columns: ["mail_account_id"];
            isOneToOne: true;
            referencedRelation: "mail_accounts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "mail_account_secrets_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      mail_accounts: {
        Row: {
          created_at: string;
          email_address: string;
          id: string;
          last_sync_attempt_at: string | null;
          last_synced_at: string | null;
          nickname: string | null;
          provider: string;
          provider_account_id: string;
          scopes_granted: string[];
          status: string;
          status_message: string | null;
          sync_cursor: Json | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          email_address: string;
          id?: string;
          last_sync_attempt_at?: string | null;
          last_synced_at?: string | null;
          nickname?: string | null;
          provider: string;
          provider_account_id: string;
          scopes_granted?: string[];
          status: string;
          status_message?: string | null;
          sync_cursor?: Json | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          email_address?: string;
          id?: string;
          last_sync_attempt_at?: string | null;
          last_synced_at?: string | null;
          nickname?: string | null;
          provider?: string;
          provider_account_id?: string;
          scopes_granted?: string[];
          status?: string;
          status_message?: string | null;
          sync_cursor?: Json | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "mail_accounts_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      message_classifications: {
        Row: {
          action_signal: string | null;
          classified_at: string;
          effective_intent: string;
          is_user_override: boolean;
          message_id: string;
          model_id: string | null;
          model_intent: string;
          reason: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          action_signal?: string | null;
          classified_at: string;
          effective_intent: string;
          is_user_override?: boolean;
          message_id: string;
          model_id?: string | null;
          model_intent: string;
          reason?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          action_signal?: string | null;
          classified_at?: string;
          effective_intent?: string;
          is_user_override?: boolean;
          message_id?: string;
          model_id?: string | null;
          model_intent?: string;
          reason?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "message_classifications_message_id_fkey";
            columns: ["message_id"];
            isOneToOne: true;
            referencedRelation: "messages";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "message_classifications_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      messages: {
        Row: {
          body_retained_until: string | null;
          body_text: string | null;
          classification_status: string;
          created_at: string;
          from_address: string;
          from_name: string | null;
          id: string;
          is_handled: boolean;
          mail_account_id: string;
          provider_message_id: string;
          provider_thread_id: string | null;
          raw_internal_date: string | null;
          received_at: string;
          snippet: string;
          subject: string;
          updated_at: string;
          user_id: string;
          web_link: string | null;
        };
        Insert: {
          body_retained_until?: string | null;
          body_text?: string | null;
          classification_status: string;
          created_at?: string;
          from_address: string;
          from_name?: string | null;
          id?: string;
          is_handled?: boolean;
          mail_account_id: string;
          provider_message_id: string;
          provider_thread_id?: string | null;
          raw_internal_date?: string | null;
          received_at: string;
          snippet?: string;
          subject?: string;
          updated_at?: string;
          user_id: string;
          web_link?: string | null;
        };
        Update: {
          body_retained_until?: string | null;
          body_text?: string | null;
          classification_status?: string;
          created_at?: string;
          from_address?: string;
          from_name?: string | null;
          id?: string;
          is_handled?: boolean;
          mail_account_id?: string;
          provider_message_id?: string;
          provider_thread_id?: string | null;
          raw_internal_date?: string | null;
          received_at?: string;
          snippet?: string;
          subject?: string;
          updated_at?: string;
          user_id?: string;
          web_link?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "messages_mail_account_id_fkey";
            columns: ["mail_account_id"];
            isOneToOne: false;
            referencedRelation: "mail_accounts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "messages_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      oauth_states: {
        Row: {
          code_verifier: string | null;
          created_at: string;
          expires_at: string;
          provider: string;
          state: string;
          user_id: string;
        };
        Insert: {
          code_verifier?: string | null;
          created_at?: string;
          expires_at: string;
          provider: string;
          state: string;
          user_id: string;
        };
        Update: {
          code_verifier?: string | null;
          created_at?: string;
          expires_at?: string;
          provider?: string;
          state?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "oauth_states_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          created_at: string;
          display_name: string | null;
          id: string;
          last_recap_visit_at: string | null;
          onboarding_completed_at: string | null;
          recap_session_started_at: string | null;
          recap_window_start_at: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          display_name?: string | null;
          id: string;
          last_recap_visit_at?: string | null;
          onboarding_completed_at?: string | null;
          recap_session_started_at?: string | null;
          recap_window_start_at?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          display_name?: string | null;
          id?: string;
          last_recap_visit_at?: string | null;
          onboarding_completed_at?: string | null;
          recap_session_started_at?: string | null;
          recap_window_start_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      sync_runs: {
        Row: {
          created_at: string;
          error_summary: string | null;
          finished_at: string | null;
          id: string;
          mail_account_id: string;
          started_at: string | null;
          stats: Json | null;
          status: string;
          trigger: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          error_summary?: string | null;
          finished_at?: string | null;
          id?: string;
          mail_account_id: string;
          started_at?: string | null;
          stats?: Json | null;
          status: string;
          trigger: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          error_summary?: string | null;
          finished_at?: string | null;
          id?: string;
          mail_account_id?: string;
          started_at?: string | null;
          stats?: Json | null;
          status?: string;
          trigger?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "sync_runs_mail_account_id_fkey";
            columns: ["mail_account_id"];
            isOneToOne: false;
            referencedRelation: "mail_accounts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "sync_runs_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      correct_message_classification: {
        Args: { p_message_id: string; p_to_intent: string };
        Returns: undefined;
      };
      record_recap_visit: {
        Args: { p_previous_visit_at: string; p_window_start_at: string };
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const;
