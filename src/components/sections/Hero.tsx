import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ChevronDown, Github, Linkedin, Twitter } from 'lucide-react';
import { HackerRankIcon } from '@/components/icons/HackerRankIcon';
import { CrioIcon } from '@/components/icons/CrioIcon';
import { usePortfolio } from '@/context/PortfolioContext';
import { Button } from '@/components/ui';
import { heroTextVariants, staggerContainer, fadeInUp } from '@/lib/animations';

const socialIcons: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  hackerrank: HackerRankIcon,
  crio: CrioIcon,
};

function CountUp({ value, duration = 2000 }: { value: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  // Extract numeric part and suffix (e.g. "10+" → 10, "+")
  const match = value.match(/^(\d+)(.*)$/);
  const target = match ? parseInt(match[1], 10) : 0;
  const suffix = match ? match[2] : value;

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.round(eased * target);
      setCount(start);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [isInView, target, duration]);

  return (
    <span ref={ref}>
      {isInView ? count : 0}{suffix}
    </span>
  );
}

export function Hero() {
  const { hero, personal, social } = usePortfolio();

  const socialLinks = Object.entries(social)
    .filter(([key, url]) => url && socialIcons[key])
    .slice(0, 5);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-primary-500/30 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-1/3 -right-1/4 w-96 h-96 bg-accent-500/30 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-1/4 left-1/3 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-gray-950" />

      <div className="container-custom relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div
            variants={heroTextVariants}
            custom={0}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            {personal.availability}
          </motion.div>

          <motion.h1
            variants={heroTextVariants}
            custom={1}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6"
          >
            <span className="block text-gray-500 dark:text-gray-400 text-2xl sm:text-3xl md:text-4xl font-normal mb-2">
              {hero.greeting}
            </span>
            <span className="text-gradient-animated">{personal.name}</span>
          </motion.h1>

          <motion.h2
            variants={heroTextVariants}
            custom={2}
            className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-700 dark:text-gray-300 mb-4"
          >
            {hero.headline}
          </motion.h2>

          <motion.p
            variants={heroTextVariants}
            custom={3}
            className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8"
          >
            {hero.subheadline}
          </motion.p>

          <motion.div
            variants={heroTextVariants}
            custom={4}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Button
              size="lg"
              onClick={() => document.querySelector(hero.cta.primary.link)?.scrollIntoView({ behavior: 'smooth' })}
            >
              {hero.cta.primary.text}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => document.querySelector(hero.cta.secondary.link)?.scrollIntoView({ behavior: 'smooth' })}
            >
              {hero.cta.secondary.text}
            </Button>
          </motion.div>

          <motion.div
            variants={heroTextVariants}
            custom={5}
            className="flex items-center justify-center gap-4 mb-12"
          >
            {socialLinks.map(([platform, url]) => {
              const Icon = socialIcons[platform];
              return (
                <motion.a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={`Visit ${platform}`}
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              );
            })}
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="grid grid-cols-3 gap-8 max-w-md mx-auto"
          >
            {hero.stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-gradient mb-1">
                  <CountUp value={stat.value} duration={2000 + index * 500} />
                </div>
                <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            className="flex justify-center mt-12"
          >
            <motion.button
              onClick={() => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })}
              className="p-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              aria-label="Scroll to about section"
            >
              <ChevronDown className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
