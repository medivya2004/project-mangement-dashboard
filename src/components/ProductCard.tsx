import { CreditCard as Edit2, Trash2, Star } from 'lucide-react';
import { Product } from '../lib/supabase';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

export const ProductCard = ({ product, onEdit, onDelete }: ProductCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-100">
      <div className="aspect-square bg-gray-50 flex items-center justify-center p-6">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-contain"
        />
      </div>

      <div className="p-5">
        <div className="mb-3">
          <span className="inline-block px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded-full">
            {product.category}
          </span>
        </div>

        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">
          {product.title}
        </h3>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium text-gray-700">
              {product.rating_rate.toFixed(1)}
            </span>
          </div>
          <span className="text-sm text-gray-500">
            ({product.rating_count})
          </span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          <span className={`px-2 py-1 text-xs font-medium rounded ${
            product.stock_status === 'In Stock'
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-700'
          }`}>
            {product.stock_status}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(product)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
