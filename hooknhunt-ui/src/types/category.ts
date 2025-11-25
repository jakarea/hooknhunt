// src/types/category.ts
export interface Category {
  id: number;
  name: string;
  slug: string;
  parent_id: number | null;
  image_url?: string | null;
  created_at?: string;
  updated_at?: string;
}
