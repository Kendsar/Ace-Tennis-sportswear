import { Product } from '../context/CartContext';

export const products: Product[] = [
  // Women's Products
  {
    id: 'w1',
    name: 'ACE TENNIS DRESS',
    price: 89.000,
    image: 'https://images.unsplash.com/photo-1684225358843-54b1132537b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    category: 'women',
    colors: ['#1a1a1a', '#ffffff', '#4a5568'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    id: 'w2',
    name: 'PERFORMANCE LEGGINGS',
    price: 65.000,
    image: 'https://images.unsplash.com/photo-1768929096117-c0b04a7c8fc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    category: 'women',
    colors: ['#1a1a1a', '#2d3748', '#4a5568'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    id: 'w3',
    name: 'TENNIS TANK TOP',
    price: 45.000,
    image: 'https://images.unsplash.com/photo-1641578784369-bf2a6e0ef5f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    category: 'women',
    colors: ['#ffffff', '#1a1a1a', '#e5e7eb'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    id: 'w4',
    name: 'ACE SPORTS BRA',
    price: 39.000,
    image: 'https://images.unsplash.com/photo-1684225358843-54b1132537b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    category: 'women',
    colors: ['#1a1a1a', '#ffffff'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    id: 'w5',
    name: 'TENNIS SKIRT PRO',
    price: 75.000,
    image: 'https://images.unsplash.com/photo-1684225358843-54b1132537b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    category: 'women',
    colors: ['#ffffff', '#1a1a1a', '#4a5568'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    id: 'w6',
    name: 'COURT COLLECTION SET',
    price: 120.000,
    image: 'https://images.unsplash.com/photo-1768929096117-c0b04a7c8fc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    category: 'women',
    colors: ['#1a1a1a', '#2d3748'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },

  // Men's Products
  {
    id: 'm1',
    name: 'SHORT HOMME',
    price: 39.000,
    image: 'https://images.unsplash.com/photo-1627064446636-88e70a81c745?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    category: 'men',
    colors: ['#1a1a1a', '#2d3748', '#4a5568'],
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 'm2',
    name: 'APEX SHORT WITH LEGGING',
    price: 59.000,
    image: 'https://images.unsplash.com/photo-1663712730198-f8b201d20f60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    category: 'men',
    colors: ['#1a1a1a', '#2d3748'],
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 'm3',
    name: 'PERFORMANCE POLO',
    price: 69.000,
    image: 'https://images.unsplash.com/photo-1663712730198-f8b201d20f60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    category: 'men',
    colors: ['#ffffff', '#1a1a1a', '#2d3748'],
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 'm4',
    name: 'ACE TENNIS PANTS',
    price: 79.000,
    image: 'https://images.unsplash.com/photo-1627064446636-88e70a81c745?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    category: 'men',
    colors: ['#1a1a1a', '#2d3748', '#4a5568'],
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 'm5',
    name: 'TRAINING T-SHIRT',
    price: 49.000,
    image: 'https://images.unsplash.com/photo-1663712730198-f8b201d20f60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    category: 'men',
    colors: ['#ffffff', '#1a1a1a', '#4a5568'],
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 'm6',
    name: 'PRO PACK COMBO',
    price: 99.000,
    image: 'https://images.unsplash.com/photo-1627064446636-88e70a81c745?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    category: 'men',
    colors: ['#1a1a1a', '#2d3748'],
    sizes: ['S', 'M', 'L', 'XL'],
  },
];

export function getProductsByCategory(category: string): Product[] {
  return products.filter((product) => product.category === category);
}

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}