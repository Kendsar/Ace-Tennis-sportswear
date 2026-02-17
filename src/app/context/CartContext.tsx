import { createContext, useContext, useState, ReactNode } from 'react';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  colors: string[];
  sizes: string[];
  selectedColor?: string;
  selectedSize?: string;
}

interface CartItem extends Product {
  quantity: number;
  selectedColor: string;
  selectedSize: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, selectedColor: string, selectedSize: string, quantity?: number) => void;
  removeFromCart: (productId: string, selectedColor?: string, selectedSize?: string) => void;
  updateQuantity: (productId: string, quantity: number, selectedColor?: string, selectedSize?: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product, selectedColor: string, selectedSize: string, quantity?: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id && item.selectedColor === selectedColor && item.selectedSize === selectedSize);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id && item.selectedColor === selectedColor && item.selectedSize === selectedSize
            ? { ...item, quantity: item.quantity + (quantity || 1) }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: quantity || 1, selectedColor, selectedSize }];
    });
  };

  const removeFromCart = (productId: string, selectedColor?: string, selectedSize?: string) => {
    setCart((prevCart) => {
      if (selectedColor && selectedSize) {
        return prevCart.filter((item) => 
          !(item.id === productId && item.selectedColor === selectedColor && item.selectedSize === selectedSize)
        );
      }
      return prevCart.filter((item) => item.id !== productId);
    });
  };

  const updateQuantity = (productId: string, quantity: number, selectedColor?: string, selectedSize?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedColor, selectedSize);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (selectedColor && selectedSize) {
          return item.id === productId && item.selectedColor === selectedColor && item.selectedSize === selectedSize
            ? { ...item, quantity }
            : item;
        }
        return item.id === productId ? { ...item, quantity } : item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}