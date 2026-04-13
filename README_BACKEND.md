# Vamos Tennis Sportswear Store - Backend Integration

## 🎯 Quick Start Guide

### Prerequisites
✅ Supabase project connected  
✅ Database tables created  
✅ Initial data seeded  

---

## 📋 Setup Steps (5 Minutes)

### Step 1: Create Database Tables
Open Supabase Dashboard → SQL Editor and copy-paste the SQL from `DATABASE_SETUP.md` sections 1.1 through 1.4

### Step 2: Create Indexes & Enable RLS
Run the SQL commands from sections 2 and 3 of `DATABASE_SETUP.md`

### Step 3: Create RLS Policies
Run all policy creation commands from section 4 of `DATABASE_SETUP.md`

### Step 4: Create Triggers
Run trigger creation commands from section 5 of `DATABASE_SETUP.md`

### Step 5: Seed Database
In browser console, run:
```javascript
fetch(window.location.origin + '/api/seed', {
  method: 'POST'
}).then(r => r.json()).then(console.log);
```

### Step 6: Create Admin User
1. Sign up at `/signup`
2. In Supabase Dashboard → Table Editor → `user_profiles`
3. Change your user's `role` from 'customer' to 'admin'
4. Log out and log back in

---

## 🏗️ Architecture Overview

```
React App
    ↓
/src/app/services/api.ts (API Service Layer)
    ↓
/supabase/functions/server/ (Hono Server)
    ↓
Supabase (Auth + PostgreSQL)
```

---

## 🗄️ Database Tables

| Table | Purpose |
|-------|---------|
| `products` | Store product catalog |
| `user_profiles` | Extended user information & roles |
| `orders` | Customer orders |
| `order_items` | Individual items in each order |

---

## 🔐 Authentication

### Frontend Usage

```typescript
import { useAuth } from './context/AuthContext';

function MyComponent() {
  const { user, signIn, signUp, signOut, isAdmin } = useAuth();
  
  // Sign up
  await signUp('email@example.com', 'password', 'Full Name');
  
  // Sign in
  await signIn('email@example.com', 'password');
  
  // Sign out
  await signOut();
  
  // Check auth status
  if (user) {
    console.log('Logged in as:', user.email);
  }
  
  // Check admin
  if (isAdmin) {
    console.log('User is admin');
  }
}
```

---

## 🛍️ Products API

### Get All Products
```typescript
import { api } from './services/api';

const { products } = await api.products.getAll();
```

### Get Products by Category
```typescript
const { products } = await api.products.getByCategory('women');
// or
const { products } = await api.products.getByCategory('men');
```

### Admin: Create Product
```typescript
const newProduct = await api.products.create({
  name: 'Tennis Dress',
  price: 89.00,
  image: 'https://...',
  category: 'women',
  colors: ['#1a1a1a', '#ffffff'],
  sizes: ['XS', 'S', 'M', 'L', 'XL'],
  description: 'Premium tennis dress',
  inStock: true
});
```

### Admin: Update Product
```typescript
await api.products.update(productId, {
  price: 79.00,
  in_stock: false
});
```

### Admin: Delete Product
```typescript
await api.products.delete(productId);
```

---

## 📦 Orders API

### Create Order
```typescript
import { useCart } from './context/CartContext';

const { cart, cartTotal } = useCart();

const orderItems = cart.map(item => ({
  productId: item.id,
  name: item.name,
  image: item.image,
  selectedColor: item.selectedColor,
  selectedSize: item.selectedSize,
  quantity: item.quantity,
  price: item.price
}));

const order = await api.orders.create(
  orderItems, 
  cartTotal,
  { /* shipping address */ }
);
```

### Get User Orders
```typescript
const { orders } = await api.orders.getUserOrders();
```

### Get Order Details
```typescript
const { order } = await api.orders.getById(orderId);
// order.items contains all order items
```

---

## 🔑 Key Files

### Backend (Server)
| File | Purpose |
|------|---------|
| `supabase/functions/server/index.tsx` | Main server & route definitions |
| `supabase/functions/server/auth-controller.tsx` | Authentication logic |
| `supabase/functions/server/products-controller.tsx` | Product CRUD operations |
| `supabase/functions/server/orders-controller.tsx` | Order management |
| `supabase/functions/server/database.tsx` | Database client & schema docs |
| `supabase/functions/server/seed-data.tsx` | Initial data seeding |

### Frontend (Client)
| File | Purpose |
|------|---------|
| `src/app/services/api.ts` | API service layer |
| `src/app/context/AuthContext.tsx` | Authentication state |
| `src/app/context/CartContext.tsx` | Shopping cart state |
| `src/app/pages/LoginPage.tsx` | Login UI |
| `src/app/pages/SignUpPage.tsx` | Registration UI |
| `src/app/pages/AdminDashboard.tsx` | Admin product management |
| `src/app/pages/ProductListingPage.tsx` | Product listing (API-powered) |

---

## 🛣️ API Routes

### Base URL
```
https://{projectId}.supabase.co/functions/v1/make-server-5eb44c6f
```

### Authentication
- `POST /auth/signup` - Register
- `GET /auth/profile` - Get user profile
- `PUT /auth/profile` - Update profile
- `GET /auth/verify-admin` - Check admin status

### Products
- `GET /products` - All products
- `GET /products/category/:category` - By category
- `GET /products/:id` - Single product
- `POST /products` - Create (admin)
- `PUT /products/:id` - Update (admin)
- `DELETE /products/:id` - Delete (admin)

