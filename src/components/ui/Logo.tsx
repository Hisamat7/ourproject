interface LogoProps {
    className?: string
  }
  
  export const Logo = ({ className = '' }: LogoProps) => {
    return (
      <div className={`font-bold text-xl text-indigo-600 ${className}`}>
        Firebase Auth
      </div>
    )
  }