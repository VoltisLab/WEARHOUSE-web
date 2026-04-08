"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { MarketplaceProductRow } from "@/components/marketplace/ProductCard";
import { productPriceDisplay } from "@/lib/product-display";

const STORAGE_KEY = "wearhouse-shop-all-bag-v1";

function salePriceNumber(p: MarketplaceProductRow): number {
  const { sale } = productPriceDisplay(
    Number(p.price ?? 0),
    p.discountPrice != null && p.discountPrice !== ""
      ? Number(p.discountPrice)
      : null,
  );
  return sale;
}

type ShopAllBagContextValue = {
  items: MarketplaceProductRow[];
  hydrated: boolean;
  add: (p: MarketplaceProductRow) => void;
  remove: (productId: number) => void;
  clear: () => void;
  has: (productId: number) => boolean;
  totalPrice: number;
  formattedTotal: string;
};

const ShopAllBagContext = createContext<ShopAllBagContextValue | null>(null);

export function ShopAllBagProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<MarketplaceProductRow[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as unknown;
        if (Array.isArray(parsed)) {
          setItems(parsed as MarketplaceProductRow[]);
        }
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items, hydrated]);

  const add = useCallback((p: MarketplaceProductRow) => {
    if (p.status === "SOLD") return;
    setItems((prev) =>
      prev.some((x) => x.id === p.id) ? prev : [...prev, p],
    );
  }, []);

  const remove = useCallback((productId: number) => {
    setItems((prev) => prev.filter((x) => x.id !== productId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const has = useCallback(
    (productId: number) => items.some((x) => x.id === productId),
    [items],
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, p) => sum + salePriceNumber(p), 0),
    [items],
  );

  const formattedTotal = useMemo(() => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(totalPrice);
  }, [totalPrice]);

  const value = useMemo(
    () => ({
      items,
      hydrated,
      add,
      remove,
      clear,
      has,
      totalPrice,
      formattedTotal,
    }),
    [items, hydrated, add, remove, clear, has, totalPrice, formattedTotal],
  );

  return (
    <ShopAllBagContext.Provider value={value}>
      {children}
    </ShopAllBagContext.Provider>
  );
}

export function useShopAllBag() {
  const ctx = useContext(ShopAllBagContext);
  if (!ctx) {
    throw new Error("useShopAllBag must be used within ShopAllBagProvider");
  }
  return ctx;
}