### Orders
- `POST /orders` - Create order
- `GET /orders` - User's orders
- `GET /orders/:id` - Order details
- `PUT /orders/:id/status` - Update status (admin)
- `GET /admin/orders` - All orders (admin)

### Utility
- `POST /seed` - Seed database with initial data
- `GET /health` - Health check

---

## 👤 User Roles

### Customer (Default)
- Browse products
- Add to cart
- Create orders
- View own orders
- Update own profile

### Admin
- All customer permissions
- Access admin dashboard at `/admin`
- Create/Edit/Delete products
- View all orders
- Update order status

---

## 🎨 Frontend Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | HomePage | Campaign-style landing page |
| `/women` | ProductListingPage | Women's products (from API) |
| `/men` | ProductListingPage | Men's products (from API) |
| `/login` | LoginPage | User authentication |
| `/signup` | SignUpPage | User registration |
| `/admin` | AdminDashboard | Product management (admin only) |

---

## 🔒 Security Features

✅ **Row Level Security (RLS)** - Database-level access control  
✅ **JWT Authentication** - Secure token-based auth  
✅ **Role-Based Access** - Customer vs Admin permissions  
✅ **Protected Routes** - Frontend route guards  
✅ **Admin Verification** - Backend admin checks  
✅ **Session Management** - Automatic token refresh  

---

## 🐛 Troubleshooting

### Products Not Loading
```
1. Check Supabase Dashboard → Table Editor → products
2. Verify data exists
3. Check browser console for errors
4. Ensure RLS policy allows SELECT for everyone
```

### Can't Login
```
1. Verify email/password are correct
2. Check Supabase Dashboard → Authentication → Users
3. Ensure user exists
4. Check browser console for errors
```

### Admin Dashboard Shows "Access Denied"
```
1. Go to Supabase Dashboard → Table Editor → user_profiles
2. Find your user
3. Change 'role' from 'customer' to 'admin'
4. Log out and log back in
```

### API Errors
```
1. Check browser Network tab
2. Look for failed requests
3. Check response error message
4. Verify authentication token is being sent
```

---

## 📊 Testing the Backend

### 1. Test Authentication
```
✓ Sign up new user at /signup
✓ Login at /login
✓ Verify user menu shows email
✓ Logout and verify redirect
```

### 2. Test Products
```
✓ Visit /women - should show products
✓ Visit /men - should show products
✓ Click product - should open quick-add modal
✓ Select color, size, quantity
✓ Add to cart - should show toast notification
```

### 3. Test Admin (requires admin user)
```
��� Login as admin
✓ Visit /admin
✓ Create new product
✓ Edit existing product
✓ Delete product
✓ Verify changes reflect on product pages
```

---

## 📝 API Request Examples

### Sign Up
```javascript
const response = await fetch('/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'password123',
    fullName: 'Test User'
  })
});
```

### Get Products
```javascript
const response = await fetch('/api/products');
const { products } = await response.json();
```

### Create Order (requires auth)
```javascript
const session = await supabase.auth.getSession();

const response = await fetch('/api/orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session.data.session.access_token}`
  },
  body: JSON.stringify({
    items: [...],
    totalAmount: 178.00
  })
});
```

---

## 🚀 Next Steps

### Immediate
- [x] Set up database tables
- [x] Seed initial products
- [x] Create admin user
- [x] Test authentication
- [x] Test product listing
- [ ] Test order creation

### Future Enhancements
- [ ] Payment integration (Stripe/PayPal)
- [ ] Email notifications
- [ ] Order tracking
- [ ] Product reviews
- [ ] Wishlist feature
- [ ] Inventory management
- [ ] Sales analytics
- [ ] Discount codes

---

## 📚 Documentation

- **Database Setup:** See `DATABASE_SETUP.md`
- **Architecture:** See `BACKEND_ARCHITECTURE.md`
- **This Guide:** `README_BACKEND.md`

---

## 💡 Key Concepts

### MVC Pattern
- **Models:** Database tables (products, orders, etc.)
- **Views:** React components
- **Controllers:** Server controllers (auth, products, orders)

### API Service Layer
Central location for all API calls - maintains consistency and makes updates easy

### Context API
React's built-in state management for auth and cart across the app

### Row Level Security
Database-level security that automatically filters data based on user

---

## ✅ What's Implemented

✅ Complete database schema with relationships  
✅ User authentication (signup, login, logout)  
✅ Product management (CRUD operations)  
✅ Category-based product filtering  
✅ Order creation and management  
✅ Admin dashboard  
✅ Role-based access control  
✅ Row level security policies  
✅ API service layer  
✅ Toast notifications  
✅ Loading states  
✅ Error handling  

---

## 🎯 Quick Commands

```bash
# Check server health
curl https://{projectId}.supabase.co/functions/v1/make-server-5eb44c6f/health

# Seed database
curl -X POST https://{projectId}.supabase.co/functions/v1/make-server-5eb44c6f/seed

# Test authentication
# (Use browser or Postman for this)
```

---

## 🏁 You're All Set!

Your tennis sportswear e-commerce store is now a fully functional web application with:

- ✅ Real authentication system
- ✅ Database-backed product catalog
- ✅ Order management
- ✅ Admin capabilities
- ✅ Professional architecture

**Ready to sell some tennis gear! 🎾**
