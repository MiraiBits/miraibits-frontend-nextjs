"use client";
import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import type { CartItem, Product } from './types';
import { getProductById } from './products';

type CartContextValue = {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalQuantity: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = 'miraibits_cart_v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const addItem = useCallback((product: Product, quantity: number = 1) => {
    setItems(prev => {
      const existing = prev.find(it => it.productId === product.id);
      if (existing) {
        return prev.map(it => it.productId === product.id ? { ...it, quantity: it.quantity + quantity } : it);
      }
      return [...prev, { productId: product.id, quantity }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems(prev => prev.filter(it => it.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems(prev => prev.map(it => it.productId === productId ? { ...it, quantity } : it));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const { totalQuantity, totalPrice } = useMemo(() => {
    let qty = 0;
    let total = 0;
    for (const it of items) {
      qty += it.quantity;
      const p = getProductById(it.productId);
      if (p) total += p.price * it.quantity;
    }
    return { totalQuantity: qty, totalPrice: total };
  }, [items]);

  const value: CartContextValue = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalQuantity,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}


