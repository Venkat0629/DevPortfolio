import { forwardRef, type HTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { useScrollReveal } from '@/hooks/useScrollReveal';

interface SectionProps extends HTMLAttributes<HTMLElement> {
  title?: string;
  subtitle?: string;
  centered?: boolean;
  fullHeight?: boolean;
}

const Section = forwardRef<HTMLElement, SectionProps>(
  ({ className, title, subtitle, centered = true, fullHeight = false, children, id, ...props }, ref) => {
    const { ref: revealRef, isVisible } = useScrollReveal<HTMLDivElement>();

    return (
      <section
        ref={ref}
        id={id}
        className={cn(
          'section-padding relative overflow-hidden',
          fullHeight && 'min-h-screen flex flex-col justify-center',
          className
        )}
        {...props}
      >
        <div ref={revealRef} className="container-custom">
          {(title || subtitle) && (
            <motion.div
              className={cn('mb-8 md:mb-10', centered && 'text-center')}
              variants={fadeInUp}
              initial="hidden"
              animate={isVisible ? 'visible' : 'hidden'}
            >
              {subtitle && (
                <span className="inline-block text-primary-500 dark:text-primary-400 font-medium text-sm uppercase tracking-wider mb-3">
                  {subtitle}
                </span>
              )}
              {title && (
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
                  {title}
                </h2>
              )}
            </motion.div>
          )}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={isVisible ? 'visible' : 'hidden'}
          >
            {children}
          </motion.div>
        </div>
      </section>
    );
  }
);

Section.displayName = 'Section';

export { Section };
