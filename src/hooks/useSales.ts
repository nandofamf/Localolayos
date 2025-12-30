import { useState, useEffect } from "react";
import { database, ref, onValue, push, set } from "@/lib/firebase";
import type { Sale, CartItem } from "@/types";

export function useSales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const salesRef = ref(database, "sales");
    
    const unsubscribe = onValue(salesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const salesList = Object.entries(data).map(([id, sale]) => ({
          id,
          ...(sale as Omit<Sale, "id">),
        }));
        setSales(salesList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      } else {
        setSales([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addSale = async (items: CartItem[], total: number, paymentMethod: string): Promise<string> => {
    const salesRef = ref(database, "sales");
    const newSaleRef = push(salesRef);
    const sale: Omit<Sale, "id"> = {
      items,
      total,
      date: new Date().toISOString(),
      paymentMethod,
    };
    await set(newSaleRef, sale);
    return newSaleRef.key || "";
  };

  const getTodaySales = () => {
    const today = new Date().toDateString();
    return sales.filter((s) => new Date(s.date).toDateString() === today);
  };

  const getTodayTotal = () => {
    return getTodaySales().reduce((sum, sale) => sum + sale.total, 0);
  };

  const getTodayTransactions = () => {
    return getTodaySales().length;
  };

  const getAverageTicket = () => {
    const todaySales = getTodaySales();
    if (todaySales.length === 0) return 0;
    return getTodayTotal() / todaySales.length;
  };

  return {
    sales,
    loading,
    addSale,
    getTodaySales,
    getTodayTotal,
    getTodayTransactions,
    getAverageTicket,
  };
}
