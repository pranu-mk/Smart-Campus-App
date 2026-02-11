import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function AuthButton({
  children,
  isLoading = false,
  disabled = false,
  variant = 'primary',
  type = 'submit',
  onClick,
  className = '',
}) {
  const variants = {
    primary: `
      bg-gradient-to-r from-primary to-accent text-primary-foreground
      shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30
    `,
    secondary: `
      bg-transparent border-2 border-primary text-primary
      hover:bg-primary hover:text-primary-foreground
    `,
    ghost: `
      bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50
    `,
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      whileHover={!disabled && !isLoading ? { y: -2, scale: 1.01 } : {}}
      whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
      className={`
        relative w-full py-4 px-6 rounded-xl font-semibold
        transition-all duration-300 ease-out
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${className}
      `}
    >
      <motion.span
        initial={false}
        animate={{ opacity: isLoading ? 0 : 1 }}
        className="flex items-center justify-center gap-2"
      >
        {children}
      </motion.span>
      
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Loader2 className="w-5 h-5 animate-spin" />
        </motion.div>
      )}
    </motion.button>
  );
}
