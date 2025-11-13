import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem, WishlistItem } from '@/types';

interface StoreState {
  cart: CartItem[];
  wishlist: WishlistItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateCartQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  addToWishlist: (productId: number) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  getCartTotal: () => number;
  getCartCount: () => number;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],

      addToCart: (product: Product, quantity = 1) => {
        set((state) => {
          const existingItem = state.cart.find(
            (item) => item.product.id === product.id
          );

          if (existingItem) {
            return {
              cart: state.cart.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }

          return {
            cart: [...state.cart, { product, quantity }],
          };
        });
      },

      removeFromCart: (productId: number) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.product.id !== productId),
        }));
      },

      updateCartQuantity: (productId: number, quantity: number) => {
        set((state) => ({
          cart: state.cart.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ cart: [] });
      },

      addToWishlist: (productId: number) => {
        set((state) => {
          if (!state.wishlist.find((item) => item.productId === productId)) {
            return {
              wishlist: [...state.wishlist, { productId }],
            };
          }
          return state;
        });
      },

      removeFromWishlist: (productId: number) => {
        set((state) => ({
          wishlist: state.wishlist.filter((item) => item.productId !== productId),
        }));
      },

      isInWishlist: (productId: number) => {
        return get().wishlist.some((item) => item.productId === productId);
      },

      getCartTotal: () => {
        return get().cart.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },

      getCartCount: () => {
        return get().cart.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'ecommerce-storage',
    }
  )
);
