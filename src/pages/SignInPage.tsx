import { AuthLayout } from '../components/layouts/AuthLayout';
import { AuthForm } from '../components/forms/AuthForm';
import { useAuthStore } from '../stores/authStore';

export const SignInPage = () => {
  const { login, isLoading, error } = useAuthStore();

  return (
    <AuthLayout
      title="Sign in to your account"
      subtitle="Enter your credentials to continue"
      linkText="Sign up"
      linkPath="/signup"
    >
      <AuthForm
        onSubmit={login}
        isLoading={isLoading}
        error={error}
        buttonText="Sign in"
      />
    </AuthLayout>
  );
};