import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { mockDb } from '@/lib/mock-db';
import { Order } from '@/types';

export async function GET() {
  try {
    try {
      // Try MySQL first
      const orders = await query<Order[]>(
        'SELECT * FROM orders ORDER BY created_at DESC'
      );

      return NextResponse.json(orders);
    } catch (dbError) {
      // Fallback to mock database
      const orders = mockDb.getOrders();
      return NextResponse.json(orders);
    }
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
