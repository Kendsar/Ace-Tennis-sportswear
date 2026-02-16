# Backend Architecture Documentation

## Project Structure

```
ace-tennis-sportswear/
├── src/
│   └── app/
│       ├── services/
│       │   └── api.ts                    # Frontend API service layer
│       ├── context/
│       │   ├── AuthContext.tsx           # Authentication state management
│       │   └── CartContext.tsx           # Shopping cart state management
│       ├── pages/
│       │   ├── LoginPage.tsx             # User login page
│       │   ├── SignUpPage.tsx            # User registration page
│       │   ├── AdminDashboard.tsx        # Admin product management
│       │   ├── ProductListingPage.tsx    # Product listing (uses API)
│       │   ├── HomePage.tsx              # Landing page
│       │   └── RootLayout.tsx            # Main layout wrapper
│       └── components/
│           ├── Header.tsx                # Navigation with auth status
│           ├── ProductCard.tsx           # Product display component
│           └── ProductQuickAdd.tsx       # Quick add to cart modal
│
├── supabase/
│   └── functions/
│       └── server/
│           ├── index.tsx                 # Main server entry point (Hono)
│           ├── database.tsx              # Database client & schema docs
│           ├── auth-controller.tsx       # Authentication endpoints
│           ├── products-controller.tsx   # Product CRUD endpoints
│           ├── orders-controller.tsx     # Order management endpoints
│           ├── seed-data.tsx             # Database seeding script
│           └── kv_store.tsx              # Key-value store utility (protected)
│
├── DATABASE_SETUP.md                     # Database setup instructions
└── BACKEND_ARCHITECTURE.md               # This file
```

---

## Technology Stack

### Frontend
- **React 18** - UI library
- **React Router 7** - Client-side routing
- **Tailwind CSS v4** - Styling
- **Supabase Client** - Authentication & database queries
- **Sonner** - Toast notifications
- **Lucide React** - Icons

### Backend
- **Supabase** - Backend as a Service
  - **PostgreSQL** - Relational database
  - **Supabase Auth** - User authentication
  - **Row Level Security** - Data access control
- **Hono** - Web framework (running on Deno)
- **Deno** - Runtime environment

---

## API Architecture

### Three-Tier Architecture

```
┌─────────────────────────────────────┐
│         Frontend (React)            │
│  - Components                       │
│  - State Management (Context API)   │
│  - API Service Layer                │
└─────────────┬───────────────────────┘
              │
              ↓ HTTP/REST
┌─────────────────────────────────────┐
│    Server (Hono on Deno)            │
│  - Route Handlers                   │
│  - Controllers                      │
│  - Business Logic                   │
│  - Authentication Middleware        │
└─────────────┬───────────────────────┘
              │
              ↓ Supabase Client
┌─────────────────────────────────────┐
│    Database (Supabase/PostgreSQL)   │
│  - Tables & Relationships           │
│  - Row Level Security Policies      │
│  - Triggers & Functions             │
└─────────────────────────────────────┘
```

---

## Database Schema

### Tables

#### 1. `products`
```sql
- id (UUID, PK)
- name (TEXT)
- price (DECIMAL)
- image (TEXT)
- category (TEXT) - 'women' | 'men'
- colors (TEXT[])
- sizes (TEXT[])
- description (TEXT)
- in_stock (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### 2. `user_profiles`
```sql
- id (UUID, PK, FK → auth.users)
- email (TEXT)
- full_name (TEXT)
- role (TEXT) - 'customer' | 'admin'
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### 3. `orders`
```sql
- id (UUID, PK)
- user_id (UUID, FK → auth.users)
- total_amount (DECIMAL)
- status (TEXT) - 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
- shipping_address (JSONB)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### 4. `order_items`
```sql
- id (UUID, PK)
- order_id (UUID, FK → orders)
- product_id (UUID, FK → products)
- product_name (TEXT)
- product_image (TEXT)
- selected_color (TEXT)
- selected_size (TEXT)
- quantity (INTEGER)
- price (DECIMAL)
- created_at (TIMESTAMP)
```

### Relationships
```
auth.users (1) ──→ (1) user_profiles
auth.users (1) ──→ (N) orders
orders (1) ──→ (N) order_items
products (1) ──→ (N) order_items
```

---

## API Endpoints

### Base URL
```
https://{projectId}.supabase.co/functions/v1/make-server-5eb44c6f
```

### Authentication Endpoints

#### POST `/auth/signup`
**Description:** Register a new user
**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe" // optional
}
```
**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "John Doe"
  }
}
```

#### GET `/auth/profile`
**Description:** Get current user profile
**Headers:** `Authorization: Bearer {access_token}`
**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "John Doe",
    "role": "customer"
  }
}
```

