import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ============================================
// AUTHENTICATION API (uses Supabase directly)
// ============================================

export const authAPI = {
  // Sign up new user
  signUp: async (email: string, password: string, fullName?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { fullName }
      }
    });

    if (error) {
      console.error('Sign-up error:', error);
      throw error;
    }

    // Create user profile in user_profiles table
    if (data.user) {
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: data.user.id,
          email: email,
          full_name: fullName || null,
          role: 'customer',
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
      }
    }

    return data;
  },

  // Sign in user
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Sign-in error:', error);
      throw error;
    }

    return {
      success: true,
      session: data.session,
      user: data.user,
    };
  },

  // Verify if user is admin
  verifyAdmin: async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, isAdmin: false };
    }

    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    if (error || !profile) {
      return { success: false, isAdmin: false };
    }

    return { success: true, isAdmin: profile.role === 'admin' };
  },

  // Sign out user
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign-out error:', error);
      throw error;
    }
    return { success: true };
  },

  // Get current session
  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Get session error:', error);
      throw error;
    }
    return session;
  },

  // Get current user profile
  getUserProfile: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  // Update user profile metadata
  updateUserProfile: async (fullName: string) => {
    const { data, error } = await supabase.auth.updateUser({
      data: { fullName }
    });

    if (error) {
      console.error('Update profile error:', error);
      throw error;
    }

    return data;
  },
};

// ============================================
// PRODUCTS API (uses Supabase directly)
// ============================================

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: 'women' | 'men';
  colors: string[];
  sizes: string[];
  description?: string;
  in_stock: boolean;
  created_at?: string;
  updated_at?: string;
}

export const productsAPI = {
  // Get all products
  getAll: async () => {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      throw error;
    }

    return { success: true, products: products || [] };
  },

  // Get products by category
  getByCategory: async (category: 'women' | 'men') => {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }

    return { success: true, products: products || [], category };
  },

  // Get single product by ID
  getById: async (id: string) => {
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching product:', error);
      throw error;
    }

    return { success: true, product };
  },

  // Create new product (Admin only - RLS enforced)
  create: async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    const { data: product, error } = await supabase
      .from('products')
      .insert(productData)
      .select()
      .single();

    if (error) {
      console.error('Error creating product:', error);
      throw error;
    }

    return { success: true, product };
  },

  // Update product (Admin only - RLS enforced)
  update: async (id: string, productData: Partial<Product>) => {
    const { data: product, error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating product:', error);
      throw error;
    }

    return { success: true, product };
  },

  // Delete product (Admin only - RLS enforced)
  delete: async (id: string) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting product:', error);
      throw error;
    }

    return { success: true, message: 'Product deleted successfully' };
  },
};

// ============================================
// ORDERS API (uses Supabase directly)
// ============================================

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address?: any;
  created_at: string;
  updated_at: string;
  items?: any[];
}

export const ordersAPI = {
  // Create new order (requires authentication - RLS enforced)
  create: async (items: OrderItem[], totalAmount: number, shippingAddress?: any) => {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('You must be logged in to create an order');
    }

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        total_amount: totalAmount,
        status: 'pending',
        shipping_address: shippingAddress || null,
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      throw orderError;
    }

    // Create order items
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      product_name: item.name,
      product_image: item.image,
      selected_color: item.selectedColor,
      selected_size: item.selectedSize,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      // Rollback order
      await supabase.from('orders').delete().eq('id', order.id);
      throw itemsError;
    }

    return {
      success: true,
      order: {
        id: order.id,
        totalAmount: order.total_amount,
        status: order.status,
        createdAt: order.created_at,
      },
    };
  },

  // Get all orders for current user (RLS enforced)
  getUserOrders: async () => {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }

    return { success: true, orders: orders || [] };
  },

  // Get single order with items (RLS enforced)
  getById: async (id: string) => {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (orderError) {
      console.error('Error fetching order:', orderError);
      throw orderError;
    }

    // Fetch order items
    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', id);

    if (itemsError) {
      console.error('Error fetching order items:', itemsError);
      throw itemsError;
    }

    return {
      success: true,
      order: {
        ...order,
        items: items || [],
      },
    };
  },

  // Update order status (Admin only - RLS enforced)
  updateStatus: async (id: string, status: string) => {
    const { data: order, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating order status:', error);
      throw error;
    }

    return { success: true, order };
  },

  // Get all orders (Admin only - RLS enforced)
  getAllOrders: async () => {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*, user_profiles(email, full_name)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all orders:', error);
      throw error;
    }

    return { success: true, orders: orders || [] };
  },
};

// Export all APIs
export const api = {
  auth: authAPI,
  products: productsAPI,
  orders: ordersAPI,
};

export default api;
