import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Briefcase } from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';
import { Section } from '@/components/ui';
import { staggerItem, fadeInLeft, fadeInRight } from '@/lib/animations';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const aboutImages = [
  '/images/about-1.jpg',
  '/images/about-2.jpg',
  '/images/about-3.jpg',
];

export function About() {
  const { about } = usePortfolio();
  const { ref, isVisible } = useScrollReveal();
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveImg((prev) => (prev + 1) % aboutImages.length);
    }, 3000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <Section
      id="about"
      title={about.title}
      subtitle={about.subtitle}
      className="bg-gray-50/50 dark:bg-gray-900/30"
    >
      <div ref={ref} className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <motion.div
          variants={fadeInLeft}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
          className="relative"
        >
          <div className="relative max-w-md mx-auto lg:mx-0">
            {/* Background decorative gradients */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-accent-500 rounded-3xl rotate-6 opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-accent-500 rounded-3xl -rotate-3 opacity-10" />

            {/* Main image card */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[3/4] cursor-pointer"
              onClick={() => setActiveImg((prev) => (prev + 1) % aboutImages.length)}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImg}
                  src={aboutImages[activeImg]}
                  alt="About me"
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                />
              </AnimatePresence>

              {/* Gradient overlay at bottom */}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />
            </div>

            {/* Thumbnail cards */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
              {aboutImages.map((img, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => setActiveImg(idx)}
                  className={`w-16 h-16 rounded-xl overflow-hidden shadow-lg border-2 transition-all duration-300 ${
                    idx === activeImg
                      ? 'border-primary-500 scale-110 ring-2 ring-primary-500/30'
                      : 'border-white dark:border-gray-700 opacity-70 hover:opacity-100'
                  }`}
                  whileHover={{ scale: idx === activeImg ? 1.1 : 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img src={img} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                </motion.button>
              ))}
            </div>

            {/* Experience badge */}
            <motion.div
              className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-xl"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-primary-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">4+</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Years Exp.</div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          variants={fadeInRight}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
        >
          <div className="space-y-4 mb-8">
            {about.description.map((paragraph, index) => (
              <motion.p
                key={index}
                variants={staggerItem}
                className="text-gray-600 dark:text-gray-400 leading-relaxed"
              >
                {paragraph}
              </motion.p>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {about.highlights.map((highlight, index) => (
              <motion.div
                key={index}
                variants={staggerItem}
                className="flex items-center gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-primary-500" />
                </div>
                <span className="text-gray-700 dark:text-gray-300 text-sm">{highlight}</span>
              </motion.div>
            ))}
          </div>

        </motion.div>
      </div>
    </Section>
  );
}
