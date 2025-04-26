import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { SignInPage } from '../pages/SignInPage';
import { SignUpPage } from '../pages/SignUpPage';
import { DashboardPage } from '../pages/DashboardPage';
import { AuthLayout } from '../components/layouts/AuthLayout';
import { MainLayout } from '../components/layouts/MainLayout';
import { ProtectedRoute } from './ProtectedRoute';

const router = createBrowserRouter([
  {
    element: (
      <AuthLayout>
        <Outlet />  {/* This renders the child routes */}
      </AuthLayout>
    ),
    children: [
      {
        path: '/',
        element: <SignInPage />,
      },
      {
        path: '/signup',
        element: <SignUpPage />,
      },
    ],
  },
  {
    element: (
      <ProtectedRoute>
        <MainLayout>
          <Outlet />  {/* This renders the child routes */}
        </MainLayout>
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
    ],
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;