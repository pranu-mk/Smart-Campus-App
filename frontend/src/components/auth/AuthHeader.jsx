import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Sparkles, Zap } from 'lucide-react';

export default function AuthHeader() {
  const { theme, setTheme } = useTheme();

  const themeIcons = {
    light: Sun,
    dark: Moon,
    fancy: Sparkles,
  };

  const nextTheme = {
    light: 'dark',
    dark: 'fancy',
    fancy: 'light',
  };

  const ThemeIcon = themeIcons[theme];

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.5 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center"
          >
            <Zap className="w-5 h-5 text-primary-foreground" />
          </motion.div>
          <span className="font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors">
            SmartCampus
          </span>
        </Link>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setTheme(nextTheme[theme])}
          className="p-3 rounded-xl bg-muted/50 border border-border hover:border-primary/50 transition-colors"
        >
          <ThemeIcon size={20} className="text-foreground" />
        </motion.button>
      </div>
    </motion.header>
  );
}
