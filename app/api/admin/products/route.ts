import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { mockDb } from '@/lib/mock-db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, price, image_url, category, stock_quantity, featured } = body;

    // Validation
    if (!name || !price || !category) {
      return NextResponse.json(
        { error: 'Name, price, and category are required' },
        { status: 400 }
      );
    }

    try {
      // Try MySQL first
      const result = await query(
        `INSERT INTO products (name, description, price, image_url, category, stock_quantity, featured)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [name, description || '', price, image_url || '', category, stock_quantity || 0, featured || false]
      );

      return NextResponse.json({ success: true, id: (result as any).insertId });
    } catch (dbError) {
      // Fallback to mock database
      const id = mockDb.addProduct({
        name,
        description: description || '',
        price,
        image_url: image_url || '',
        category,
        stock_quantity: stock_quantity || 0,
        featured: featured || false,
      });

      return NextResponse.json({ success: true, id });
    }
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
