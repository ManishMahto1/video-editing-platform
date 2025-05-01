
import React from 'react';

interface Props {
  message?: string;
}

const LoadingSpinner: React.FC<Props> = ({ message = 'Processing...' }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        <p className="mt-4 text-white text-lg font-semibold">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;