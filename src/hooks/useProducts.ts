import { useState, useEffect, useCallback } from 'react';
import { Product, ProductFormData } from '../lib/supabase';
import {
  initializeProducts,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from '../services/api';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await initializeProducts();
      const data = await getAllProducts();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
      console.error('Error loading products:', err);
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
      const newProduct = await createProduct(productData);
      setProducts(prev => [...prev, newProduct]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add product');
      throw err;
    }
  };

  const editProduct = async (id: number, productData: ProductFormData): Promise<void> => {
    try {
      setError(null);
      const updatedProduct = await updateProduct(id, productData);
      setProducts(prev =>
        prev.map(p => (p.id === id ? updatedProduct : p))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product');
      throw err;
    }
  };

  const removeProduct = async (id: number): Promise<void> => {
    try {
      setError(null);
      await deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
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
