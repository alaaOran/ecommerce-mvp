import { forwardRef } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  children: React.ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading, className, children, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed'
    
    const variants = {
      primary: 'bg-black hover:bg-gray-800 text-white shadow-sm',
      secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900',
      outline: 'border border-gray-300 hover:bg-gray-50 text-gray-700',
      ghost: 'hover:bg-gray-100 text-gray-700'
    }
    
    const sizes = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2.5 text-base',
      lg: 'px-6 py-3 text-lg'
    }

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.985 }}
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        disabled={isLoading}
        aria-busy={isLoading || undefined}
        {...props}
      >
        {isLoading && (
          <span
            className="-ml-1 mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current/30 border-t-current"
            aria-hidden
          />
        )}
        {children}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'

export default Button