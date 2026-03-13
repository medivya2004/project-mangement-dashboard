import { Product } from "../lib/type";

const STORAGE_KEY = "products";

export const getStoredProducts = (): Product[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveStoredProducts = (products: Product[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};

export const fetchProductsFromFakeStore = async (): Promise<Product[]> => {
  const response = await fetch("https://fakestoreapi.com/products");

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = await response.json();

  return data.map((product: any) => ({
    id: product.id,
    title: product.title,
    price: product.price,
    description: product.description,
    category: product.category,
    image: product.image,
    rating_rate: product.rating?.rate || 0,
    rating_count: product.rating?.count || 0,
    stock_status: "In Stock",
  }));
};

export const initializeProducts = async (): Promise<Product[]> => {
  const storedProducts = getStoredProducts();

  if (storedProducts.length > 0) {
    return storedProducts;
  }

  const apiProducts = await fetchProductsFromFakeStore();
  saveStoredProducts(apiProducts);

  return apiProducts;
};
