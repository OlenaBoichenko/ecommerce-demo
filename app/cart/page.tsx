'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/lib/store';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const cart = useStore((state) => state.cart);
  const updateCartQuantity = useStore((state) => state.updateCartQuantity);
  const removeFromCart = useStore((state) => state.removeFromCart);
  const getCartTotal = useStore((state) => state.getCartTotal());

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-md mx-auto">
          <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">
            Add some products to your cart to get started
          </p>
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-semibold"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.product.id}
              className="flex gap-4 p-4 rounded-lg border bg-card"
            >
              {/* Image */}
              <Link
                href={`/products/${item.product.id}`}
                className="relative w-24 h-24 flex-shrink-0 rounded-md overflow-hidden bg-muted"
              >
                <Image
                  src={item.product.image_url}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </Link>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <Link
                  href={`/products/${item.product.id}`}
                  className="font-semibold hover:text-primary transition-colors block mb-1"
                >
                  {item.product.name}
                </Link>
                <p className="text-sm text-muted-foreground mb-2">
                  {item.product.category}
                </p>
                <p className="text-lg font-bold">
                  ${item.product.price.toFixed(2)}
                </p>
              </div>

              {/* Quantity controls */}
              <div className="flex flex-col items-end justify-between">
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="text-destructive hover:text-destructive/80 transition-colors"
                  aria-label="Remove from cart"
                >
                  <Trash2 className="h-5 w-5" />
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      updateCartQuantity(item.product.id, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1}
                    className="w-8 h-8 rounded-md border flex items-center justify-center hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-8 text-center font-semibold">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateCartQuantity(item.product.id, item.quantity + 1)
                    }
                    disabled={item.quantity >= item.product.stock_quantity}
                    className="w-8 h-8 rounded-md border flex items-center justify-center hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>

                <p className="text-sm font-semibold">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 p-6 rounded-lg border bg-card space-y-6">
            <h2 className="text-xl font-bold">Order Summary</h2>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">${getCartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-semibold">Free</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-semibold">Calculated at checkout</span>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between mb-6">
                <span className="text-lg font-bold">Total</span>
                <span className="text-2xl font-bold text-primary">
                  ${getCartTotal.toFixed(2)}
                </span>
              </div>

              <Link
                href="/checkout"
                className="block w-full text-center px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-semibold"
              >
                Proceed to Checkout
              </Link>
            </div>

            <Link
              href="/products"
              className="block text-center text-sm text-primary hover:underline"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
