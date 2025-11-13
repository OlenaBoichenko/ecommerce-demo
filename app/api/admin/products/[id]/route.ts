import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { mockDb } from '@/lib/mock-db';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, price, image_url, category, stock_quantity, featured } = body;

    // Build update query dynamically based on provided fields
    const updates: string[] = [];
    const values: any[] = [];

    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description);
    }
    if (price !== undefined) {
      updates.push('price = ?');
      values.push(price);
    }
    if (image_url !== undefined) {
      updates.push('image_url = ?');
      values.push(image_url);
    }
    if (category !== undefined) {
      updates.push('category = ?');
      values.push(category);
    }
    if (stock_quantity !== undefined) {
      updates.push('stock_quantity = ?');
      values.push(stock_quantity);
    }
    if (featured !== undefined) {
      updates.push('featured = ?');
      values.push(featured);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    try {
      // Try MySQL first
      values.push(id);

      await query(
        `UPDATE products SET ${updates.join(', ')} WHERE id = ?`,
        values
      );

      return NextResponse.json({ success: true });
    } catch (dbError) {
      // Fallback to mock database
      const success = mockDb.updateProduct(parseInt(id), body);

      if (!success) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    try {
      // Try MySQL first
      await query('DELETE FROM products WHERE id = ?', [id]);
      return NextResponse.json({ success: true });
    } catch (dbError) {
      // Fallback to mock database
      const success = mockDb.deleteProduct(parseInt(id));

      if (!success) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
