# Vamos Tennis Sportswear Store - API Implementation Guide

## Overview
The backend has been fully refactored to use **Supabase client directly** instead of external API layers. This provides:
- Direct database access with RLS security
- Simplified architecture
- Better performance
- Automatic authentication handling

---

## Architecture

### Service Layer (`src/app/services/api.ts`)

All API calls go through organized modules:

1. **authAPI** - Authentication & user profiles
2. **productsAPI** - Product management
3. **ordersAPI** - Order management
4. **seed-products** - Edge Function for database initialization

No Express/Hono API layer. All queries use Supabase client directly.

---

## Working Examples

### 1. Load All Products (Public - No Auth Required)

```typescript
import { productsAPI } from '../services/api';

// In a React component
const { products } = await productsAPI.getAll();
// Returns: { success: true, products: Product[] }
```

**How it works:**
```sql
SELECT * FROM products ORDER BY created_at DESC
```

---

### 2. Filter Products by Category

```typescript
// Load women's products
const { products } = await productsAPI.getByCategory('women');

// Load men's products
const { products } = await productsAPI.getByCategory('men');
// Returns: { success: true, products: Product[], category: string }
```

**How it works:**
```sql
SELECT * FROM products
WHERE category = 'women'
ORDER BY created_at DESC
```

---

### 3. User Registration

```typescript
import { authAPI } from '../services/api';

const result = await authAPI.signUp('user@example.com', 'password123', 'John Doe');

// Automatically creates:
// 1. Auth user in auth.users
// 2. User profile in user_profiles table (role: 'customer')
```

**Creates in database:**
```sql
-- user_profiles table
INSERT INTO user_profiles (id, email, full_name, role)
VALUES ('uuid', 'user@example.com', 'John Doe', 'customer')
```

---

### 4. User Login

```typescript
const { success, session, user } = await authAPI.signIn(
  'user@example.com',
  'password123'
);
```

---

### 5. Create Order (Requires Login)

```typescript
import { ordersAPI, OrderItem } from '../services/api';

const items: OrderItem[] = [
  {
    productId: '123',
    name: 'Vamos Tennis DRESS',
    image: 'url',
    selectedColor: '#ffffff',
    selectedSize: 'M',
    quantity: 1,
    price: 89.00,
  },
];

const result = await ordersAPI.create(
  items,
  89.00, // total
  {
    fullName: 'John Doe',
    street: '123 Main St',
    city: 'NYC',
    state: 'NY',
    zipCode: '10001',
    country: 'USA',
    phone: '555-1234',
  }
);
// Returns: { success: true, order: { id, totalAmount, status, createdAt } }
```

**What happens:**
1. Gets current user (auth.getUser())
2. Creates order in `orders` table with `user_id`
3. Creates items in `order_items` table
4. RLS ensures user can only see their own orders

```sql
-- orders table
INSERT INTO orders (user_id, total_amount, status, shipping_address)
VALUES ('current_user_id', 89.00, 'pending', {...})

-- order_items table
INSERT INTO order_items (order_id, product_id, ...) VALUES (...)
```

---

### 6. Get User's Orders (Requires Login)

```typescript
const { orders } = await ordersAPI.getUserOrders();
// Returns all orders for logged-in user only (RLS enforced)
```

**RLS Policy:**
```sql
-- Users can only see their own orders
SELECT * FROM orders WHERE user_id = auth.uid()
```

---

### 7. Get Single Order with Items

```typescript
const { order } = await ordersAPI.getById('order-id');
// Returns: { success: true, order: { ...order, items: OrderItem[] } }
```

---

### 8. Admin: Insert Products

```typescript
import { productsAPI } from '../services/api';

const newProduct = {
  name: 'NEW PRODUCT',
  price: 99.99,
  image: 'https://...',
  category: 'women',
  colors: ['#ffffff', '#000000'],
  sizes: ['XS', 'S', 'M', 'L', 'XL'],
  description: 'Amazing product',
  in_stock: true,
};

const { product } = await productsAPI.create(newProduct);
```

**RLS Protection:**
Only users with `role = 'admin'` can insert products. Non-admin requests fail silently with RLS.

---

### 9. Admin: Update Product

```typescript
const updated = await productsAPI.update('product-id', {
  price: 79.99,
  in_stock: false,
});
```

---

### 10. Admin: Delete Product

```typescript
await productsAPI.delete('product-id');
```

---

### 11. Verify Admin Status

```typescript
const { isAdmin } = await authAPI.verifyAdmin();

if (isAdmin) {
  // Show admin panel
}
```

**Checks:**
```sql
SELECT role FROM user_profiles WHERE id = auth.uid()
-- Only returns data if user is authenticated (RLS)
```

---

### 12. Seed Database with Initial Products

