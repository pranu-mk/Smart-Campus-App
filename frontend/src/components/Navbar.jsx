import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const servicesDropdown = [
  { name: 'Hostel Complaints', path: '/services/hostel-complaints' },
  { name: 'Student Helpdesk', path: '/services/student-helpdesk' },
  { name: 'Student Clubs', path: '/services/student-clubs' },
  { name: 'Digital Notices', path: '/services/digital-notices' },
  { name: 'Campus Events', path: '/services/campus-events' },
  { name: 'Placements', path: '/services/placements' },
  { name: 'Scholarships', path: '/services/scholarships' },
];

const campusDropdown = [
  { name: 'Latest News', path: '/latest-news' },
  { name: 'Upcoming Holidays', path: '/holidays' },
  { name: 'Contact Us', path: '/contact' },
  { name: 'FAQs', path: '/faqs' },
];

const themeOptions = [
  { id: 'light', label: 'Light', icon: '☀️' },
  { id: 'dark', label: 'Dark', icon: '🌙' },
  { id: 'fancy', label: 'Fancy', icon: '✨' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { theme, setTheme } = useTheme();
  
  // Refs for dropdown containers to handle hover properly
  const servicesRef = useRef(null);
  const campusRef = useRef(null);
  const closeTimeoutRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target) &&
          campusRef.current && !campusRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
      setThemeMenuOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Fixed dropdown handlers - use delayed close to prevent flickering
  const handleMouseEnter = (dropdown) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveDropdown(dropdown);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150); // Small delay to allow cursor to move to dropdown
  };

  const DropdownMenu = ({ items, isOpen }) => (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="absolute top-full left-0 pt-2 z-50"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Invisible bridge to prevent gap issues */}
          <div className="absolute -top-2 left-0 right-0 h-2" />
          <div className="glass-card p-2 min-w-[200px] border border-border/50 shadow-lg">
            {items.map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03, duration: 0.2 }}
              >
                <Link
                  to={item.path}
                  className="block px-4 py-2.5 rounded-lg hover:bg-muted text-sm font-medium transition-colors"
                  onClick={() => setActiveDropdown(null)}
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-background/80 backdrop-blur-xl shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/">
            <motion.div className="flex items-center gap-3" whileHover={{ scale: 1.02 }}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">S</span>
              </div>
              <span className="font-display font-bold text-xl">SmartCampus</span>
            </motion.div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <Link to="/" className="nav-link">Home</Link>
            
            {/* Services Dropdown - Fixed hover behavior */}
            <div 
              ref={servicesRef}
              className="relative"
              onMouseEnter={() => handleMouseEnter('services')}
              onMouseLeave={handleMouseLeave}
            >
              <button className="nav-link flex items-center gap-1">
                Services
                <motion.svg 
                  className="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  animate={{ rotate: activeDropdown === 'services' ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </motion.svg>
              </button>
              <DropdownMenu items={servicesDropdown} isOpen={activeDropdown === 'services'} />
            </div>

            {/* Campus Dropdown - Fixed hover behavior */}
            <div 
              ref={campusRef}
              className="relative"
              onMouseEnter={() => handleMouseEnter('campus')}
              onMouseLeave={handleMouseLeave}
            >
              <button className="nav-link flex items-center gap-1">
                Campus
                <motion.svg 
                  className="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  animate={{ rotate: activeDropdown === 'campus' ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </motion.svg>
              </button>
              <DropdownMenu items={campusDropdown} isOpen={activeDropdown === 'campus'} />
            </div>

            <Link to="/blogs" className="nav-link">Blogs</Link>
            <Link to="/about-platform" className="nav-link">About</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <motion.button
                onClick={(e) => { e.stopPropagation(); setThemeMenuOpen(!themeMenuOpen); }}
                className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-lg hover:bg-muted/80"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {themeOptions.find(t => t.id === theme)?.icon}
              </motion.button>
              <AnimatePresence>
                {themeMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 glass-card p-2 min-w-[140px] z-50 border border-border/50"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {themeOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => { setTheme(option.id); setThemeMenuOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                          theme === option.id ? 'bg-primary/20 text-primary' : 'hover:bg-muted'
                        }`}
                      >
                        <span>{option.icon}</span>
                        <span className="font-medium">{option.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="hidden sm:flex items-center gap-3">
              <Link to="/login"><motion.button className="px-5 py-2.5 rounded-xl font-medium hover:text-primary" whileHover={{ scale: 1.02 }}>Login</motion.button></Link>
              <Link to="/register"><motion.button className="btn-primary" whileHover={{ scale: 1.02 }}>Register</motion.button></Link>
            </div>

            <motion.button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden w-10 h-10 rounded-xl bg-muted flex items-center justify-center" whileTap={{ scale: 0.95 }}>
              <div className="flex flex-col gap-1.5">
                <motion.span animate={{ rotate: mobileMenuOpen ? 45 : 0, y: mobileMenuOpen ? 6 : 0 }} className="w-5 h-0.5 bg-foreground rounded-full" />
                <motion.span animate={{ opacity: mobileMenuOpen ? 0 : 1 }} className="w-5 h-0.5 bg-foreground rounded-full" />
                <motion.span animate={{ rotate: mobileMenuOpen ? -45 : 0, y: mobileMenuOpen ? -6 : 0 }} className="w-5 h-0.5 bg-foreground rounded-full" />
              </div>
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden overflow-hidden">
              <div className="py-4 space-y-2">
                <Link to="/" className="block px-4 py-3 rounded-xl hover:bg-muted font-medium" onClick={() => setMobileMenuOpen(false)}>Home</Link>
                <Link to="/services" className="block px-4 py-3 rounded-xl hover:bg-muted font-medium" onClick={() => setMobileMenuOpen(false)}>Services</Link>
                <Link to="/campus" className="block px-4 py-3 rounded-xl hover:bg-muted font-medium" onClick={() => setMobileMenuOpen(false)}>Campus</Link>
                <Link to="/blogs" className="block px-4 py-3 rounded-xl hover:bg-muted font-medium" onClick={() => setMobileMenuOpen(false)}>Blogs</Link>
                <Link to="/about-platform" className="block px-4 py-3 rounded-xl hover:bg-muted font-medium" onClick={() => setMobileMenuOpen(false)}>About</Link>
                <Link to="/contact" className="block px-4 py-3 rounded-xl hover:bg-muted font-medium" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
                <div className="flex gap-3 pt-4 px-4">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="flex-1 py-3 rounded-xl border-2 border-primary text-primary font-medium text-center">Login</Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="flex-1 btn-primary text-center">Register</Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}