import { Context } from 'npm:hono';
import { supabase } from './database.tsx';

/**
 * Seed Data Script
 * Populates the database with initial product data
 * Run this endpoint once to initialize your products
 */

const sampleProducts = [
  // Women's Products
  {
    name: 'ACE TENNIS DRESS',
    price: 89.00,
    image: 'https://images.unsplash.com/photo-1684225358843-54b1132537b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    category: 'women',
    colors: ['#1a1a1a', '#ffffff', '#4a5568'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'Premium tennis dress with built-in support and moisture-wicking fabric',
    in_stock: true,
  },
  {
    name: 'PERFORMANCE LEGGINGS',
    price: 65.00,
    image: 'https://images.unsplash.com/photo-1768929096117-c0b04a7c8fc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    category: 'women',
    colors: ['#1a1a1a', '#2d3748', '#4a5568'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'High-performance leggings designed for maximum comfort and flexibility',
    in_stock: true,
  },
  {
    name: 'TENNIS TANK TOP',
    price: 45.00,
    image: 'https://images.unsplash.com/photo-1641578784369-bf2a6e0ef5f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    category: 'women',
    colors: ['#ffffff', '#1a1a1a', '#e5e7eb'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'Lightweight tank top perfect for training and competition',
    in_stock: true,
  },
  {
    name: 'ALPHA SPORTS BRA',
    price: 39.00,
    image: 'https://images.unsplash.com/photo-1684225358843-54b1132537b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    category: 'women',
    colors: ['#1a1a1a', '#ffffff'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'High-support sports bra for intense workouts',
    in_stock: true,
  },
  {
    name: 'TENNIS SKIRT PRO',
    price: 75.00,
    image: 'https://images.unsplash.com/photo-1684225358843-54b1132537b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    category: 'women',
    colors: ['#ffffff', '#1a1a1a', '#4a5568'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'Professional tennis skirt with built-in shorts',
    in_stock: true,
  },
  {
    name: 'COURT COLLECTION SET',
    price: 120.00,
    image: 'https://images.unsplash.com/photo-1768929096117-c0b04a7c8fc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    category: 'women',
    colors: ['#1a1a1a', '#2d3748'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'Complete court collection including top and bottom',
    in_stock: true,
  },

  // Men's Products
  {
    name: 'SHORT HOMME',
    price: 39.00,
    image: 'https://images.unsplash.com/photo-1627064446636-88e70a81c745?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    category: 'men',
    colors: ['#1a1a1a', '#2d3748', '#4a5568'],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Premium men\'s tennis shorts with quick-dry technology',
    in_stock: true,
  },
  {
    name: 'APEX SHORT WITH LEGGING',
    price: 59.00,
    image: 'https://images.unsplash.com/photo-1663712730198-f8b201d20f60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    category: 'men',
    colors: ['#1a1a1a', '#2d3748'],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Hybrid shorts with built-in compression leggings',
    in_stock: true,
  },
  {
    name: 'PERFORMANCE POLO',
    price: 69.00,
    image: 'https://images.unsplash.com/photo-1663712730198-f8b201d20f60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    category: 'men',
    colors: ['#ffffff', '#1a1a1a', '#2d3748'],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Classic performance polo with modern fit',
    in_stock: true,
  },
  {
    name: 'ALPHA TENNIS PANTS',
    price: 79.00,
    image: 'https://images.unsplash.com/photo-1627064446636-88e70a81c745?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    category: 'men',
    colors: ['#1a1a1a', '#2d3748', '#4a5568'],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Professional tennis pants with four-way stretch',
    in_stock: true,
  },
  {
    name: 'TRAINING T-SHIRT',
    price: 49.00,
    image: 'https://images.unsplash.com/photo-1663712730198-f8b201d20f60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    category: 'men',
    colors: ['#ffffff', '#1a1a1a', '#4a5568'],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Breathable training t-shirt for peak performance',
    in_stock: true,
  },
  {
    name: 'PRO PACK COMBO',
    price: 99.00,
    image: 'https://images.unsplash.com/photo-1627064446636-88e70a81c745?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    category: 'men',
    colors: ['#1a1a1a', '#2d3748'],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Complete pro pack with shirt and shorts',
    in_stock: true,
  },
];

export async function seedDatabase(c: Context) {
  try {
    console.log('Starting database seed...');

    // Check if products already exist
    const { data: existingProducts, error: checkError } = await supabase
      .from('products')
      .select('id')
      .limit(1);

    if (checkError) {
      console.error('Error checking existing products:', checkError);
      return c.json({
        success: false,
        error: 'Failed to check existing products. Make sure the products table exists.',
        message: 'Please run the SQL schema first in Supabase Dashboard',
      }, 500);
    }

    if (existingProducts && existingProducts.length > 0) {
      return c.json({
        success: false,
        message: 'Database already contains products. Skipping seed.',
      });
    }

    // Insert sample products
    const { data, error } = await supabase
      .from('products')
      .insert(sampleProducts)
      .select();

    if (error) {
      console.error('Error seeding products:', error);
      return c.json({
        success: false,
        error: 'Failed to seed products',
        details: error.message,
      }, 500);
    }

    console.log(`Successfully seeded ${data.length} products`);

    return c.json({
      success: true,
      message: `Database seeded successfully with ${data.length} products`,
      products: data,
    });
  } catch (error) {
    console.error('Unexpected error during database seeding:', error);
    return c.json({
      success: false,
      error: 'An unexpected error occurred during seeding',
    }, 500);
  }
}
