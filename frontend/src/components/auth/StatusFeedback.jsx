import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function StatusFeedback({ status, message }) {
  const icons = {
    loading: Loader2,
    success: CheckCircle,
    error: XCircle,
  };

  const colors = {
    loading: 'text-primary',
    success: 'text-green-500',
    error: 'text-destructive',
  };

  const bgColors = {
    loading: 'bg-primary/10 border-primary/20',
    success: 'bg-green-500/10 border-green-500/20',
    error: 'bg-destructive/10 border-destructive/20',
  };

  const Icon = icons[status];

  return (
    <AnimatePresence>
      {status && message && (
        <motion.div
          initial={{ opacity: 0, y: -10, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -10, height: 0 }}
          className={`
            flex items-center gap-3 p-4 rounded-xl border
            ${bgColors[status]}
          `}
        >
          <Icon 
            size={20} 
            className={`${colors[status]} ${status === 'loading' ? 'animate-spin' : ''}`} 
          />
          <span className={`text-sm font-medium ${colors[status]}`}>
            {message}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
