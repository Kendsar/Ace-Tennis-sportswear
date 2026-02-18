import { Context } from 'npm:hono';
import { supabase } from './database.tsx';

/**
 * Products Controller
 * Handles CRUD operations for products
 */

// Get all products
export async function getAllProducts(c: Context) {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all products:', error);
      return c.json({ error: 'Failed to fetch products' }, 500);
    }

    return c.json({ success: true, products });
  } catch (error) {
    console.error('Unexpected error while fetching all products:', error);
    return c.json({ error: 'An unexpected error occurred while fetching products' }, 500);
  }
}

// Get products by category
export async function getProductsByCategory(c: Context) {
  try {
    const category = c.req.param('category');

    if (!category || !['women', 'men'].includes(category)) {
      return c.json({ error: 'Invalid category. Must be "women" or "men"' }, 400);
    }

    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`Error fetching products for category ${category}:`, error);
      return c.json({ error: 'Failed to fetch products' }, 500);
    }

    return c.json({ success: true, products, category });
  } catch (error) {
    console.error('Unexpected error while fetching products by category:', error);
    return c.json({ error: 'An unexpected error occurred while fetching products' }, 500);
  }
}

// Get single product by ID
export async function getProductById(c: Context) {
  try {
    const id = c.req.param('id');

    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching product with id ${id}:`, error);
      return c.json({ error: 'Product not found' }, 404);
    }

    return c.json({ success: true, product });
  } catch (error) {
    console.error('Unexpected error while fetching product by ID:', error);
    return c.json({ error: 'An unexpected error occurred while fetching product' }, 500);
  }
}

// Create new product (Admin only)
export async function createProduct(c: Context) {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];

    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }

    // Verify user is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      console.error('Authorization error while creating product:', authError);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || profile.role !== 'admin') {
      return c.json({ error: 'Access denied. Admin privileges required.' }, 403);
    }

    // Get product data
    const productData = await c.req.json();
    const { name, price, image, category, colors, sizes, description, inStock } = productData;

    if (!name || !price || !image || !category || !colors || !sizes) {
      return c.json({ error: 'Missing required fields: name, price, image, category, colors, sizes' }, 400);
    }

    // Insert product
    const { data: product, error: insertError } = await supabase
      .from('products')
      .insert({
        name,
        price,
        image,
        category,
        colors,
        sizes,
        description: description || null,
        in_stock: inStock !== undefined ? inStock : true,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating product:', insertError);
      return c.json({ error: 'Failed to create product' }, 500);
    }

    return c.json({ success: true, product });
  } catch (error) {
    console.error('Unexpected error while creating product:', error);
    return c.json({ error: 'An unexpected error occurred while creating product' }, 500);
  }
}

// Update product (Admin only)
export async function updateProduct(c: Context) {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];

    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }

    // Verify user is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      console.error('Authorization error while updating product:', authError);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || profile.role !== 'admin') {
      return c.json({ error: 'Access denied. Admin privileges required.' }, 403);
    }

    const id = c.req.param('id');
    const updateData = await c.req.json();

    // Update product
    const { data: product, error: updateError } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error(`Error updating product with id ${id}:`, updateError);
      return c.json({ error: 'Failed to update product' }, 500);
    }

    return c.json({ success: true, product });
  } catch (error) {
    console.error('Unexpected error while updating product:', error);
    return c.json({ error: 'An unexpected error occurred while updating product' }, 500);
  }
}

// Delete product (Admin only)
export async function deleteProduct(c: Context) {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];

    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }

    // Verify user is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      console.error('Authorization error while deleting product:', authError);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || profile.role !== 'admin') {
      return c.json({ error: 'Access denied. Admin privileges required.' }, 403);
    }

    const id = c.req.param('id');

    // Delete product
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error(`Error deleting product with id ${id}:`, deleteError);
      return c.json({ error: 'Failed to delete product' }, 500);
    }

    return c.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Unexpected error while deleting product:', error);
    return c.json({ error: 'An unexpected error occurred while deleting product' }, 500);
  }
}
