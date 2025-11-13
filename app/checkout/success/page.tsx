'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId');
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    } else {
      router.push('/');
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      if (res.ok) {
        const data = await res.json();
        setOrderDetails(data);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  if (!orderDetails) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-2xl mx-auto">
        {/* Success message */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mb-4">
            <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Order Placed Successfully!</h1>
          <p className="text-muted-foreground">
            Thank you for your purchase. Your order has been confirmed.
          </p>
        </div>

        {/* Order details */}
        <div className="bg-card border rounded-lg p-6 space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-4">Order Details</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Number:</span>
                <span className="font-semibold">#{orderDetails.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Date:</span>
                <span className="font-semibold">
                  {new Date(orderDetails.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className="font-semibold capitalize">{orderDetails.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Amount:</span>
                <span className="font-semibold text-lg">
                  ${orderDetails.total_amount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Shipping Information</h3>
            <div className="text-sm space-y-1">
              <p>{orderDetails.user_name}</p>
              <p>{orderDetails.user_email}</p>
              <p>{orderDetails.user_phone}</p>
              <p className="text-muted-foreground">{orderDetails.user_address}</p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Order Items</h3>
            <div className="space-y-3">
              {orderDetails.items.map((item: any) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <div>
                    <p className="font-medium">{item.product_name}</p>
                    <p className="text-muted-foreground">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">
                    ${(item.product_price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-muted/50 p-4 rounded-md flex items-start space-x-3">
            <Package className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-semibold mb-1">What's next?</p>
              <p className="text-muted-foreground">
                We've sent a confirmation email to {orderDetails.user_email}. You can track your
                order status using the order number above.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={`/orders/track?orderId=${orderId}`}
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-semibold"
          >
            Track Order
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-6 py-3 border rounded-md hover:bg-accent transition-colors font-semibold"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
