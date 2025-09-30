import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ 
  size = 'medium', 
  text = 'Loading...', 
  className = '',
  showText = true 
}) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-2 ${className}`}>
      <Loader2 
        className={`${sizeClasses[size]} text-primary-600 animate-spin`}
      />
      {showText && (
        <p className={`text-gray-500 ${textSizeClasses[size]}`}>
          {text}
        </p>
      )}
    </div>
  );
};

// Full page loading component
export const PageLoader = ({ text = 'Loading...' }) => {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <LoadingSpinner size="large" text={text} />
    </div>
  );
};

// Inline loading component for buttons
export const ButtonLoader = () => {
  return (
    <Loader2 className="h-4 w-4 animate-spin" />
  );
};

export default LoadingSpinner; 