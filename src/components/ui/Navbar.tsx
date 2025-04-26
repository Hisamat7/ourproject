import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline'
import { Logo } from './Logo'

interface NavbarProps {
  onLogout: () => void
}

export const Navbar = ({ onLogout }: NavbarProps) => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Logo className="h-8" />
            </div>
          </div>
          <div className="ml-4 flex items-center md:ml-6">
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-1" />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}