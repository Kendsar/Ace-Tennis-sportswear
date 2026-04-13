# Vamos Tennis Sportswear Store - Database Setup Guide

## Overview
This guide will help you set up the complete backend for the Vamos Tennis Sportswear e-commerce store using Supabase.

## Prerequisites
- Supabase project connected to Figma Make
- Access to Supabase Dashboard (https://supabase.com/dashboard)

---

## Step 1: Create Database Tables

Go to your Supabase Dashboard → SQL Editor and run the following SQL commands:

### 1.1 Products Table
```sql
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('women', 'men')),
  colors TEXT[] NOT NULL DEFAULT '{}',
  sizes TEXT[] NOT NULL DEFAULT '{}',
  description TEXT,
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 1.2 User Profiles Table
```sql
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 1.3 Orders Table
```sql
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  shipping_address JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 1.4 Order Items Table
```sql
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_image TEXT,
  selected_color TEXT NOT NULL,
  selected_size TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## Step 2: Create Indexes

```sql
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
```

---

## Step 3: Enable Row Level Security (RLS)

```sql
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
```

---

## Step 4: Create RLS Policies

### 4.1 Products Policies
```sql
-- Everyone can view products
CREATE POLICY "Products are viewable by everyone" 
  ON products FOR SELECT 
  USING (true);

-- Only admins can insert products
CREATE POLICY "Products are insertable by admins" 
  ON products FOR INSERT 
  WITH CHECK (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Only admins can update products
CREATE POLICY "Products are updatable by admins" 
  ON products FOR UPDATE 
  USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Only admins can delete products
CREATE POLICY "Products are deletable by admins" 
  ON products FOR DELETE 
  USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );
```

### 4.2 User Profiles Policies
```sql
-- Users can view their own profile
CREATE POLICY "Users can view own profile" 
  ON user_profiles FOR SELECT 
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" 
  ON user_profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Automatically insert profile on signup
CREATE POLICY "Users can insert own profile" 
  ON user_profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);
```

### 4.3 Orders Policies
```sql
-- Users can view their own orders
CREATE POLICY "Users can view own orders" 
  ON orders FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can create their own orders
CREATE POLICY "Users can create own orders" 
  ON orders FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
```

### 4.4 Order Items Policies
```sql
-- Users can view items from their own orders
CREATE POLICY "Users can view own order items" 
  ON order_items FOR SELECT 
  USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );

-- Users can insert items for their own orders
CREATE POLICY "Users can insert own order items" 
  ON order_items FOR INSERT 
  WITH CHECK (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_id AND orders.user_id = auth.uid())
  );
```

---

## Step 5: Create Triggers

```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for products table
CREATE TRIGGER update_products_updated_at 
  BEFORE UPDATE ON products
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for user_profiles table
CREATE TRIGGER update_user_profiles_updated_at 
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for orders table
CREATE TRIGGER update_orders_updated_at 
  BEFORE UPDATE ON orders
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
```

---

## Step 6: Seed Initial Data

After creating all tables, seed the database with initial products by making a POST request:

**Endpoint:** `POST /make-server-5eb44c6f/seed`

You can use the browser console:
```javascript
fetch('https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-5eb44c6f/seed', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_ANON_KEY'
  }
})
.then(res => res.json())
.then(data => console.log(data));
```

---

## Step 7: Create Admin User (Optional)

To create an admin user, first sign up normally through the app, then manually update their role in Supabase:

1. Sign up through the app at `/signup`
2. Go to Supabase Dashboard → Table Editor → user_profiles
3. Find your user and update `role` from 'customer' to 'admin'

---

## API Endpoints Reference

### Authentication
- `POST /auth/signup` - Register new user
- `POST /auth/signin` - Sign in user (use Supabase client on frontend)
- `GET /auth/profile` - Get user profile
- `PUT /auth/profile` - Update user profile
- `GET /auth/verify-admin` - Check if user is admin

### Products
- `GET /products` - Get all products
- `GET /products/category/:category` - Get products by category (women/men)
- `GET /products/:id` - Get single product
- `POST /products` - Create product (Admin only)
- `PUT /products/:id` - Update product (Admin only)
- `DELETE /products/:id` - Delete product (Admin only)

### Orders
- `POST /orders` - Create new order
- `GET /orders` - Get user's orders
- `GET /orders/:id` - Get order details
- `PUT /orders/:id/status` - Update order status (Admin only)
- `GET /admin/orders` - Get all orders (Admin only)

---

## Features Implemented

✅ User Authentication (Sign up / Login / Logout)
✅ Product Management (CRUD operations)
✅ Category-based Product Listing
✅ Order System
✅ Admin Dashboard
✅ Role-based Access Control
✅ Row Level Security
✅ API Service Layer

---

## Architecture Overview

```
Frontend (React)
    ↓
API Service Layer (/src/app/services/api.ts)
    ↓
Hono Web Server (/supabase/functions/server/)
    ↓
Supabase (Auth + PostgreSQL Database)
```

---

## Troubleshooting

### Issue: "Failed to fetch products"
- Ensure all tables are created in Supabase
- Check RLS policies are enabled
- Verify the seed data was inserted

### Issue: "Unauthorized" errors
- Make sure user is logged in
- Check session is active
- Verify authentication headers are being sent

### Issue: Admin dashboard access denied
- Ensure user role is set to 'admin' in user_profiles table
- Log out and log back in after role change

---

## Next Steps

1. ✅ Complete database setup following this guide
2. ✅ Seed initial products
3. ✅ Create admin user
4. ✅ Test authentication flow
5. ✅ Test product listing
6. ✅ Test order creation
7. ✅ Configure payment integration (future enhancement)
8. ✅ Add email notifications (future enhancement)

---

## Notes

- This is a prototype setup suitable for development and testing
- For production, implement additional security measures
- Consider adding payment gateway integration (Stripe, PayPal, etc.)
- Add proper email server configuration for user verification
- Implement proper error tracking and monitoring
