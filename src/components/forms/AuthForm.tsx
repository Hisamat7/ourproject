import { useState } from 'react';
import { Button } from '../ui/Button';        // Changed from './Button'
import { Input } from '../ui/Input';         // Changed from './Input'
import { ErrorMessage } from '../ui/ErrorMessage';  // Changed from './ErrorMessage'
import { AuthError } from '../../services/authService';
import { Link } from 'react-router-dom';

interface AuthFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
  error: AuthError | null;
  buttonText: string;
}

export const AuthForm = ({ 
  onSubmit, 
  isLoading, 
  error, 
  buttonText 
}: AuthFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Address"
          required
          autoComplete="email"
        />
        
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          autoComplete="current-password"
        />
      </div>

      <div className="flex items-center justify-between">
        <Link 
          to="/forgot-password" 
          className="text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          Forgot password?
        </Link>
      </div>

      {error && <ErrorMessage message={getAuthErrorMessage(error)} />}

      <Button
        type="submit"
        isLoading={isLoading}
        className="w-full justify-center"
      >
        {buttonText}
      </Button>
    </form>
  );
};

// Helper function remains the same...