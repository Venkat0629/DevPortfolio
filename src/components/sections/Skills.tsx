import { motion } from 'framer-motion';
import { Monitor, Server, Wrench, Code, Database, Cloud } from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';
import { Section, Card, CardContent } from '@/components/ui';
import { staggerItem } from '@/lib/animations';
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
    <Section
      id="skills"
      title={skills.title}
      subtitle={skills.subtitle}
      className="bg-gradient-to-b from-white via-primary-50/40 to-white dark:from-gray-950 dark:via-primary-900/10 dark:to-gray-950"
    >
      <div ref={ref} className="space-y-8">
        <motion.div
          variants={staggerItem}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
          className="relative overflow-hidden rounded-3xl border border-primary-100 dark:border-primary-900/40 bg-white/80 dark:bg-gray-900/70 backdrop-blur-xl p-5 md:p-7"
        >
          <div className="absolute -top-16 -right-10 w-44 h-44 rounded-full bg-primary-400/20 blur-3xl" />
          <div className="absolute -bottom-16 -left-8 w-44 h-44 rounded-full bg-accent-400/20 blur-3xl" />
          <p className="relative text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
            End-to-end product engineering across enterprise systems and customer-facing apps. I architect scalable
            backends, build clean frontends, and ship cloud-native deployments with a strong focus on reliability and
            performance.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {skills.categories.map((category, categoryIndex) => {
            const Icon = iconMap[category.icon] || Code;

            return (
              <motion.div
                key={category.name}
                variants={staggerItem}
                initial="hidden"
                animate={isVisible ? 'visible' : 'hidden'}
                transition={{ delay: categoryIndex * 0.08 }}
              >
                <Card variant="glass" hover glow className="h-full border border-primary-100/80 dark:border-primary-900/30">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between gap-4 mb-5">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/25">
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
                          {category.name}
                        </h3>
                      </div>
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                        {category.skills.length} Skills
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2.5">
                      {category.skills.map((skill, skillIndex) => (
                        <motion.div
                          key={skill.name}
                          initial={{ opacity: 0, y: 8 }}
                          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                          transition={{ delay: categoryIndex * 0.08 + skillIndex * 0.03 }}
                          whileHover={{ y: -2 }}
                          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/80 text-sm text-gray-700 dark:text-gray-200"
                        >
                          {getTechIconUrl(skill.name) && (
                            <img
                              src={getTechIconUrl(skill.name)!}
                              alt={skill.name}
                              className="w-4 h-4 object-contain"
                              loading="lazy"
                            />
                          )}
                          <span className="font-medium">{skill.name}</span>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
