'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart } from 'lucide-react';
import { Product } from '@/types';
import { useStore } from '@/lib/store';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addToCart = useStore((state) => state.addToCart);
  const addToWishlist = useStore((state) => state.addToWishlist);
  const removeFromWishlist = useStore((state) => state.removeFromWishlist);
  const isInWishlist = useStore((state) => state.isInWishlist(product.id));

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isInWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  return (
    <Link href={`/products/${product.id}`}>
      <div className="group relative overflow-hidden rounded-lg border bg-card hover:shadow-lg transition-all duration-300">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Stock badge */}
          {product.stock_quantity === 0 && (
            <div className="absolute top-2 left-2 bg-destructive text-destructive-foreground px-2 py-1 rounded text-xs font-semibold">
              Out of Stock
            </div>
          )}

          {/* Featured badge */}
          {product.featured && (
            <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-semibold">
              Featured
            </div>
          )}

          {/* Wishlist button */}
          <button
            onClick={handleToggleWishlist}
            className="absolute top-2 right-2 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors opacity-0 group-hover:opacity-100"
            aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart
              className={`h-4 w-4 ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`}
            />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="mb-2">
            <span className="text-xs text-muted-foreground">{product.category}</span>
          </div>
          <h3 className="font-semibold text-lg mb-2 line-clamp-1">{product.name}</h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>

            <button
              onClick={handleAddToCart}
              disabled={product.stock_quantity === 0}
              className="flex items-center space-x-1 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="text-sm">Add</span>
            </button>
          </div>

          {product.stock_quantity > 0 && product.stock_quantity < 10 && (
            <p className="text-xs text-destructive mt-2">
              Only {product.stock_quantity} left in stock!
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
