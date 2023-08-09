export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      colors: {
        Row: {
          color: Json;
          created_at: string;
          id: number;
          name: string | null;
          percentage: number | null;
          stickerId: number | null;
        };
        Insert: {
          color: Json;
          created_at?: string;
          id?: number;
          name?: string | null;
          percentage?: number | null;
          stickerId?: number | null;
        };
        Update: {
          color?: Json;
          created_at?: string;
          id?: number;
          name?: string | null;
          percentage?: number | null;
          stickerId?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "colors_stickerId_fkey";
            columns: ["stickerId"];
            referencedRelation: "stickers";
            referencedColumns: ["id"];
          }
        ];
      };
      replicate_jobs: {
        Row: {
          created_at: string;
          id: number;
          model: string;
          result: string | null;
          status: string;
          userId: number | null;
        };
        Insert: {
          created_at?: string;
          id: number;
          model: string;
          result?: string | null;
          status: string;
          userId?: number | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          model?: string;
          result?: string | null;
          status?: string;
          userId?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "replicate_jobs_userId_fkey";
            columns: ["userId"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      stickers: {
        Row: {
          created_at: string | null;
          id: number;
          prompt: string | null;
          type: Database["public"]["Enums"]["stickertype"];
          url: string | null;
          userId: number | null;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          prompt?: string | null;
          type?: Database["public"]["Enums"]["stickertype"];
          url?: string | null;
          userId?: number | null;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          prompt?: string | null;
          type?: Database["public"]["Enums"]["stickertype"];
          url?: string | null;
          userId?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "stickers_userId_fkey";
            columns: ["userId"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      users: {
        Row: {
          created_at: string;
          email: string | null;
          id: number;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          id?: number;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          id?: number;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      stickertype: "DALL_E_2" | "MIDJOURNEY";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
