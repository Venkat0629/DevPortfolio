import { forwardRef, type HTMLAttributes } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { cardHover } from '@/lib/animations';

interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onAnimationStart' | 'onDrag' | 'onDragEnd' | 'onDragStart'> {
  variant?: 'default' | 'glass' | 'gradient' | 'outline';
  hover?: boolean;
  glow?: boolean;
}

const variantStyles = {
  default: 'bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50',
  glass: 'bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/20 dark:border-gray-700/30',
  gradient: 'bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700/50',
  outline: 'bg-transparent border-2 border-gray-200 dark:border-gray-700',
};

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', hover = false, glow = false, children, ...props }, ref) => {
    const baseStyles = cn(
      'rounded-2xl shadow-lg shadow-black/5 dark:shadow-black/20 overflow-hidden',
      variantStyles[variant],
      hover && 'cursor-pointer',
      glow && 'relative group',
      className
    );

    if (hover) {
      return (
        <motion.div
          ref={ref}
          className={baseStyles}
          variants={cardHover}
          initial="rest"
          whileHover="hover"
          {...(props as HTMLMotionProps<'div'>)}
        >
          {glow && <GlowEffect />}
          {children}
        </motion.div>
      );
    }

    return (
      <div ref={ref} className={baseStyles} {...props}>
        {glow && <GlowEffect />}
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

function GlowEffect() {
  return (
    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none" />
  );
}

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6', className)} {...props} />
  )
);

CardContent.displayName = 'CardContent';

export { Card, CardContent };
