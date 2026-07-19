export interface Review {
  id: number;

  name: string;

  review: string;

  rating: number;

  country: string | null;

  status: string;

  approved: boolean;

  is_featured: boolean;

  display_order: number | null;

  created_at: string;
}