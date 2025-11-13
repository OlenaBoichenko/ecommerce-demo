import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <ShoppingCart className="h-6 w-6" />
              <span className="font-bold text-xl">ShopDemo</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Your one-stop shop for quality products. Demo e-commerce platform.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-semibold mb-4">Shop</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/products?category=Electronics" className="hover:text-primary transition-colors">
                  Electronics
                </Link>
              </li>
              <li>
                <Link href="/products?category=Fashion" className="hover:text-primary transition-colors">
                  Fashion
                </Link>
              </li>
              <li>
                <Link href="/products?category=Home" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products?category=Sports" className="hover:text-primary transition-colors">
                  Sports
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/orders/track" className="hover:text-primary transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-primary transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-primary transition-colors">
                  Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Admin */}
          <div>
            <h3 className="font-semibold mb-4">Admin</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/admin" className="hover:text-primary transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/admin/products" className="hover:text-primary transition-colors">
                  Manage Products
                </Link>
              </li>
              <li>
                <Link href="/admin/orders" className="hover:text-primary transition-colors">
                  Manage Orders
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Olena Boichenko. All rights reserved. This is a demo project.</p>
        </div>
      </div>
    </footer>
  );
}
