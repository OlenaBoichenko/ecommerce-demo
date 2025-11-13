const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  console.log('🚀 Starting database setup...\n');

  try {
    // Create connection without database
    const connection = await mysql.createConnection({
      host: process.env.DATABASE_HOST || 'localhost',
      user: process.env.DATABASE_USER || 'root',
      password: process.env.DATABASE_PASSWORD || '',
      multipleStatements: true,
    });

    console.log('✅ Connected to MySQL server');

    // Read SQL file
    const sqlPath = path.join(__dirname, '..', 'lib', 'init-db.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Execute SQL
    await connection.query(sql);
    console.log('✅ Database schema created');
    console.log('✅ Sample data inserted');

    await connection.end();

    console.log('\n🎉 Database setup complete!');
    console.log('\nYou can now run: npm run dev');
  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Make sure MySQL is running');
    console.log('2. Check your database credentials in .env file');
    console.log('3. Ensure you have permission to create databases');
    process.exit(1);
  }
}

setupDatabase();
