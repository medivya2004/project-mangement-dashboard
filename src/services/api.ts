import { Product, ProductFormData } from "../lib/type";

const STORAGE_KEY = "products";

let products: Product[] = [];

// Load from localStorage
const loadProducts = (): Product[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

// Save to localStorage
const saveProducts = (data: Product[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// Fetch initial products from FakeStore API
export const fetchProductsFromFakeStore = async (): Promise<Product[]> => {
  const response = await fetch("https://fakestoreapi.com/products");

  if (!response.ok) {
    throw new Error("Failed to fetch products from FakeStore API");
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

// Initialize products
export const initializeProducts = async (): Promise<void> => {
  const storedProducts = loadProducts();

  if (storedProducts.length > 0) {
    products = storedProducts;
    return;
  }

  const apiProducts = await fetchProductsFromFakeStore();
  products = apiProducts;
  saveProducts(products);
};

// Get all products
export const getAllProducts = async (): Promise<Product[]> => {
  products = loadProducts();
  return products.sort((a, b) => a.id - b.id);
};

// Create product
export const createProduct = async (
  productData: ProductFormData
): Promise<Product> => {
  products = loadProducts();

  const newProduct: Product = {
    id: Date.now(),
    ...productData,
    rating_rate: 0,
    rating_count: 0,
    image:
      "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg",
  };

  products.push(newProduct);
  saveProducts(products);

  return newProduct;
};

// Update product
export const updateProduct = async (
  id: number,
  productData: ProductFormData
): Promise<Product> => {
  products = loadProducts();

  const index = products.findIndex((p) => p.id === id);

  if (index === -1) {
    throw new Error("Product not found");
  }

  products[index] = {
    ...products[index],
    ...productData,
  };

  saveProducts(products);

  return products[index];
};

// Delete product
export const deleteProduct = async (id: number): Promise<void> => {
  products = loadProducts();

  products = products.filter((product) => product.id !== id);

  saveProducts(products);
};