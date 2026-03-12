import { useState, useMemo } from 'react';
import { Plus, Package } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/ProductCard';
import { ProductForm } from '../components/ProductForm';
import { SearchBar } from '../components/SearchBar';
import { Pagination } from '../components/Pagination';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { Product, ProductFormData } from '../lib/supabase';

const ITEMS_PER_PAGE = 10;
const CATEGORIES = ['All', 'electronics', 'jewelery', 'men\'s clothing', 'women\'s clothing'];

export const Dashboard = () => {
  const { products, loading, error, addProduct, editProduct, removeProduct, reloadProducts } = useProducts();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDeleteProduct = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await removeProduct(id);
      if (paginatedProducts.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const handleFormSubmit = async (data: ProductFormData) => {
    if (editingProduct) {
      await editProduct(editingProduct.id, data);
    } else {
      await addProduct(data);
    }
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ErrorMessage message={error} onRetry={reloadProducts} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-3 rounded-xl">
                <Package className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
                <p className="text-gray-600 mt-1">Manage your product catalog</p>
              </div>
            </div>
            <button
              onClick={handleAddProduct}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
            >
              <Plus className="w-5 h-5" />
              Add Product
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Products
              </label>
              <SearchBar
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search by product name..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              >
                {CATEGORIES.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm">
            <p className="text-gray-600">
              Showing <span className="font-semibold text-gray-900">{paginatedProducts.length}</span> of{' '}
              <span className="font-semibold text-gray-900">{filteredProducts.length}</span> products
            </p>
            {filteredProducts.length !== products.length && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setCurrentPage(1);
                }}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {paginatedProducts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || selectedCategory !== 'All'
                ? 'Try adjusting your search or filter criteria'
                : 'Get started by adding your first product'}
            </p>
            {!searchQuery && selectedCategory === 'All' && (
              <button
                onClick={handleAddProduct}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Your First Product
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={handleEditProduct}
                  onDelete={handleDeleteProduct}
                />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>

      {showForm && (
        <ProductForm
          product={editingProduct}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  );
};
