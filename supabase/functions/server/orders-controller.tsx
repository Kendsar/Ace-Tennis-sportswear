import { Context } from 'npm:hono';
import { supabase } from './database.tsx';

/**
 * Orders Controller
 * Handles order creation, retrieval, and management
 */

// Create new order
export async function createOrder(c: Context) {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];

    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }

    // Verify user
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      console.error('Authorization error while creating order:', authError);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { items, shippingAddress, totalAmount } = await c.req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return c.json({ error: 'Order must contain at least one item' }, 400);
    }

    if (!totalAmount || totalAmount <= 0) {
      return c.json({ error: 'Invalid total amount' }, 400);
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
      return c.json({ error: 'Failed to create order' }, 500);
    }

    // Create order items
    const orderItems = items.map((item: any) => ({
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
      // Rollback order creation
      await supabase.from('orders').delete().eq('id', order.id);
      return c.json({ error: 'Failed to create order items' }, 500);
    }

    return c.json({
      success: true,
      order: {
        id: order.id,
        totalAmount: order.total_amount,
        status: order.status,
        createdAt: order.created_at,
      },
    });
  } catch (error) {
    console.error('Unexpected error while creating order:', error);
    return c.json({ error: 'An unexpected error occurred while creating order' }, 500);
  }
}

// Get all orders for current user
export async function getUserOrders(c: Context) {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];

    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }

    // Verify user
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      console.error('Authorization error while fetching user orders:', authError);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Fetch orders
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (ordersError) {
      console.error('Error fetching user orders:', ordersError);
      return c.json({ error: 'Failed to fetch orders' }, 500);
    }

    return c.json({ success: true, orders });
  } catch (error) {
    console.error('Unexpected error while fetching user orders:', error);
    return c.json({ error: 'An unexpected error occurred while fetching orders' }, 500);
  }
}

// Get single order with items
export async function getOrderById(c: Context) {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];

    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }

    // Verify user
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      console.error('Authorization error while fetching order:', authError);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const orderId = c.req.param('id');

    // Fetch order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .eq('user_id', user.id)
      .single();

    if (orderError) {
      console.error(`Error fetching order with id ${orderId}:`, orderError);
      return c.json({ error: 'Order not found' }, 404);
    }

    // Fetch order items
    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId);

    if (itemsError) {
      console.error(`Error fetching items for order ${orderId}:`, itemsError);
      return c.json({ error: 'Failed to fetch order items' }, 500);
    }

    return c.json({
      success: true,
      order: {
        ...order,
        items,
      },
    });
  } catch (error) {
    console.error('Unexpected error while fetching order by ID:', error);
    return c.json({ error: 'An unexpected error occurred while fetching order' }, 500);
  }
}

// Update order status (Admin only)
export async function updateOrderStatus(c: Context) {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];

    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }

    // Verify user is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      console.error('Authorization error while updating order status:', authError);
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

    const orderId = c.req.param('id');
    const { status } = await c.req.json();

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return c.json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` }, 400);
    }

    // Update order status
    const { data: order, error: updateError } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single();

    if (updateError) {
      console.error(`Error updating order status for order ${orderId}:`, updateError);
      return c.json({ error: 'Failed to update order status' }, 500);
    }

    return c.json({ success: true, order });
  } catch (error) {
    console.error('Unexpected error while updating order status:', error);
    return c.json({ error: 'An unexpected error occurred while updating order status' }, 500);
  }
}

// Get all orders (Admin only)
export async function getAllOrders(c: Context) {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];

    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }

    // Verify user is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      console.error('Authorization error while fetching all orders:', authError);
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

    // Fetch all orders
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*, user_profiles(email, full_name)')
      .order('created_at', { ascending: false });

    if (ordersError) {
      console.error('Error fetching all orders:', ordersError);
      return c.json({ error: 'Failed to fetch orders' }, 500);
    }

    return c.json({ success: true, orders });
  } catch (error) {
    console.error('Unexpected error while fetching all orders:', error);
    return c.json({ error: 'An unexpected error occurred while fetching orders' }, 500);
  }
}
