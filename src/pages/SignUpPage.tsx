import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/layouts/AuthLayout'
import { AuthForm } from '../components/forms/AuthForm'
import { AuthService } from '../services/authService'
import { 
  useAuthUser,
  useAuthLoading,
  useAuthError,
  useAuthActions 
} from '../stores/authStore'

export const SignUpPage = () => {
  const navigate = useNavigate()
  const user = useAuthUser()
  const isLoading = useAuthLoading()
  const error = useAuthError()
  const { setUser, setLoading, setError } = useAuthActions()

  useEffect(() => {
    if (user) {
      navigate('/dashboard')
    }
  }, [user, navigate])

  const handleSubmit = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    
    const response = await AuthService.register(email, password)
    
    if (response.success) {
      setUser(response.user)
    } else {
      setError(response.error ?? null)
    }
    
    setLoading(false)
  }

  return (
    <AuthLayout 
      title="Create new account"
      subtitle="Already have an account?"
      subtitleLink={{
        text: 'Sign in',
        to: '/'
      }}
    >
      <AuthForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
        buttonText="Sign up"
      />
    </AuthLayout>
  )
}