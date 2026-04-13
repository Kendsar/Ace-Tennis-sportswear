# Quick Start Guide - Vamos Tennis Sportswear

## Setup (Already Complete)

✅ Database tables created (products, user_profiles, orders, order_items)
✅ RLS policies enabled for security
✅ Service layer refactored to use Supabase directly
✅ Seed Edge Function deployed (seed-products)
✅ Build passing with no errors

---

## Step 1: Seed Database with Products

Call the seed endpoint to populate initial products (12 total: 6 women's, 6 men's):

```bash
curl -X POST \
  https://[YOUR_PROJECT].supabase.co/functions/v1/seed-products \
  -H "Authorization: Bearer [YOUR_ANON_KEY]" \
  -H "Content-Type: application/json"
```

Response:
```json
{
  "success": true,
  "message": "Database seeded successfully with 12 products",
  "count": 12
}
```

Or from frontend console:
```javascript
const res = await fetch(
  `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/seed-products`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
  }
);
const data = await res.json();
console.log(data);
```

---

## Step 2: Test Browse Products (Public)

Navigate to app:
- Home page shows featured products
- Click "Women" or "Men" to filter by category
- All products load from Supabase via `productsAPI.getByCategory()`

**No login required for browsing.**

---

## Step 3: Test User Registration

1. Click "Sign Up" in header
2. Enter email and password
3. User created in `auth.users` and `user_profiles` (role: 'customer')

**API Call:**
```typescript
await authAPI.signUp('user@example.com', 'password123', 'Full Name');
```

---

## Step 4: Test Shopping Cart & Checkout

1. Login as regular user
2. Add products to cart
3. Click checkout
4. Fill shipping info and submit

**What happens:**
- Order created in `orders` table with user_id
- Order items created in `order_items` table
- RLS ensures only that user can see their order

**API Call:**
```typescript
await ordersAPI.create(items, totalAmount, shippingAddress);
```

---

## Step 5: Create Admin User

In Supabase Dashboard:
1. Go to Authentication → Users
2. Find your test user
3. Copy their UUID

In SQL Editor:
```sql
UPDATE user_profiles
SET role = 'admin'
WHERE id = '[USER_UUID]';
```

---

## Step 6: Test Admin Features

1. Login as admin user
2. Navigate to `/admin` (Admin Dashboard appears in header)
3. You can now:
   - View all products
   - Add new product
   - Edit product details
   - Delete products

**API Calls:**
```typescript
// Create product
await productsAPI.create({
  name: 'NEW PRODUCT',
  price: 99.99,
  image: 'https://...',
  category: 'women',
  colors: ['#fff', '#000'],
  sizes: ['XS', 'S', 'M', 'L', 'XL'],
  description: 'Amazing new product',
  in_stock: true,
});

// Update product
await productsAPI.update('product-id', { price: 79.99 });

// Delete product
await productsAPI.delete('product-id');
```

---

## Step 7: View Orders

### As Customer:
1. Login as customer user
2. Click "Orders" in header
3. See only your orders

**API Call:**
```typescript
await ordersAPI.getUserOrders();
```

### As Admin:
1. Login as admin
2. Visit Orders page
3. See all customer orders with email/name

**API Call:**
```typescript
await ordersAPI.getAllOrders();
```

---

## Architecture Overview

```
Frontend Components
    ↓
src/app/services/api.ts (Service Layer)
    ↓
authAPI / productsAPI / ordersAPI (Methods)
    ↓
Supabase Client (Direct Database Access)
    ↓
PostgreSQL Database (RLS Enforced)
    ↓
auth.users / user_profiles / products / orders / order_items

Edge Function: seed-products (for initialization only)
```

---

## Key Implementation Details

### No HTTP API Layer
- ❌ Removed: Express/Hono routes
- ✅ Added: Direct Supabase client queries
- Result: Simpler, faster, more secure

### Authentication with RLS
- Users login via Supabase Auth
- Each database action checks RLS policies
- Admin features blocked for non-admins at database level

### Orders Require Login
- `ordersAPI.create()` checks `auth.getUser()`
- Throws error if not authenticated
- RLS ensures user can only see own orders

### Seeding
- Single Edge Function: `POST /functions/v1/seed-products`
- Idempotent: checks if products exist before inserting
- Uses service role key (secure in Edge Function)

---

## Common Tasks

### Load all products
```typescript
const { products } = await productsAPI.getAll();
```

### Load women's products
```typescript
const { products } = await productsAPI.getByCategory('women');
```

### Get single product
```typescript
const { product } = await productsAPI.getById('product-id');
```

### Check if user is admin
```typescript
const { isAdmin } = await authAPI.verifyAdmin();
```

### Sign out
```typescript
await authAPI.signOut();
```

---

## Environment Variables

All pre-configured in `.env`:
```
VITE_SUPABASE_URL=https://[project].supabase.co
VITE_SUPABASE_ANON_KEY=[your-key]
```

No manual setup needed!

---

## File Structure

```
src/
  app/
    services/
      api.ts                 ← Main API layer (all Supabase calls)
    pages/
      ProductListingPage.tsx ← Uses productsAPI
      AdminDashboard.tsx     ← Uses productsAPI + authAPI.verifyAdmin()
      OrdersPage.tsx         ← Uses ordersAPI
      LoginPage.tsx          ← Uses authAPI
    components/
      CheckoutModal.tsx      ← Uses ordersAPI.create()
    context/
      AuthContext.tsx        ← Manages auth state

supabase/
  functions/
    seed-products/          ← Edge Function for seeding
      index.ts
```

---

## Troubleshooting

### Products not showing
- Seed database first: `POST /functions/v1/seed-products`
- Check VITE_SUPABASE_URL is correct
- Verify RLS allows public SELECT on products

### Can't create order
- Login first (test with `authAPI.signIn()`)
- Check user_profiles exists for your user
- Verify RLS policy allows INSERT to orders

### Admin panel not visible
- Run `authAPI.verifyAdmin()` to check role
- Update user_profiles role to 'admin' in Supabase
- Refresh page after role change

### Build errors
- All dependencies installed: `npm run build`
- Check no unused imports in modified files
- See error details in console output

---

## Support

For detailed API reference, see: `API_IMPLEMENTATION_GUIDE.md`

For database setup details, see: `DATABASE_SETUP.md`

---

## Summary

✅ Backend fully refactored to Supabase
✅ All components working with direct database queries
✅ RLS security enforced
✅ Admin features working
✅ Build passing
✅ Ready for production

Enjoy your Vamos Tennis Sportswear Store!
