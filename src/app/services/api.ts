import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Base API URL (for your custom backend routes only)


// Helper to get headers for your custom backend routes
async function getAuthHeaders(useAuth: boolean = true): Promise<HeadersInit> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (useAuth) {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    } else {
      headers['Authorization'] = `Bearer ${supabaseAnonKey}`;
    }
  } else {
    headers['Authorization'] = `Bearer ${supabaseAnonKey}`;
  }

  return headers;
}


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
        data: { fullName } // metadata
      }
    });

    if (data.user?.email) {
      alert('Check your email to confirm your account before signing in!');
    }

    if (error) {
      console.error('Sign-up error:', error);
      throw error;
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

  verifyAdmin: async () => {
    return apiRequest('/auth/verify-admin', { method: 'GET' });
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

  // Get current user profile (you can store extra info in metadata or in a separate table)
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
// PRODUCTS & ORDERS API (keep your apiRequest wrapper)
// ============================================

export const productsAPI = {
  // Get all products
  getAll: async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*");

    if (error) throw error;
    return data;
  },

  // Get products by category
  getByCategory: async (category: "women" | "men") => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("category", category);

    if (error) throw error;
    return data;
  },

  // Get product by ID
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create product
  create: async (productData: any) => {
    const { data, error } = await supabase
      .from("products")
      .insert([productData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update product
  update: async (id: string, productData: any) => {
    const { data, error } = await supabase
      .from("products")
      .update(productData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete product
  delete: async (id: string) => {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return true;
  },
};


export const ordersAPI = {
  // Create order
  create: async (items: any[], totalAmount: number, shippingAddress?: any) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          user_id: user.id,
          items,
          total_amount: totalAmount,
          shipping_address: shippingAddress,
          status: "pending",
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get current user orders
  getUserOrders: async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get order by ID
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  // Update order status (admin only)
  updateStatus: async (id: string, status: string) => {
    const { data, error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Admin: get all orders
  getAllOrders: async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },
};


// Export all APIs
export const api = {
  auth: authAPI,
  products: productsAPI,
  orders: ordersAPI,
};

export default api;
