import { motion } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';
import { Section, Card, CardContent } from '@/components/ui';
import { staggerItem } from '@/lib/animations';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { formatDate, calculateDuration } from '@/lib/utils';
import { getTechIconUrl } from '@/lib/techIcons';

export function Experience() {
  const { experience } = usePortfolio();
  const { ref, isVisible } = useScrollReveal();

  return (
    <Section
      id="experience"
      title={experience.title}
      subtitle={experience.subtitle}
      className="bg-gray-50/50 dark:bg-gray-900/30"
    >
      <div ref={ref} className="relative max-w-4xl mx-auto">
        <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary-500 via-accent-500 to-primary-500 hidden md:block" />

        <div className="space-y-8">
          {experience.positions.map((position, index) => (
            <motion.div
              key={position.id}
              variants={staggerItem}
              initial="hidden"
              animate={isVisible ? 'visible' : 'hidden'}
              transition={{ delay: index * 0.15 }}
              className={`relative md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:ml-0' : 'md:pl-12 md:ml-auto'}`}
            >
              <div className="hidden md:block absolute top-8 w-4 h-4 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 border-4 border-white dark:border-gray-950 shadow-lg"
                style={{ [index % 2 === 0 ? 'right' : 'left']: '-8px' }}
              />

              <Card variant="glass" hover glow>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      {position.logo && (
                        <div className="w-14 h-14 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
                          <img
                            src={position.logo}
                            alt={`${position.company} logo`}
                            className="w-12 h-12 object-contain"
                            loading="lazy"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                            {position.type}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          {position.position}
                        </h3>
                        <p className="text-primary-600 dark:text-primary-400 font-medium">
                          {position.website ? (
                            <a
                              href={position.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline hover:text-primary-500 dark:hover:text-primary-300 transition-colors"
                            >
                              {position.company} ↗
                            </a>
                          ) : (
                            position.company
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {formatDate(position.startDate)} - {formatDate(position.endDate)}
                      </span>
                      <span className="text-gray-400 dark:text-gray-500">
                        ({calculateDuration(position.startDate, position.endDate)})
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{position.location}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {position.description}
                  </p>

                  <ul className="space-y-2 mb-4">
                    {position.highlights.map((highlight, hIndex) => (
                      <li key={hIndex} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                        {highlight}
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-2">
                    {position.technologies.map((tech) => {
                      const iconUrl = getTechIconUrl(tech);
                      return (
                        <span
                          key={tech}
                          className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                        >
                          {iconUrl && (
                            <img
                              src={iconUrl}
                              alt={tech}
                              className="w-4 h-4 object-contain"
                              loading="lazy"
                            />
                          )}
                          {tech}
                        </span>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
