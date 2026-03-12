import { Loader2 } from 'lucide-react';

export const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      <p className="mt-4 text-gray-600 font-medium">Loading products...</p>
    </div>
  );
};
