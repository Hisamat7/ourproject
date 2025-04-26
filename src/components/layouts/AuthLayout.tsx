import { ReactNode } from 'react';
import { Logo } from '../ui/Logo';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  linkText?: string;
  linkPath?: string;
}

export const AuthLayout = ({
  children,
  title = "Welcome back",
  subtitle = "Firebase Auth",
  linkText = "Sign up",
  linkPath = "/signup"
}: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <Logo className="mx-auto h-12 w-auto" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">{title}</h2>
            <p className="mt-2 text-sm text-gray-600">
              {subtitle}
            </p>
          </div>
          
          {children}
          
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">
              {linkText === "Sign up" ? "Don't have an account?" : "Already have an account?"}
            </span>
            <Link
              to={linkPath}
              className="ml-1 font-medium text-blue-600 hover:text-blue-500"
            >
              {linkText}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};