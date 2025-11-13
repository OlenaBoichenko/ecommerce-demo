export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  stock_quantity: number;
  featured: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: number;
  user_email: string;
  user_name: string;
  user_address: string;
  user_phone: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  stripe_payment_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  product_price: number;
  quantity: number;
}

export interface User {
  id: number;
  email: string;
  password_hash: string;
  is_admin: boolean;
  created_at: Date;
}

export interface WishlistItem {
  productId: number;
}
