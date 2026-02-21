import { motion } from 'framer-motion';
import { BriefcaseBusiness, Building2, ShoppingCart, Utensils, Rocket, Cog } from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';
import { Section, Card, CardContent } from '@/components/ui';
import { staggerItem } from '@/lib/animations';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const iconMap: Record<number, typeof BriefcaseBusiness> = {
  0: BriefcaseBusiness,
  1: Building2,
  2: ShoppingCart,
  3: Utensils,
  4: Rocket,
  5: Cog,
};

export function Services() {
  const { services } = usePortfolio();
  const { ref, isVisible } = useScrollReveal();

  return (
    <Section
      id="services"
      title={services.title}
      subtitle={services.subtitle}
      className="bg-gray-50/50 dark:bg-gray-900/30"
    >
      <div ref={ref} className="max-w-6xl mx-auto">
        <motion.p
          variants={staggerItem}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
          className="text-gray-600 dark:text-gray-400 text-center max-w-3xl mx-auto mb-10"
        >
          {services.intro}
        </motion.p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.offerings.map((offering, index) => {
            const Icon = iconMap[index] ?? BriefcaseBusiness;
            return (
              <motion.div
                key={offering.title}
                variants={staggerItem}
                initial="hidden"
                animate={isVisible ? 'visible' : 'hidden'}
                transition={{ delay: index * 0.08 }}
              >
                <Card variant="glass" hover glow className="h-full">
                  <CardContent className="p-6">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {offering.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {offering.description}
                    </p>
                    <ul className="space-y-2 mb-4">
                      {offering.outcomes.map((outcome) => (
                        <li key={outcome} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                          {outcome}
                        </li>
                      ))}
                    </ul>
                    <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs font-medium text-primary-600 dark:text-primary-400">
                        Engagement: {offering.engagement}
                      </p>
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

