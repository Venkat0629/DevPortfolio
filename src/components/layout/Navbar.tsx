import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, FileText } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { usePortfolio } from '@/context/PortfolioContext';
import { useActiveSection } from '@/hooks/useActiveSection';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';

interface NavbarProps {
  onResumeClick: () => void;
}

export function Navbar({ onResumeClick }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { navigation } = usePortfolio();
  
  const sectionIds = navigation.map((item) => item.href.replace('#', ''));
  const activeSection = useActiveSection(sectionIds);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
          isScrolled
            ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-lg shadow-black/5 dark:shadow-black/20'
            : 'bg-transparent'
        )}
      >
        <nav className="container-custom">
          <div className="flex items-center justify-between h-16 md:h-20">
            <motion.a
              href="#hero"
              className="flex items-center"
              whileHover={{ scale: 1.08, rotate: 2 }}
              whileTap={{ scale: 0.92 }}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#hero');
              }}
            >
              <svg
                width="42"
                height="42"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-lg"
              >
                <defs>
                  <linearGradient id="logo-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#d946ef" />
                  </linearGradient>
                  <linearGradient id="logo-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
                {/* Outer hexagonal shape */}
                <path
                  d="M32 4L56 18V46L32 60L8 46V18L32 4Z"
                  fill="url(#logo-grad-1)"
                  opacity="0.12"
                />
                <path
                  d="M32 4L56 18V46L32 60L8 46V18L32 4Z"
                  stroke="url(#logo-grad-1)"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                {/* Inner code brackets < /> */}
                <path
                  d="M24 22L14 32L24 42"
                  stroke="url(#logo-grad-2)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M40 22L50 32L40 42"
                  stroke="url(#logo-grad-1)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M36 18L28 46"
                  stroke="url(#logo-grad-1)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  opacity="0.7"
                />
              </svg>
            </motion.a>

            <div className="hidden md:flex items-center gap-1">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className={cn(
                    'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                    activeSection === item.href.replace('#', '')
                      ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                  )}
                >
                  {item.name}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </motion.button>

              <Button
                variant="primary"
                size="sm"
                leftIcon={<FileText className="w-4 h-4" />}
                onClick={onResumeClick}
                className={cn('hidden md:flex', isMobileMenuOpen && 'hidden')}
              >
                Resume
              </Button>

              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                whileTap={{ scale: 0.9 }}
                aria-label="Toggle menu"
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.button>
            </div>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 xl:hidden"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-[85vw] max-w-xs bg-white dark:bg-gray-900 shadow-2xl"
            >
              <div className="flex items-center justify-end pt-4 px-4">
                <motion.button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  whileTap={{ scale: 0.9 }}
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
              <div className="flex flex-col h-[calc(100%-64px)] pb-6 px-6">
                <div className="flex flex-col gap-2">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick(item.href);
                      }}
                      className={cn(
                        'px-4 py-3 rounded-xl text-base font-medium transition-all duration-200',
                        activeSection === item.href.replace('#', '')
                          ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                      )}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className="mt-auto">
                  <Button
                    variant="primary"
                    size="md"
                    leftIcon={<FileText className="w-4 h-4" />}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onResumeClick();
                    }}
                    className="w-full"
                  >
                    Resume
                  </Button>
                </div>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
