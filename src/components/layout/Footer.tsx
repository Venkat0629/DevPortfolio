import { motion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Twitter, Instagram, Dribbble, Youtube, ArrowUp } from 'lucide-react';
import { HackerRankIcon } from '@/components/icons/HackerRankIcon';
import { CrioIcon } from '@/components/icons/CrioIcon';
import { usePortfolio } from '@/context/PortfolioContext';
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useState, useEffect } from 'react';

const socialIcons: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  instagram: Instagram,
  dribbble: Dribbble,
  youtube: Youtube,
  hackerrank: HackerRankIcon,
  crio: CrioIcon,
};

export function Footer() {
  const { footer, social, navigation } = usePortfolio();
  const { ref, isVisible } = useScrollReveal();
  const [showScrollTop, setShowScrollTop] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const socialLinks = Object.entries(social).filter(([, url]) => url);

  return (
    <footer ref={ref} className="relative bg-background border-t border-border">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-500/5 to-accent-500/5 pointer-events-none" />
      
      <div className="container-custom relative">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
          className="py-8 md:py-10"
        >
          <motion.div
            variants={staggerItem}
            className="rounded-2xl border border-border/80 bg-card/80 backdrop-blur-sm p-5 md:p-6"
          >
            <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-center">
              <div>
                <p className="text-foreground/85 max-w-xl">
                  {'Let us connect and create something meaningful together.'}
                </p>
                <div className="flex flex-wrap items-center gap-3 mt-5">
                  {socialLinks.map(([platform, url]) => {
                    const Icon = socialIcons[platform];
                    if (!Icon) return null;
                    return (
                      <motion.a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-muted text-muted-foreground hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200"
                        whileHover={{ scale: 1.08, y: -2 }}
                        whileTap={{ scale: 0.94 }}
                        aria-label={`Visit ${platform}`}
                      >
                        <Icon className="w-5 h-5" />
                      </motion.a>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">
                  Quick Links
                </h3>
                <ul className="flex flex-wrap gap-2.5">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="inline-flex px-3 py-1.5 rounded-lg text-sm bg-muted text-muted-foreground hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
          className="py-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <p className="text-sm text-muted-foreground">
            {footer.copyright}
          </p>
          <p className="text-sm text-muted-foreground">
            {footer.tagline}
          </p>
        </motion.div>
      </div>

      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            onClick={scrollToTop}
            className="fixed bottom-20 right-6 p-3 rounded-xl bg-primary-500 text-white shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:bg-primary-600 transition-all duration-200 z-30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  );
}
