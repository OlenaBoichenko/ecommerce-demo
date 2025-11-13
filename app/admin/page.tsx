'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Package, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/admin/orders'),
      ]);

      if (productsRes.ok && ordersRes.ok) {
        const products = await productsRes.json();
        const orders = await ordersRes.json();

        const totalRevenue = orders.reduce(
          (sum: number, order: any) => sum + parseFloat(order.total_amount),
          0
        );

        const pendingOrders = orders.filter(
          (order: any) => order.status === 'pending' || order.status === 'processing'
        ).length;

        setStats({
          totalProducts: products.length,
          totalOrders: orders.length,
          totalRevenue,
          pendingOrders,
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your e-commerce store from here
        </p>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-card border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Package className="h-6 w-6 text-primary" />
              </div>
            </div>
            <p className="text-2xl font-bold mb-1">{stats.totalProducts}</p>
            <p className="text-sm text-muted-foreground">Total Products</p>
          </div>

          <div className="bg-card border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-blue-500" />
              </div>
            </div>
            <p className="text-2xl font-bold mb-1">{stats.totalOrders}</p>
            <p className="text-sm text-muted-foreground">Total Orders</p>
          </div>

          <div className="bg-card border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-500" />
              </div>
            </div>
            <p className="text-2xl font-bold mb-1">${stats.totalRevenue.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">Total Revenue</p>
          </div>

          <div className="bg-card border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-500" />
              </div>
            </div>
            <p className="text-2xl font-bold mb-1">{stats.pendingOrders}</p>
            <p className="text-sm text-muted-foreground">Pending Orders</p>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/admin/products"
          className="group bg-card border rounded-lg p-6 hover:shadow-lg transition-all"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
              <Package className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1">Manage Products</h3>
              <p className="text-sm text-muted-foreground">
                Add, edit, or remove products from your store
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/orders"
          className="group bg-card border rounded-lg p-6 hover:shadow-lg transition-all"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
              <ShoppingCart className="h-8 w-8 text-blue-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1">Manage Orders</h3>
              <p className="text-sm text-muted-foreground">
                View and update order statuses
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Info */}
      <div className="mt-8 bg-muted/50 rounded-lg p-6">
        <h3 className="font-bold mb-2">Demo Admin Access</h3>
        <p className="text-sm text-muted-foreground">
          This is a demo admin dashboard. In production, you would implement proper
          authentication and authorization. For now, all admin features are publicly accessible
          for demonstration purposes.
        </p>
      </div>
    </div>
  );
}
