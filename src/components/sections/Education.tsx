import { motion } from 'framer-motion';
import { GraduationCap, MapPin, Calendar, Award } from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';
import { Section, Card, CardContent } from '@/components/ui';
import { staggerItem } from '@/lib/animations';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export function Education() {
  const { education } = usePortfolio();
  const { ref, isVisible } = useScrollReveal();

  return (
    <Section
      id="education"
      title={education.title}
      subtitle={education.subtitle}
    >
      <div ref={ref} className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6">
          {education.items.map((item, index) => (
            <motion.div
              key={item.id}
              variants={staggerItem}
              initial="hidden"
              animate={isVisible ? 'visible' : 'hidden'}
              transition={{ delay: index * 0.15 }}
            >
              <Card variant="glass" hover glow className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-6 h-6 text-primary-500" />
                    </div>
                    <div className="flex-1">
                      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                        {item.type}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-2">
                        {item.degree}
                      </h3>
                      <p className="text-primary-600 dark:text-primary-400 font-medium text-sm">
                        {item.field}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 font-medium mb-3">
                    {item.institution}
                  </p>

                  <div className="flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{item.startDate} - {item.endDate}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{item.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <Award className="w-4 h-4 text-primary-500" />
                    <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                      {item.grade}
                    </span>
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
