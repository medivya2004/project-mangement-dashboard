import { useState, useEffect, useCallback } from "react";
import { Product, ProductFormData } from "../lib/type";
import {
  initializeProducts,
  getStoredProducts,
  saveStoredProducts
} from "../services/api";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await initializeProducts();
      setProducts(data);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // CREATE
  const addProduct = async (productData: ProductFormData): Promise<void> => {
    try {
      setError(null);

      const existing = getStoredProducts();

      const newProduct: Product = {
        id: Date.now(),
        ...productData
      };

      const updated = [...existing, newProduct];

      saveStoredProducts(updated);
      setProducts(updated);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add product");
      throw err;
    }
  };

  // UPDATE
  const editProduct = async (
    id: number,
    productData: ProductFormData
  ): Promise<void> => {
    try {
      setError(null);

      const existing = getStoredProducts();

      const updated = existing.map((p) =>
        p.id === id ? { ...p, ...productData } : p
      );

      saveStoredProducts(updated);
      setProducts(updated);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update product");
      throw err;
    }
  };

  // DELETE
  const removeProduct = async (id: number): Promise<void> => {
    try {
      setError(null);

      const existing = getStoredProducts();

      const updated = existing.filter((p) => p.id !== id);

      saveStoredProducts(updated);
      setProducts(updated);

      if (updated.length === 0) {
        await loadProducts();
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete product");
      throw err;
    }
  };

  return {
    products,
    loading,
    error,
    addProduct,
    editProduct,
    removeProduct,
    reloadProducts: loadProducts
  };
};
