import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import * as authController from "./auth-controller.tsx";
import * as productsController from "./products-controller.tsx";
import * as ordersController from "./orders-controller.tsx";
import { seedDatabase } from "./seed-data.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-5eb44c6f/health", (c) => {
  return c.json({ status: "ok" });
});

// Database seed endpoint (run once to populate initial data)
app.post("/make-server-5eb44c6f/seed", seedDatabase);

// ============================================
// AUTHENTICATION ROUTES
// ============================================
app.post("/make-server-5eb44c6f/auth/signup", authController.signUp);
app.post("/make-server-5eb44c6f/auth/signin", authController.signIn);
app.get("/make-server-5eb44c6f/auth/profile", authController.getUserProfile);
app.put("/make-server-5eb44c6f/auth/profile", authController.updateUserProfile);
app.get("/make-server-5eb44c6f/auth/verify-admin", authController.verifyAdmin);

// ============================================
// PRODUCTS ROUTES
// ============================================
app.get("/make-server-5eb44c6f/products", productsController.getAllProducts);
app.get("/make-server-5eb44c6f/products/category/:category", productsController.getProductsByCategory);
app.get("/make-server-5eb44c6f/products/:id", productsController.getProductById);
app.post("/make-server-5eb44c6f/products", productsController.createProduct); // Admin only
app.put("/make-server-5eb44c6f/products/:id", productsController.updateProduct); // Admin only
app.delete("/make-server-5eb44c6f/products/:id", productsController.deleteProduct); // Admin only

// ============================================
// ORDERS ROUTES
// ============================================
app.post("/make-server-5eb44c6f/orders", ordersController.createOrder);
app.get("/make-server-5eb44c6f/orders", ordersController.getUserOrders);
app.get("/make-server-5eb44c6f/orders/:id", ordersController.getOrderById);
app.put("/make-server-5eb44c6f/orders/:id/status", ordersController.updateOrderStatus); // Admin only
app.get("/make-server-5eb44c6f/admin/orders", ordersController.getAllOrders); // Admin only

Deno.serve(app.fetch);