interface ErrorMessageProps {
    message: string
  }
  
  export const ErrorMessage = ({ message }: ErrorMessageProps) => {
    return (
      <div className="text-sm text-red-600">
        {message}
      </div>
    )
  }