import mysql from 'mysql2/promise';

let pool: mysql.Pool | null = null;

export async function getConnection() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DATABASE_HOST || 'localhost',
      user: process.env.DATABASE_USER || 'root',
      password: process.env.DATABASE_PASSWORD || '',
      database: process.env.DATABASE_NAME || 'ecommerce_demo',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }

  return pool;
}

export async function query<T = any>(sql: string, params?: any[]): Promise<T> {
  const connection = await getConnection();
  const [results] = await connection.execute(sql, params);
  return results as T;
}
