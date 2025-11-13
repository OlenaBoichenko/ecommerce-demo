'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Product } from '@/types';
import { useStore } from '@/lib/store';
import { Heart, Minus, Plus, ShoppingCart, ArrowLeft } from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const addToCart = useStore((state) => state.addToCart);
  const addToWishlist = useStore((state) => state.addToWishlist);
  const removeFromWishlist = useStore((state) => state.removeFromWishlist);
  const isInWishlist = useStore((state) =>
    product ? state.isInWishlist(product.id) : false
  );

  useEffect(() => {
    fetchProduct();
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setProduct(data);
      } else {
        router.push('/products');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      router.push('/cart');
    }
  };

  const handleToggleWishlist = () => {
    if (product) {
      if (isInWishlist) {
        removeFromWishlist(product.id);
      } else {
        addToWishlist(product.id);
      }
    }
  };

  const incrementQuantity = () => {
    if (product && quantity < product.stock_quantity) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <p className="text-muted-foreground">Product not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center space-x-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image */}
        <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <span className="text-sm text-muted-foreground">{product.category}</span>
            <h1 className="text-3xl font-bold mt-2 mb-4">{product.name}</h1>
            <p className="text-4xl font-bold text-primary">
              ${product.price.toFixed(2)}
            </p>
          </div>

          <div className="border-t border-b py-4">
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          {/* Stock status */}
          <div>
            {product.stock_quantity === 0 ? (
              <div className="bg-destructive/10 text-destructive px-4 py-2 rounded-md">
                Out of Stock
              </div>
            ) : product.stock_quantity < 10 ? (
              <div className="bg-amber-500/10 text-amber-600 dark:text-amber-500 px-4 py-2 rounded-md">
                Only {product.stock_quantity} left in stock!
              </div>
            ) : (
              <div className="bg-green-500/10 text-green-600 dark:text-green-500 px-4 py-2 rounded-md">
                In Stock ({product.stock_quantity} available)
              </div>
            )}
          </div>

          {/* Quantity selector */}
          {product.stock_quantity > 0 && (
            <div>
              <label className="block text-sm font-medium mb-2">Quantity</label>
              <div className="flex items-center space-x-4">
                <button
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="w-10 h-10 rounded-md border flex items-center justify-center hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="text-xl font-semibold w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={incrementQuantity}
                  disabled={quantity >= product.stock_quantity}
                  className="w-10 h-10 rounded-md border flex items-center justify-center hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleAddToCart}
              disabled={product.stock_quantity === 0}
              className="w-full flex items-center justify-center space-x-2 bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Add to Cart</span>
            </button>

            <button
              onClick={handleToggleWishlist}
              className={`w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-md border transition-colors ${
                isInWishlist
                  ? 'bg-red-50 dark:bg-red-950 border-red-500 text-red-500'
                  : 'hover:bg-accent'
              }`}
            >
              <Heart
                className={`h-5 w-5 ${isInWishlist ? 'fill-red-500' : ''}`}
              />
              <span>{isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}</span>
            </button>
          </div>

          {/* Product info */}
          <div className="border-t pt-6 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Category:</span>
              <span className="font-medium">{product.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Product ID:</span>
              <span className="font-medium">#{product.id}</span>
            </div>
            {product.featured && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Featured:</span>
                <span className="font-medium text-primary">Yes</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
