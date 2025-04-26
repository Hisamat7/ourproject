import { ReactNode } from 'react';
import { Logo } from '../ui/Logo'; // Fixed import path and case
import { Navbar } from '../ui/Navbar'; // Fixed import path
import { useAuthActions } from '../../stores/authStore'; // Fixed import path

interface MainLayoutProps {
  children: ReactNode;
}

/**
 * Main application layout component
 * @param {MainLayoutProps} props - Component props
 * @param {ReactNode} props.children - Child components to render
 * @returns {JSX.Element} Main layout container
 */
export const MainLayout = ({ children }: MainLayoutProps) => {
  const { setUser } = useAuthActions(); // Corrected to use existing action

  const handleLogout = () => {
    // Implement your logout logic here
    setUser(null); // Using available action from authStore
    // You might want to call your authService.logout() here as well
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onLogout={handleLogout} />
      
      <div className="py-10">
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Logo className="h-8" /> {/* Added Logo component */}
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
              Dashboard
            </h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};