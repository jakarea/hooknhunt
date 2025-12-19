'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartProduct, CartItem } from '@/types';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: CartProduct, quantity?: number) => void;
  removeFromCart: (cartItemId: number) => void;
  updateQuantity: (cartItemId: number, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: number, variantId?: number) => boolean;
  getCartTotal: () => number;
  getCartCount: () => number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: CartProduct, quantity: number = 1) => {
    setCartItems(prevItems => {
      // Check if exact same product variant already exists
      const existingItem = prevItems.find(item =>
        item.product.id === product.id &&
        item.product.variant_id === product.variant_id
      );

      if (existingItem) {
        // Update quantity if exact same item exists
        return prevItems.map(item =>
          (item.product.id === product.id && item.product.variant_id === product.variant_id)
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock || 999) }
            : item
        );
      } else {
        // Add new item with unique ID
        const newCartItem: CartItem = {
          id: Date.now(), // Unique cart item ID
          product,
          quantity,
          price: product.price || 0,
          variant: product.variant_id ? {
            id: product.variant_id,
            name: product.variant_name || '',
            sku: '',
            price: product.price || 0
          } : undefined
        };
        return [...prevItems, newCartItem];
      }
    });

    // Open cart sidebar when item is added
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === cartItemId
          ? { ...item, quantity: Math.min(quantity, item.product.stock || 999) }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const isInCart = (productId: number, variantId?: number) => {
    return cartItems.some(item =>
      item.product.id === productId &&
      (variantId === undefined || item.product.variant_id === variantId)
    );
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.product.price || 0) * item.quantity, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen(prev => !prev);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
        getCartTotal,
        getCartCount,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
