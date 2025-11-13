import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { mockDb } from '@/lib/mock-db';
import { stripe } from '@/lib/stripe';
import { CartItem } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cart, customerInfo } = body as {
      cart: CartItem[];
      customerInfo: {
        name: string;
        email: string;
        address: string;
        phone: string;
      };
    };

    if (!cart || cart.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Calculate total
    const totalAmount = cart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    // Create payment intent (demo)
    const paymentId = `demo_${Date.now()}`;

    try {
      // Try MySQL first
      // Create payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(totalAmount * 100), // Convert to cents
        currency: 'usd',
        metadata: {
          customerEmail: customerInfo.email,
          customerName: customerInfo.name,
        },
      });

      // Create order in database
      const orderResult = await query<any>(
        `INSERT INTO orders (user_email, user_name, user_address, user_phone, total_amount, stripe_payment_id, status)
         VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
        [
          customerInfo.email,
          customerInfo.name,
          customerInfo.address,
          customerInfo.phone,
          totalAmount,
          paymentIntent.id,
        ]
      );

      const orderId = orderResult.insertId;

      // Insert order items
      for (const item of cart) {
        await query(
          `INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity)
           VALUES (?, ?, ?, ?, ?)`,
          [
            orderId,
            item.product.id,
            item.product.name,
            item.product.price,
            item.quantity,
          ]
        );

        // Update product stock
        await query(
          'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
          [item.quantity, item.product.id]
        );
      }

      return NextResponse.json({
        orderId,
        clientSecret: paymentIntent.client_secret,
      });
    } catch (dbError) {
      // Fallback to mock database
      const items = cart.map((item) => ({
        product_id: item.product.id,
        product_name: item.product.name,
        product_price: item.product.price,
        quantity: item.quantity,
      }));

      const orderId = mockDb.createOrder({
        user_email: customerInfo.email,
        user_name: customerInfo.name,
        user_address: customerInfo.address,
        user_phone: customerInfo.phone,
        total_amount: totalAmount,
        stripe_payment_id: paymentId,
        items,
      });

      return NextResponse.json({
        orderId,
        clientSecret: `${paymentId}_secret`,
      });
    }
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    try {
      // Try MySQL first
      const orders = await query(
        'SELECT * FROM orders WHERE user_email = ? ORDER BY created_at DESC',
        [email]
      );

      return NextResponse.json(orders);
    } catch (dbError) {
      // Fallback to mock database
      const orders = mockDb.getOrdersByEmail(email);
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
