'use client';

import React, { useEffect, useState } from 'react';
import { Order } from '@/types';
import { Package, Truck, CheckCircle, XCircle } from 'lucide-react';

const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const statusIcons = {
  pending: Package,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
};

const statusColors = {
  pending: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300',
  processing: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
  shipped: 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300',
  delivered: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300',
  cancelled: 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        alert('Order status updated successfully!');
        fetchOrders();
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      } else {
        alert('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error updating order status');
    }
  };

  const viewOrderDetails = async (orderId: number) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedOrder(data);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Manage Orders</h1>
        <p className="text-muted-foreground">View and update order statuses</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No orders found</p>
        </div>
      ) : (
        <div className="bg-card border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-semibold">Order ID</th>
                  <th className="text-left p-4 font-semibold">Customer</th>
                  <th className="text-left p-4 font-semibold">Date</th>
                  <th className="text-left p-4 font-semibold">Total</th>
                  <th className="text-left p-4 font-semibold">Status</th>
                  <th className="text-right p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-t">
                    <td className="p-4 font-mono">#{order.id}</td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{order.user_name}</p>
                        <p className="text-sm text-muted-foreground">{order.user_email}</p>
                      </div>
                    </td>
                    <td className="p-4 text-sm">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 font-semibold">${order.total_amount.toFixed(2)}</td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        {React.createElement(
                          statusIcons[order.status as keyof typeof statusIcons],
                          { className: 'h-4 w-4' }
                        )}
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold capitalize ${
                            statusColors[order.status as keyof typeof statusColors]
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => viewOrderDetails(order.id)}
                          className="px-3 py-1 text-sm border rounded hover:bg-accent transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background border rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Order #{selectedOrder.id}</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="font-bold mb-3">Customer Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-medium">{selectedOrder.user_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium">{selectedOrder.user_email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone:</span>
                    <span className="font-medium">{selectedOrder.user_phone}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-muted-foreground">Address:</span>
                    <span className="font-medium text-right max-w-xs">
                      {selectedOrder.user_address}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Status */}
              <div className="border-t pt-6">
                <h3 className="font-bold mb-3">Order Status</h3>
                <select
                  value={selectedOrder.status}
                  onChange={(e) =>
                    handleStatusChange(selectedOrder.id, e.target.value)
                  }
                  className="w-full px-4 py-2 rounded-md border bg-background"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Order Items */}
              <div className="border-t pt-6">
                <h3 className="font-bold mb-3">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center pb-3 border-b last:border-0"
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

              {/* Order Total */}
              <div className="border-t pt-6">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>${selectedOrder.total_amount.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Info */}
              <div className="border-t pt-6 text-sm text-muted-foreground">
                <p>
                  Payment ID: <span className="font-mono">{selectedOrder.stripe_payment_id}</span>
                </p>
                <p>
                  Order Date:{' '}
                  {new Date(selectedOrder.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
