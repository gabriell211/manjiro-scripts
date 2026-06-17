"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { CartItem } from "@/types/cart";

type AddCartItem = Omit<CartItem, "quantity"> & {
  quantity?: number;
};

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  subtotal: number;
  totalItems: number;
  addItem: (item: AddCartItem) => void;
  removeItem: (id: string, type: CartItem["type"]) => void;
  updateQuantity: (id: string, type: CartItem["type"], quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const storageKey = "manjiro-scripts-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    const stored = window.localStorage.getItem(storageKey);

    if (!stored) {
      return [];
    }

    try {
      return JSON.parse(stored) as CartItem[];
    } catch {
      return [];
    }
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
    const totalItems = items.reduce((total, item) => total + item.quantity, 0);

    return {
      items,
      isOpen,
      subtotal,
      totalItems,
      addItem: (item) => {
        setItems((currentItems) => {
          const existingItem = currentItems.find(
            (currentItem) => currentItem.id === item.id && currentItem.type === item.type
          );

          if (!existingItem) {
            return [...currentItems, { ...item, quantity: item.quantity ?? 1 }];
          }

          return currentItems.map((currentItem) =>
            currentItem.id === item.id && currentItem.type === item.type
              ? { ...currentItem, quantity: currentItem.quantity + (item.quantity ?? 1) }
              : currentItem
          );
        });
        setIsOpen(true);
      },
      removeItem: (id, type) => {
        setItems((currentItems) =>
          currentItems.filter((item) => !(item.id === id && item.type === type))
        );
      },
      updateQuantity: (id, type, quantity) => {
        if (quantity <= 0) {
          setItems((currentItems) =>
            currentItems.filter((item) => !(item.id === id && item.type === type))
          );
          return;
        }

        setItems((currentItems) =>
          currentItems.map((item) =>
            item.id === id && item.type === type ? { ...item, quantity } : item
          )
        );
      },
      clearCart: () => setItems([]),
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false)
    };
  }, [isOpen, items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart precisa estar dentro de CartProvider.");
  }

  return context;
}