#### GET `/auth/verify-admin`
**Description:** Check if current user is admin
**Headers:** `Authorization: Bearer {access_token}`
**Response:**
```json
{
  "success": true,
  "isAdmin": true
}
```

---

### Products Endpoints

#### GET `/products`
**Description:** Get all products
**Response:**
```json
{
  "success": true,
  "products": [...]
}
```

#### GET `/products/category/:category`
**Description:** Get products by category
**Parameters:** `category` - 'women' | 'men'
**Response:**
```json
{
  "success": true,
  "products": [...],
  "category": "women"
}
```

#### POST `/products` (Admin Only)
**Description:** Create new product
**Headers:** `Authorization: Bearer {access_token}`
**Body:**
```json
{
  "name": "Product Name",
  "price": 89.00,
  "image": "https://...",
  "category": "women",
  "colors": ["#1a1a1a", "#ffffff"],
  "sizes": ["S", "M", "L"],
  "description": "Product description",
  "inStock": true
}
```

#### PUT `/products/:id` (Admin Only)
**Description:** Update product
**Headers:** `Authorization: Bearer {access_token}`

#### DELETE `/products/:id` (Admin Only)
**Description:** Delete product
**Headers:** `Authorization: Bearer {access_token}`

---

### Orders Endpoints

#### POST `/orders`
**Description:** Create new order
**Headers:** `Authorization: Bearer {access_token}`
**Body:**
```json
{
  "items": [
    {
      "productId": "uuid",
      "name": "Product Name",
      "image": "https://...",
      "selectedColor": "#1a1a1a",
      "selectedSize": "M",
      "quantity": 2,
      "price": 89.00
    }
  ],
  "totalAmount": 178.00,
  "shippingAddress": {
    "street": "123 Main St",
    "city": "City",
    "country": "Country"
  }
}
```

#### GET `/orders`
**Description:** Get user's orders
**Headers:** `Authorization: Bearer {access_token}`

#### GET `/admin/orders` (Admin Only)
**Description:** Get all orders
**Headers:** `Authorization: Bearer {access_token}`

---

## Frontend API Service Layer

### File: `/src/app/services/api.ts`

The API service provides a clean interface for all backend communication:

```typescript
// Authentication
import { api } from './services/api';

// Sign up
await api.auth.signUp(email, password, fullName);

// Sign in
await api.auth.signIn(email, password);

// Sign out
await api.auth.signOut();

// Get profile
const profile = await api.auth.getUserProfile();

// Products
const allProducts = await api.products.getAll();
const womenProducts = await api.products.getByCategory('women');
const product = await api.products.getById(id);

// Admin operations
await api.products.create(productData);
await api.products.update(id, updateData);
await api.products.delete(id);

// Orders
await api.orders.create(items, totalAmount, shippingAddress);
const myOrders = await api.orders.getUserOrders();
const order = await api.orders.getById(orderId);
```

---

## Authentication Flow

### Sign Up Flow
```
1. User fills signup form → `/signup`
2. Frontend calls `api.auth.signUp()`
3. Backend creates user in Supabase Auth
4. Backend creates user profile in `user_profiles`
5. Frontend auto-signs in user
6. Redirect to home page
```

