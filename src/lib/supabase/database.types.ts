export type Json =
  string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type MailProvider = "google" | "microsoft";
type MailAccountStatus = "active" | "needs_reconnect" | "sync_error" | "disconnected";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          last_recap_visit_at: string | null;
          onboarding_completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          last_recap_visit_at?: string | null;
          onboarding_completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          display_name?: string | null;
          last_recap_visit_at?: string | null;
          onboarding_completed_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      mail_accounts: {
        Row: {
          id: string;
          user_id: string;
          provider: MailProvider;
          provider_account_id: string;
          email_address: string;
          nickname: string | null;
          scopes_granted: string[];
          status: MailAccountStatus;
          status_message: string | null;
          sync_cursor: Json | null;
          last_synced_at: string | null;
          last_sync_attempt_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          provider: MailProvider;
          provider_account_id: string;
          email_address: string;
          nickname?: string | null;
          scopes_granted?: string[];
          status: MailAccountStatus;
          status_message?: string | null;
          sync_cursor?: Json | null;
          last_synced_at?: string | null;
          last_sync_attempt_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          nickname?: string | null;
          status?: MailAccountStatus;
          status_message?: string | null;
          sync_cursor?: Json | null;
          last_synced_at?: string | null;
          last_sync_attempt_at?: string | null;
          updated_at?: string;
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
    };
    Views: Record<never, never>;
    Functions: Record<never, never>;
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
};
