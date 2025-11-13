-- Create database
CREATE DATABASE IF NOT EXISTS ecommerce_demo;
USE ecommerce_demo;

-- Users table (for admin)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url VARCHAR(500),
  category VARCHAR(100),
  stock_quantity INT DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  user_address TEXT NOT NULL,
  user_phone VARCHAR(50),
  total_amount DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  stripe_payment_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  product_price DECIMAL(10, 2) NOT NULL,
  quantity INT NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Insert sample admin user (password: admin123)
INSERT INTO users (email, password_hash, is_admin)
VALUES ('admin@demo.com', '$2a$10$rGkVz9ZRJ5RY7pJYVdKAa.QqYqJb7XJ2b0xQYZYzVb9VX5QYZYzVb', TRUE)
ON DUPLICATE KEY UPDATE email=email;

-- Insert sample products
INSERT INTO products (name, description, price, image_url, category, stock_quantity, featured) VALUES
('Wireless Headphones', 'Premium wireless headphones with noise cancellation and 30-hour battery life', 199.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', 'Electronics', 50, TRUE),
('Smart Watch', 'Fitness tracking smartwatch with heart rate monitor and GPS', 299.99, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', 'Electronics', 35, TRUE),
('Running Shoes', 'Professional running shoes with advanced cushioning technology', 129.99, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', 'Fashion', 100, FALSE),
('Backpack', 'Durable travel backpack with laptop compartment', 79.99, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', 'Fashion', 75, FALSE),
('Coffee Maker', 'Automatic coffee maker with programmable timer', 89.99, 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500', 'Home', 40, FALSE),
('Desk Lamp', 'LED desk lamp with adjustable brightness and color temperature', 49.99, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500', 'Home', 60, FALSE),
('Yoga Mat', 'Non-slip yoga mat with carrying strap', 34.99, 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500', 'Sports', 120, TRUE),
('Water Bottle', 'Insulated stainless steel water bottle, 32oz', 24.99, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500', 'Sports', 200, FALSE),
('Bluetooth Speaker', 'Portable waterproof Bluetooth speaker', 69.99, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500', 'Electronics', 80, TRUE),
('Sunglasses', 'Polarized UV protection sunglasses', 59.99, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500', 'Fashion', 90, FALSE),
('Plant Pot', 'Ceramic plant pot with drainage hole', 19.99, 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500', 'Home', 150, FALSE),
('Dumbbell Set', 'Adjustable dumbbell set, 5-25 lbs', 149.99, 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500', 'Sports', 45, FALSE)
ON DUPLICATE KEY UPDATE name=name;
