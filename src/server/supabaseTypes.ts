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
      stickers: {
        Row: {
          created_at: string | null;
          id: number;
          prompt: string | null;
          type: Database["public"]["Enums"]["stickertype"];
          url: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          prompt?: string | null;
          type?: Database["public"]["Enums"]["stickertype"];
          url?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          prompt?: string | null;
          type?: Database["public"]["Enums"]["stickertype"];
          url?: string | null;
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
