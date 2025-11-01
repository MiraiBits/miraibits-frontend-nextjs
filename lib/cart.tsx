"use client";
import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import type { CartItem, Product } from './types';

type CartContextValue = {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalQuantity: number;
  totalPrice: number;
  productsCache: Map<string, Product>;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = 'mirai_lk_cart_v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [productsCache, setProductsCache] = useState<Map<string, Product>>(new Map());

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

  // Fetch product details for items in cart
  useEffect(() => {
    const fetchProducts = async () => {
      const productIds = items.map(it => it.productId);
      
      for (const productId of productIds) {
        // Skip if already fetching or cached
        setProductsCache(prev => {
          if (prev.has(productId)) {
            return prev; // Already cached
          }
          
          // Fetch product
          fetch(`/api/products?id=${productId}`)
            .then(response => {
              if (response.ok) {
                return response.json();
              }
              throw new Error('Failed to fetch product');
            })
            .then(product => {
              setProductsCache(cache => new Map(cache).set(productId, product));
            })
            .catch(error => {
              console.error(`Failed to fetch product ${productId}:`, error);
            });
          
          return prev;
        });
      }
    };

    if (items.length > 0) {
      fetchProducts();
    }
  }, [items]);

  const addItem = useCallback((product: Product, quantity: number = 1) => {
    setItems(prev => {
      const existing = prev.find(it => it.productId === product.id);
      if (existing) {
        return prev.map(it => it.productId === product.id ? { ...it, quantity: it.quantity + quantity } : it);
      }
      return [...prev, { productId: product.id, quantity }];
    });
    // Add product to cache immediately
    setProductsCache(prev => new Map(prev).set(product.id, product));
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
      const p = productsCache.get(it.productId);
      if (p) total += p.price * it.quantity;
    }
    return { totalQuantity: qty, totalPrice: total };
  }, [items, productsCache]);

  const value: CartContextValue = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalQuantity,
    totalPrice,
    productsCache,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

