'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Package, Truck, CheckCircle, XCircle } from 'lucide-react';

const statusIcons = {
  pending: Package,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
};

const statusColors = {
  pending: 'text-yellow-600 dark:text-yellow-500',
  processing: 'text-blue-600 dark:text-blue-500',
  shipped: 'text-purple-600 dark:text-purple-500',
  delivered: 'text-green-600 dark:text-green-500',
  cancelled: 'text-red-600 dark:text-red-500',
};

const statusSteps = ['pending', 'processing', 'shipped', 'delivered'];

export default function TrackOrderPage() {
  const searchParams = useSearchParams();
  const initialOrderId = searchParams.get('orderId') || '';

  const [orderId, setOrderId] = useState(initialOrderId);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialOrderId) {
      trackOrder(initialOrderId);
    }
  }, [initialOrderId]);

  const trackOrder = async (id: string) => {
    if (!id.trim()) {
      setError('Please enter an order ID');
      return;
    }

    setLoading(true);
    setError('');
    setOrderDetails(null);

    try {
      const res = await fetch(`/api/orders/${id}`);

      if (!res.ok) {
        throw new Error('Order not found');
      }

      const data = await res.json();
      setOrderDetails(data);
    } catch (err) {
      setError('Order not found. Please check your order ID and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trackOrder(orderId);
  };

  const getCurrentStepIndex = () => {
    if (!orderDetails) return -1;
    if (orderDetails.status === 'cancelled') return -1;
    return statusSteps.indexOf(orderDetails.status);
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Track Your Order</h1>

        {/* Search form */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Enter your order ID (e.g., 1, 2, 3...)"
                className="w-full pl-10 pr-4 py-3 rounded-md border bg-background"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {loading ? 'Searching...' : 'Track'}
            </button>
          </div>
          {error && <p className="text-sm text-destructive mt-2">{error}</p>}
        </form>

        {/* Order details */}
        {orderDetails && (
          <div className="space-y-6">
            {/* Order info */}
            <div className="bg-card border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold">Order #{orderDetails.id}</h2>
                  <p className="text-sm text-muted-foreground">
                    Placed on {new Date(orderDetails.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">${orderDetails.total_amount.toFixed(2)}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    {React.createElement(statusIcons[orderDetails.status as keyof typeof statusIcons], {
                      className: `h-4 w-4 ${statusColors[orderDetails.status as keyof typeof statusColors]}`,
                    })}
                    <span
                      className={`text-sm font-semibold capitalize ${
                        statusColors[orderDetails.status as keyof typeof statusColors]
                      }`}
                    >
                      {orderDetails.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress tracker */}
              {orderDetails.status !== 'cancelled' && (
                <div className="mt-6">
                  <div className="flex justify-between mb-2">
                    {statusSteps.map((step, index) => (
                      <div
                        key={step}
                        className={`flex-1 text-center text-xs font-medium capitalize ${
                          index <= currentStepIndex
                            ? 'text-primary'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {step}
                      </div>
                    ))}
                  </div>
                  <div className="relative">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-500"
                        style={{
                          width: `${((currentStepIndex + 1) / statusSteps.length) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Shipping info */}
            <div className="bg-card border rounded-lg p-6">
              <h3 className="font-bold mb-4">Shipping Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-medium">{orderDetails.user_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">{orderDetails.user_email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone:</span>
                  <span className="font-medium">{orderDetails.user_phone}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-muted-foreground">Address:</span>
                  <span className="font-medium text-right max-w-xs">
                    {orderDetails.user_address}
                  </span>
                </div>
              </div>
            </div>

            {/* Order items */}
            <div className="bg-card border rounded-lg p-6">
              <h3 className="font-bold mb-4">Order Items</h3>
              <div className="space-y-4">
                {orderDetails.items.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center pb-4 border-b last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">{item.product_name}</p>
                      <p className="text-sm text-muted-foreground">
                        ${item.product_price.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                    <p className="font-bold">
                      ${(item.product_price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
