import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { mockDb } from '@/lib/mock-db';
import { Order, OrderItem } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    try {
      // Try MySQL first
      const orders = await query<Order[]>(
        'SELECT * FROM orders WHERE id = ?',
        [id]
      );

      if (orders.length === 0) {
        return NextResponse.json(
          { error: 'Order not found' },
          { status: 404 }
        );
      }

      const order = orders[0];

      // Get order items
      const items = await query<OrderItem[]>(
        'SELECT * FROM order_items WHERE order_id = ?',
        [id]
      );

      return NextResponse.json({
        ...order,
        items,
      });
    } catch (dbError) {
      // Fallback to mock database
      const order = mockDb.getOrderById(parseInt(id));

      if (!order) {
        return NextResponse.json(
          { error: 'Order not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(order);
    }
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }

    try {
      // Try MySQL first
      await query(
        'UPDATE orders SET status = ? WHERE id = ?',
        [status, id]
      );

      return NextResponse.json({ success: true });
    } catch (dbError) {
      // Fallback to mock database
      const success = mockDb.updateOrderStatus(parseInt(id), status);

      if (!success) {
        return NextResponse.json(
          { error: 'Order not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}
