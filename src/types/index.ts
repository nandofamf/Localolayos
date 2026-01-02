export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  minStock: number;
  barcode?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Sale {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
  paymentMethod: string;
}

export interface Category {
  id: string;
  name: string;
}

export const CATEGORIES = [
  "Todos",
  "Metales",
  "Tintas",
  
];
