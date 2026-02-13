import { motion } from 'framer-motion';
import { Monitor, Server, Wrench, Code, Database, Cloud } from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';
import { Section, Card, CardContent } from '@/components/ui';
import { staggerItem, progressBar } from '@/lib/animations';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { getTechIconUrl } from '@/lib/techIcons';

const iconMap: Record<string, typeof Monitor> = {
  Monitor: Monitor,
  Server: Server,
  Wrench: Wrench,
  Code: Code,
  Database: Database,
  Cloud: Cloud,
};

export function Skills() {
  const { skills } = usePortfolio();
  const { ref, isVisible } = useScrollReveal();

  return (
    <Section id="skills" title={skills.title} subtitle={skills.subtitle}>
      <div ref={ref} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {skills.categories.map((category, categoryIndex) => {
          const Icon = iconMap[category.icon] || Code;
          
          return (
            <motion.div
              key={category.name}
              variants={staggerItem}
              initial="hidden"
              animate={isVisible ? 'visible' : 'hidden'}
              transition={{ delay: categoryIndex * 0.1 }}
            >
              <Card variant="glass" hover glow className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {category.name}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {category.skills.map((skill, skillIndex) => (
                      <div key={skill.name}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
                            {getTechIconUrl(skill.name) && (
                              <img
                                src={getTechIconUrl(skill.name)!}
                                alt={skill.name}
                                className="w-4 h-4 object-contain"
                                loading="lazy"
                              />
                            )}
                            {skill.name}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {skill.level}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                            variants={progressBar}
                            custom={skill.level}
                            initial="hidden"
                            animate={isVisible ? 'visible' : 'hidden'}
                            transition={{ delay: categoryIndex * 0.1 + skillIndex * 0.05 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