### Sign In Flow
```
1. User fills login form → `/login`
2. Frontend calls `api.auth.signIn()`
3. Supabase Auth validates credentials
4. Returns session with access_token
5. AuthContext stores user & session
6. Redirect to home page
```

### Protected Routes
```
1. User attempts to access protected resource
2. API service gets access_token from Supabase session
3. Sends request with `Authorization: Bearer {token}`
4. Backend validates token with Supabase
5. Backend checks user role if admin required
6. Returns data or 401/403 error
```

---

## State Management

### AuthContext
```typescript
- user: User | null
- session: Session | null
- loading: boolean
- isAdmin: boolean
- signIn(email, password)
- signUp(email, password, fullName)
- signOut()
```

### CartContext
```typescript
- cart: CartItem[]
- addToCart(product, color, size, quantity)
- removeFromCart(id, color, size)
- updateQuantity(id, quantity, color, size)
- cartCount: number
- cartTotal: number
```

---

## Security Features

### Row Level Security (RLS)
- Products: Public read, admin-only write
- User Profiles: Users can only access their own profile
- Orders: Users can only access their own orders
- Order Items: Linked to order ownership

### Authentication
- JWT-based authentication via Supabase
- Secure password hashing
- Session management
- Token refresh handling

### Authorization
- Role-based access control (customer/admin)
- Backend verification for admin endpoints
- Frontend UI restrictions based on role

---

## Error Handling

### Frontend
- API errors logged to console
- User-friendly toast notifications
- Form validation before submission
- Loading states during async operations

### Backend
- Detailed error logging
- Contextual error messages
- Appropriate HTTP status codes
- Error response format:
```json
{
  "error": "Error message",
  "details": "Additional context"
}
```

---

## Development Workflow

### 1. Database Setup
1. Create tables using SQL in Supabase Dashboard
2. Enable RLS and create policies
3. Run seed endpoint to populate initial data

### 2. Backend Development
1. Create controller in `/supabase/functions/server/`
2. Add routes in `index.tsx`
3. Test endpoints using fetch or Postman

### 3. Frontend Integration
1. Add API methods to `/src/app/services/api.ts`
2. Use API in components
3. Handle loading & error states
4. Update UI based on responses

### 4. Testing
1. Test authentication flow
2. Test CRUD operations
3. Test admin features
4. Test error scenarios

---

## Deployment Considerations

### Environment Variables
The following are automatically provided by Supabase:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (backend only)
- `SUPABASE_ANON_KEY` (frontend)

### Production Checklist
- [ ] Configure email provider in Supabase
- [ ] Set up proper CORS policies
- [ ] Enable rate limiting
- [ ] Add monitoring and logging
- [ ] Implement payment gateway
- [ ] Add email notifications
- [ ] Set up backups
- [ ] Configure custom domain
- [ ] Add analytics tracking
- [ ] Implement proper error reporting

---

## Future Enhancements

### Potential Features
1. **Payment Integration**
   - Stripe or PayPal checkout
   - Order confirmation emails
   - Invoice generation

2. **Enhanced Product Features**
   - Multiple product images
   - Product reviews and ratings
   - Wishlist functionality
   - Stock management

3. **User Features**
   - Order tracking
   - Email notifications
   - User dashboard
   - Saved addresses

4. **Admin Features**
   - Sales analytics
   - Inventory management
   - Customer management
   - Discount codes

5. **Performance**
   - Image optimization
   - Caching strategy
   - CDN integration
   - Database query optimization

---

## Support & Troubleshooting

### Common Issues

**Issue: Products not loading**
- Check if tables are created
- Verify RLS policies allow public read
- Check browser console for errors

**Issue: Authentication fails**
- Verify Supabase connection
- Check credentials format
- Ensure auth table exists

**Issue: Admin features not accessible**
- Verify user role is 'admin' in database
- Log out and log back in
- Check admin verification endpoint

For detailed setup instructions, see [DATABASE_SETUP.md](./DATABASE_SETUP.md)
