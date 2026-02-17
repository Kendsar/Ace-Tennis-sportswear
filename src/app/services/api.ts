import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Base API URL (for your custom backend routes only)
const API_BASE_URL = `${supabaseUrl}/functions/v1/make-server-5eb44c6f`;


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

// Generic API request handler (for your custom backend)
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  useAuth: boolean = true
): Promise<T> {
  try {
    const headers = await getAuthHeaders(useAuth);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`API Error on ${endpoint}:`, data);
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`Request failed for ${endpoint}:`, error);
    throw error;
  }
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
  getAll: async () => apiRequest('/products', { method: 'GET' }, false),
  getByCategory: async (category: 'women' | 'men') =>
    apiRequest(`/products/category/${category}`, { method: 'GET' }, false),
  getById: async (id: string) => apiRequest(`/products/${id}`, { method: 'GET' }, false),
  create: async (productData: any) =>
    apiRequest('/products', { method: 'POST', body: JSON.stringify(productData) }),
  update: async (id: string, productData: any) =>
    apiRequest(`/products/${id}`, { method: 'PUT', body: JSON.stringify(productData) }),
  delete: async (id: string) => apiRequest(`/products/${id}`, { method: 'DELETE' }),
};

export const ordersAPI = {
  create: async (items: any[], totalAmount: number, shippingAddress?: any) =>
    apiRequest('/orders', { method: 'POST', body: JSON.stringify({ items, totalAmount, shippingAddress }) }),
  getUserOrders: async () => apiRequest('/orders', { method: 'GET' }),
  getById: async (id: string) => apiRequest(`/orders/${id}`, { method: 'GET' }),
  updateStatus: async (id: string, status: string) =>
    apiRequest(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  getAllOrders: async () => apiRequest('/admin/orders', { method: 'GET' }),
};

// Export all APIs
export const api = {
  auth: authAPI,
  products: productsAPI,
  orders: ordersAPI,
};

export default api;
