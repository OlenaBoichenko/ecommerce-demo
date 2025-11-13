import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { mockDb } from '@/lib/mock-db';
import { Product } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    // Try MySQL first
    try {
      let sql = 'SELECT * FROM products WHERE 1=1';
      const params: any[] = [];

      if (category) {
        sql += ' AND category = ?';
        params.push(category);
      }

      if (featured === 'true') {
        sql += ' AND featured = TRUE';
      }

      if (search) {
        sql += ' AND (name LIKE ? OR description LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
      }

      if (minPrice) {
        sql += ' AND price >= ?';
        params.push(parseFloat(minPrice));
      }

      if (maxPrice) {
        sql += ' AND price <= ?';
        params.push(parseFloat(maxPrice));
      }

      sql += ' ORDER BY created_at DESC';

      const products = await query<Product[]>(sql, params);
      return NextResponse.json(products);
    } catch (dbError) {
      // Fallback to mock database
      const filters = {
        category: category || undefined,
        featured: featured === 'true',
        search: search || undefined,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      };

      const products = mockDb.getProducts(filters);
      return NextResponse.json(products);
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
