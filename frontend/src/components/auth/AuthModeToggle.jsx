import { motion } from 'framer-motion';

export default function AuthModeToggle({ mode, onModeChange, hideRegister = false }) {
  if (hideRegister) {
    return null;
  }

  return (
    <div className="relative flex p-1 bg-muted/30 rounded-xl border border-border/50">
      {['login', 'register'].map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => onModeChange(m)}
          className={`
            relative flex-1 py-2.5 px-6 rounded-lg font-medium text-sm
            transition-colors duration-200 z-10 capitalize
            ${mode === m ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}
          `}
        >
          {mode === m && (
            <motion.div
              layoutId="modeIndicator"
              className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-lg"
              initial={false}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative">{m}</span>
        </button>
      ))}
    </div>
  );
}
