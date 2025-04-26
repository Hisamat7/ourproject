import { ReactNode } from 'react';
import { Spinner } from './Spinner';

interface ButtonProps {
  children: ReactNode;
  type?: 'button' | 'submit' | 'reset';
  isLoading?: boolean;
  className?: string;
}

export const Button = ({
  children,
  type = 'button',
  isLoading = false,
  className = '',
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      disabled={isLoading}
      className={`flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Spinner className="mr-2" />
          Processing...
        </>
      ) : (
        children
      )}
    </button>
  );
};