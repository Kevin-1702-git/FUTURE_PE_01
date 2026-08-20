"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  type: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: any, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  couponCode: string;
  couponDiscount: number;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  subtotal: number;
  deliveryCharge: number;
  gst: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState<string>("");
  const [couponDiscount, setCouponDiscount] = useState<number>(0);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("feastlane_cart");
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {}
  }, []);

  // Save cart to localStorage on updates
  useEffect(() => {
    try {
      localStorage.setItem("feastlane_cart", JSON.stringify(items));
    } catch (e) {}
  }, [items]);

  const addItem = (item: any, quantity = 1) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.id === item.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        toast.success(`Updated ${item.name} quantity to ${updated[existingIndex].quantity}`);
        return updated;
      } else {
        toast.success(`Added ${item.name} to your cart`);
        return [
          ...prev,
          {
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            category: item.categoryLabel || item.category,
            type: item.type,
            quantity
          }
        ];
      }
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast.success("Item removed from cart");
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
    setCouponCode("");
    setCouponDiscount(0);
  };

  const applyCoupon = (code: string) => {
    const formatted = code.trim().toUpperCase();
    const currentSubtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    if (formatted === "FAMILY20") {
      if (currentSubtotal < 1200) {
        toast.error("FAMILY20 requires a minimum order value of ₹1,200");
        return false;
      }
      const disc = Math.round(currentSubtotal * 0.2);
      setCouponCode("FAMILY20");
      setCouponDiscount(disc);
      toast.success("Coupon FAMILY20 applied! Saved 20%");
      return true;
    } else if (formatted === "STUDENT10") {
      if (currentSubtotal < 400) {
        toast.error("STUDENT10 requires a minimum order value of ₹400");
        return false;
      }
      const disc = Math.round(currentSubtotal * 0.1);
      setCouponCode("STUDENT10");
      setCouponDiscount(disc);
      toast.success("Coupon STUDENT10 applied! Saved 10%");
      return true;
    } else {
      toast.error("Invalid coupon code.");
      return false;
    }
  };

  const removeCoupon = () => {
    setCouponCode("");
    setCouponDiscount(0);
    toast.success("Coupon removed.");
  };

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const deliveryCharge = subtotal === 0 || subtotal >= 1000 ? 0 : 49;
  const gst = Math.round(subtotal * 0.05);
  const total = Math.max(0, subtotal + deliveryCharge + gst - couponDiscount);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        couponCode,
        couponDiscount,
        applyCoupon,
        removeCoupon,
        subtotal,
        deliveryCharge,
        gst,
        total
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