Call the Edge Function to populate initial products:

```typescript
// Frontend can call this
const response = await fetch(
  `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/seed-products`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
  }
);

const result = await response.json();
// { success: true, message: 'Database seeded with X products', count: X }
```

**What it does:**
1. Checks if products already exist
2. If empty, inserts 12 sample products (6 women's, 6 men's)
3. Uses service role key (secure on Edge Function)

---

## RLS Security

### Products Table (Public Read)

```sql
-- Anyone can read
CREATE POLICY "Products are publicly readable"
  ON products FOR SELECT TO public
  USING (true);

-- Only admins can insert/update/delete
CREATE POLICY "Only admins can manage products"
  ON products FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### Orders Table (Authenticated Only)

```sql
-- Users see only their orders
CREATE POLICY "Users see own orders"
  ON orders FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Only authenticated users can create
CREATE POLICY "Users can create orders"
  ON orders FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
```

### User Profiles Table

```sql
-- Users see their own profile
CREATE POLICY "Users see own profile"
  ON user_profiles FOR SELECT TO authenticated
  USING (id = auth.uid());

-- Only on signup
CREATE POLICY "New user profile creation"
  ON user_profiles FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());
```

---

## Error Handling Examples

### Product Not Found
```typescript
const { product } = await productsAPI.getById('invalid-id');
// product will be null due to maybeSingle()
// No error thrown - graceful handling
```

### Unauthorized Admin Action
```typescript
// Non-admin user tries to create product
const { product } = await productsAPI.create(productData);
// RLS policy silently blocks the insert
// Supabase returns error which is caught and logged
```

### Order Without Login
```typescript
const result = await ordersAPI.create(items, total);
// Throws: "You must be logged in to create an order"
```

---

## Environment Variables Required

All in `.env` file (auto-populated by Supabase):

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## Component Integration Examples

### ProductListingPage
```typescript
// Loads products on mount
const { products } = await productsAPI.getByCategory('women');
setProducts(products);
```

### CheckoutModal
```typescript
// Creates order after user confirms
const { order } = await ordersAPI.create(items, total, shipping);
toast.success('Order placed!');
```

### AdminDashboard
```typescript
// Only accessible if authAPI.verifyAdmin() returns isAdmin: true
// Uses productsAPI.getAll(), create(), update(), delete()
```

### AuthContext
```typescript
// Manages authentication state
// Calls authAPI.signUp(), signIn(), signOut()
// Tracks: user, session, isAdmin
```

---

## Testing Workflow

### 1. Seed Database
```bash
curl -X POST \
  https://your-project.supabase.co/functions/v1/seed-products \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "Content-Type: application/json"
```

### 2. Sign Up Test User
- Go to app, click "Sign Up"
- Email: test@example.com, Password: test123
- User profile created automatically with role='customer'

### 3. Make Admin
- In Supabase dashboard, manually update user_profiles
- Set role='admin' for test user

### 4. Test Product Management
- Login as admin user
- Visit /admin dashboard
- Create, update, delete products

### 5. Test Orders
- Login as customer
- Browse products
- Add to cart
- Checkout (creates order with current user_id)

---

## Migration from Old API

**Before:** `apiRequest('/products', { method: 'GET' })`

**After:** `productsAPI.getAll()`

**Changes:**
- No HTTP requests for product/order operations
- Direct Supabase client calls
- Automatic authentication handling
- RLS security built-in
- No need for Bearer tokens in components

---

## Key Design Decisions

1. **No Express/Hono Layer** - Unnecessary middleware removed
2. **Direct Supabase Queries** - Better performance, less latency
3. **Single Edge Function** - Only seed-products for initialization
4. **RLS Enforcement** - Security at database level, not application
5. **maybeSingle()** - Returns null instead of throwing for missing records
6. **Automatic User Profiles** - Created on signup, role assigned in RLS
7. **Order Transactionality** - Items created with order, rollback on failure

---

## Troubleshooting

### Products not loading
- Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set
- Verify RLS policies allow public SELECT on products table
- Check browser console for specific error messages

### Can't create order
- Ensure user is logged in (authAPI.signIn first)
- Verify RLS policy allows authenticated users to INSERT orders
- Check user_id is correctly set

### Admin features not working
- Verify user role = 'admin' in user_profiles table
- Check RLS policy for admin-only operations
- Test with authAPI.verifyAdmin() first

### Seed function fails
- Verify SUPABASE_SERVICE_ROLE_KEY is in Edge Function environment
- Check products table RLS policy allows service role inserts
- See function logs in Supabase dashboard

---

## API Reference

See `/src/app/services/api.ts` for complete TypeScript interfaces and method signatures.

All methods include error handling with console logs and throw exceptions that should be caught at component level with try/catch + toast notifications.
