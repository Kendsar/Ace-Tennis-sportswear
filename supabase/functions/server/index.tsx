import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import * as kv from "./kv_store.tsx";
import * as authController from "./auth-controller.tsx";
import * as productsController from "./products-controller.tsx";
import * as ordersController from "./orders-controller.tsx";
import { seedDatabase } from "./seed-data.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Middleware for CORS
app.use('*', async (c, next) => {
  c.header('Access-Control-Allow-Origin', 'http://localhost:5173'); // your frontend origin
  c.header('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

  // Handle preflight
  if (c.req.method === 'OPTIONS') {
    return c.text('', 200);
  }

  return next();
});

// Database seed endpoint (run once to populate initial data)
app.post("/seed", seedDatabase);

// ============================================
// AUTHENTICATION ROUTES
// ============================================
app.post("/auth/signup", authController.signUp);
app.post("/auth/signin", authController.signIn);
app.get("/auth/profile", authController.getUserProfile);
app.put("/auth/profile", authController.updateUserProfile);
app.get("/auth/verify-admin", authController.verifyAdmin);

// ============================================
// PRODUCTS ROUTES
// ============================================
app.get("/products", productsController.getAllProducts);
app.get("/products/category/:category", productsController.getProductsByCategory);
app.get("/products/:id", productsController.getProductById);
app.post("/products", productsController.createProduct); // Admin only
app.put("/products/:id", productsController.updateProduct); // Admin only
app.delete("/products/:id", productsController.deleteProduct); // Admin only

// ============================================
// ORDERS ROUTES
// ============================================
app.post("/orders", ordersController.createOrder);
app.get("/orders", ordersController.getUserOrders);
app.get("/orders/:id", ordersController.getOrderById);
app.put("/orders/:id/status", ordersController.updateOrderStatus); // Admin only
app.get("/admin/orders", ordersController.getAllOrders); // Admin only

Deno.serve(app.fetch);