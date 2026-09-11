CREATE DATABASE IF NOT EXISTS cargoconnect;
USE cargoconnect;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  user_type VARCHAR(50) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS drivers (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  license_number VARCHAR(255) NOT NULL UNIQUE,
  availability VARCHAR(50) NOT NULL,
  rating DOUBLE DEFAULT 4.5,
  user_id BIGINT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS vehicles (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  vehicle_number VARCHAR(255) NOT NULL UNIQUE,
  vehicle_type VARCHAR(50) NOT NULL,
  model VARCHAR(255) NOT NULL,
  capacity DOUBLE NOT NULL,
  availability VARCHAR(50) NOT NULL,
  driver_id BIGINT,
  FOREIGN KEY (driver_id) REFERENCES drivers(id)
);

CREATE TABLE IF NOT EXISTS bookings (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  booking_number VARCHAR(255) NOT NULL UNIQUE,
  shipper_id BIGINT NOT NULL,
  driver_id BIGINT,
  vehicle_id BIGINT,
  pickup_address VARCHAR(255) NOT NULL,
  delivery_address VARCHAR(255) NOT NULL,
  sender_name VARCHAR(255) NOT NULL,
  sender_phone VARCHAR(20) NOT NULL,
  receiver_name VARCHAR(255) NOT NULL,
  receiver_phone VARCHAR(20) NOT NULL,
  package_type VARCHAR(50) NOT NULL,
  package_weight DOUBLE NOT NULL,
  package_description TEXT NOT NULL,
  booking_date DATE NOT NULL,
  pickup_date DATE NOT NULL,
  delivery_date DATE NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) NOT NULL,
  payment_status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (shipper_id) REFERENCES users(id),
  FOREIGN KEY (driver_id) REFERENCES drivers(id),
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
);

CREATE TABLE IF NOT EXISTS payments (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  booking_id BIGINT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  payment_status VARCHAR(50) NOT NULL,
  transaction_id VARCHAR(255) NOT NULL,
  payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id)
);

INSERT INTO users (name, email, password, user_type, phone) VALUES (
  'Admin User', 'admin@cargoconnect.com', '$2a$10$VhIvP1I5mTWwT9.GS4eN7e2c1ngT5dBjjWw0I8mJ2Wg9Y6Uj0q9EW', 'ADMIN', '9999999999'
) ON DUPLICATE KEY UPDATE email = email;
