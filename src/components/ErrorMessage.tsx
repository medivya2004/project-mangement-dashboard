import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="bg-red-50 rounded-full p-4 mb-4">
        <AlertCircle className="w-12 h-12 text-red-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h3>
      <p className="text-gray-600 mb-6 text-center max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
};
