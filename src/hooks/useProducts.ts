import { useState, useEffect } from "react";
import { database, ref, onValue, push, set, remove, update } from "@/lib/firebase";
import type { Product } from "@/types";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const productsRef = ref(database, "products");
    
    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const productsList = Object.entries(data).map(([id, product]) => ({
          id,
          ...(product as Omit<Product, "id">),
        }));
        setProducts(productsList);
      } else {
        setProducts([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addProduct = async (product: Omit<Product, "id">) => {
    const productsRef = ref(database, "products");
    const newProductRef = push(productsRef);
    await set(newProductRef, product);
    return newProductRef.key;
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    const productRef = ref(database, `products/${id}`);
    await update(productRef, updates);
  };

  const deleteProduct = async (id: string) => {
    const productRef = ref(database, `products/${id}`);
    await remove(productRef);
  };

  const getLowStockProducts = () => {
    return products.filter((p) => p.stock <= p.minStock);
  };

  return {
    products,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    getLowStockProducts,
  };
}
