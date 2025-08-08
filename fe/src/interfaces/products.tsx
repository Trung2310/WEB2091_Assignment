export interface Product {
  id: string;
  name: string;
  price: number;
  color: string;
  brandId?: number;
  categoryId?: number;
  size?: number[];
  image: string;
  stock?: number;
  description?: string;
  isAvailable?: boolean;
  brand?: { id: number; name: string };
  category?: { id: number; name: string };
}