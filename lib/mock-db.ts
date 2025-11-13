// Mock database for demo purposes when MySQL is not available
import { Product, Order, OrderItem } from '@/types';

// Mock Products Data
export const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Wireless Headphones',
    description: 'Premium wireless headphones with noise cancellation and 30-hour battery life',
    price: 199.99,
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    category: 'Electronics',
    stock_quantity: 50,
    featured: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 2,
    name: 'Smart Watch',
    description: 'Fitness tracking smartwatch with heart rate monitor and GPS',
    price: 299.99,
    image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    category: 'Electronics',
    stock_quantity: 35,
    featured: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 3,
    name: 'Running Shoes',
    description: 'Professional running shoes with advanced cushioning technology',
    price: 129.99,
    image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
    category: 'Fashion',
    stock_quantity: 100,
    featured: false,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 4,
    name: 'Backpack',
    description: 'Durable travel backpack with laptop compartment',
    price: 79.99,
    image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
    category: 'Fashion',
    stock_quantity: 75,
    featured: false,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 5,
    name: 'Coffee Maker',
    description: 'Automatic coffee maker with programmable timer',
    price: 89.99,
    image_url: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500',
    category: 'Home',
    stock_quantity: 40,
    featured: false,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 6,
    name: 'Desk Lamp',
    description: 'LED desk lamp with adjustable brightness and color temperature',
    price: 49.99,
    image_url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500',
    category: 'Home',
    stock_quantity: 60,
    featured: false,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 7,
    name: 'Yoga Mat',
    description: 'Non-slip yoga mat with carrying strap',
    price: 34.99,
    image_url: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500',
    category: 'Sports',
    stock_quantity: 120,
    featured: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 8,
    name: 'Water Bottle',
    description: 'Insulated stainless steel water bottle, 32oz',
    price: 24.99,
    image_url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500',
    category: 'Sports',
    stock_quantity: 200,
    featured: false,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 9,
    name: 'Bluetooth Speaker',
    description: 'Portable waterproof Bluetooth speaker',
    price: 69.99,
    image_url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500',
    category: 'Electronics',
    stock_quantity: 80,
    featured: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 10,
    name: 'Sunglasses',
    description: 'Polarized UV protection sunglasses',
    price: 59.99,
    image_url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500',
    category: 'Fashion',
    stock_quantity: 90,
    featured: false,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 11,
    name: 'Plant Pot',
    description: 'Ceramic plant pot with drainage hole',
    price: 19.99,
    image_url: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500',
    category: 'Home',
    stock_quantity: 150,
    featured: false,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 12,
    name: 'Dumbbell Set',
    description: 'Adjustable dumbbell set, 5-25 lbs',
    price: 149.99,
    image_url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500',
    category: 'Sports',
    stock_quantity: 45,
    featured: false,
    created_at: new Date(),
    updated_at: new Date(),
  },
];

// Mock Orders Storage (in-memory)
let mockOrders: any[] = [];
let nextOrderId = 1;

export const mockDb = {
  // Products
  getProducts: (filters?: {
    category?: string;
    featured?: boolean;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
  }) => {
    let filtered = [...mockProducts];

    if (filters?.category) {
      filtered = filtered.filter((p) => p.category === filters.category);
    }

    if (filters?.featured) {
      filtered = filtered.filter((p) => p.featured);
    }

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower)
      );
    }

    if (filters?.minPrice !== undefined) {
      filtered = filtered.filter((p) => p.price >= filters.minPrice!);
    }

    if (filters?.maxPrice !== undefined) {
      filtered = filtered.filter((p) => p.price <= filters.maxPrice!);
    }

    return filtered;
  },

  getProductById: (id: number) => {
    return mockProducts.find((p) => p.id === id);
  },

  updateProduct: (id: number, updates: Partial<Product>) => {
    const index = mockProducts.findIndex((p) => p.id === id);
    if (index !== -1) {
      mockProducts[index] = { ...mockProducts[index], ...updates, updated_at: new Date() };
      return true;
    }
    return false;
  },

  addProduct: (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    const newId = Math.max(...mockProducts.map((p) => p.id)) + 1;
    const newProduct: Product = {
      ...product,
      id: newId,
      created_at: new Date(),
      updated_at: new Date(),
    };
    mockProducts.push(newProduct);
    return newId;
  },

  deleteProduct: (id: number) => {
    const index = mockProducts.findIndex((p) => p.id === id);
    if (index !== -1) {
      mockProducts.splice(index, 1);
      return true;
    }
    return false;
  },

  // Orders
  createOrder: (orderData: {
    user_email: string;
    user_name: string;
    user_address: string;
    user_phone: string;
    total_amount: number;
    stripe_payment_id: string;
    items: Array<{
      product_id: number;
      product_name: string;
      product_price: number;
      quantity: number;
    }>;
  }) => {
    const orderId = nextOrderId++;
    const order = {
      id: orderId,
      user_email: orderData.user_email,
      user_name: orderData.user_name,
      user_address: orderData.user_address,
      user_phone: orderData.user_phone,
      total_amount: orderData.total_amount,
      status: 'pending',
      stripe_payment_id: orderData.stripe_payment_id,
      created_at: new Date(),
      updated_at: new Date(),
      items: orderData.items,
    };

    // Update stock
    orderData.items.forEach((item) => {
      const product = mockProducts.find((p) => p.id === item.product_id);
      if (product) {
        product.stock_quantity -= item.quantity;
      }
    });

    mockOrders.push(order);
    return orderId;
  },

  getOrderById: (id: number) => {
    return mockOrders.find((o) => o.id === id);
  },

  getOrders: () => {
    return mockOrders;
  },

  getOrdersByEmail: (email: string) => {
    return mockOrders.filter((o) => o.user_email === email);
  },

  updateOrderStatus: (id: number, status: string) => {
    const order = mockOrders.find((o) => o.id === id);
    if (order) {
      order.status = status;
      order.updated_at = new Date();
      return true;
    }
    return false;
  },
};
