import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

import * as authController from "./auth-controller.ts";
import * as productsController from "./products-controller.ts";
import * as ordersController from "./orders-controller.ts";
import { seedDatabase } from "./seed-data.ts";

const app = new Hono();

// Logger
app.use("*", logger());

// CORS middleware (correct)
app.use(
  "*",
  cors({
    origin: "*",
    allowHeaders: ["Authorization", "Content-Type"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// Seed endpoint
app.post("/seed", seedDatabase);

// Auth routes
app.post("/auth/signup", authController.signUp);
app.post("/auth/signin", authController.signIn);
app.get("/auth/profile", authController.getUserProfile);
app.put("/auth/profile", authController.updateUserProfile);
app.get("/auth/verify-admin", authController.verifyAdmin);

// Product routes
app.get("/products", productsController.getAllProducts);
app.get("/products/category/:category", productsController.getProductsByCategory);
app.get("/products/:id", productsController.getProductById);

// Orders routes
app.post("/orders", ordersController.createOrder);
app.get("/orders", ordersController.getUserOrders);
app.get("/orders/:id", ordersController.getOrderById);

// Export for Supabase runtime
export default app;
