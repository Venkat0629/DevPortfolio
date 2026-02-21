import { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, ExternalLink, Calendar, Shield } from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';
import { Section, Card, CardContent } from '@/components/ui';
import { staggerItem } from '@/lib/animations';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  Cloud: {
    bg: 'bg-sky-100 dark:bg-sky-900/30',
    text: 'text-sky-700 dark:text-sky-300',
    border: 'border-sky-200 dark:border-sky-800',
  },
  Developer: {
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-200 dark:border-emerald-800',
  },
  Community: {
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-200 dark:border-amber-800',
  },
};

export function Certifications() {
  const { certifications } = usePortfolio();
  const { ref, isVisible } = useScrollReveal();
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(certifications.items.map((c) => c.category)))];

  const filtered =
    activeCategory === 'All'
      ? certifications.items
      : certifications.items.filter((c) => c.category === activeCategory);

  const renderCertificationCard = (cert: (typeof filtered)[number]) => {
    const colors = categoryColors[cert.category] || categoryColors.Developer;

    return (
      <Card variant="glass" hover glow className="h-full group">
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center flex-shrink-0 p-1.5">
              <img
                src={cert.logo}
                alt={cert.issuer}
                className="w-full h-full object-contain"
              />
            </div>
            <span
              className={`px-2.5 py-1 text-xs font-semibold rounded-full ${colors.bg} ${colors.text}`}
            >
              {cert.category}
            </span>
          </div>

          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1 leading-tight">
            {cert.name}
          </h3>
          <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 mb-3">
            <Shield className="w-3.5 h-3.5" />
            <span>{cert.issuer}</span>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>{cert.date}</span>
            </div>
            {cert.credentialUrl && (
              <a
                href={cert.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
              >
                Verify
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Section
      id="certifications"
      title={certifications.title}
      subtitle={certifications.subtitle}
    >
      <div ref={ref} className="max-w-5xl mx-auto">
        {/* Category filter tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Certification cards grid */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-5">
          {filtered.map((cert, index) => {
            return (
              <motion.div
                key={cert.id}
                variants={staggerItem}
                initial="hidden"
                animate={isVisible ? 'visible' : 'hidden'}
                transition={{ delay: index * 0.1 }}
                layout
              >
                {renderCertificationCard(cert)}
              </motion.div>
            );
          })}
        </div>

        <div className="lg:hidden -mx-4 px-4">
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2">
            {filtered.map((cert, index) => (
              <motion.div
                key={cert.id}
                variants={staggerItem}
                initial="hidden"
                animate={isVisible ? 'visible' : 'hidden'}
                transition={{ delay: index * 0.08 }}
                layout
                className="snap-center shrink-0 w-[88%] sm:w-[70%] md:w-[55%]"
              >
                {renderCertificationCard(cert)}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Summary stats */}
        <div className="flex flex-wrap justify-center gap-6 mt-10">
          {categories
            .filter((c) => c !== 'All')
            .map((cat) => {
              const count = certifications.items.filter((c) => c.category === cat).length;
              const colors = categoryColors[cat] || categoryColors.Developer;
              return (
                <div
                  key={cat}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl ${colors.bg} ${colors.border} border`}
                >
                  <Award className={`w-4 h-4 ${colors.text}`} />
                  <span className={`text-sm font-medium ${colors.text}`}>
                    {count} {cat}
                  </span>
                </div>
              );
            })}
        </div>
      </div>
    </Section>
  );
}
