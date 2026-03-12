import { useState, useEffect, useCallback } from 'react';

export interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
}

export type ProductFormData = {
  name: string;
  price: number;
  description?: string;
};

const STORAGE_KEY = "products";

const getStoredProducts = (): Product[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

const saveProducts = (products: Product[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = getStoredProducts();
      console.log(data)
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

  const addProduct = async (productData: ProductFormData): Promise<void> => {
    try {
      setError(null);

      const existing = getStoredProducts();

      const newProduct: Product = {
        id: Date.now(),
        ...productData
      };

      const updated = [...existing, newProduct];

      saveProducts(updated);
      setProducts(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add product");
      throw err;
    }
  };

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

      saveProducts(updated);
      setProducts(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update product");
      throw err;
    }
  };

  const removeProduct = async (id: number): Promise<void> => {
    try {
      setError(null);

      const existing = getStoredProducts();

      const updated = existing.filter((p) => p.id !== id);

      saveProducts(updated);
      setProducts(updated);
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