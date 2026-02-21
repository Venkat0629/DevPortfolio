import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, Layers } from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';
import { Section, Card, CardContent } from '@/components/ui';
import { staggerItem, scaleIn } from '@/lib/animations';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { cn } from '@/lib/utils';
import { getTechIconUrl } from '@/lib/techIcons';

export function Projects() {
  const { projects } = usePortfolio();
  const { ref, isVisible } = useScrollReveal();
  const [filter, setFilter] = useState<string>('All');
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const categories = ['All', ...new Set(projects.items.map((p) => p.category))];
  const filteredProjects = filter === 'All' 
    ? projects.items 
    : projects.items.filter((p) => p.category === filter);

  const renderProjectCard = (project: (typeof filteredProjects)[number]) => (
    <Card variant="glass" hover glow className="h-full overflow-hidden group">
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary-500/20 to-accent-500/20">
        <div className="absolute inset-0 flex items-center justify-center">
          <Layers className="w-16 h-16 text-primary-500/30" />
        </div>
        
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent items-end p-4 hidden lg:flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: hoveredId === project.id ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex gap-2">
            {project.links.live && (
              <a
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
                aria-label="View live site"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
                aria-label="View source code"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
          </div>
        </motion.div>

        {project.featured && (
          <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-gradient-to-r from-primary-500 to-accent-500 text-white text-xs font-medium">
            Featured
          </div>
        )}
      </div>

      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
            {project.category}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors">
          {project.title}
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {project.description}
        </p>

        {(project.links.live || project.links.github) && (
          <div className="lg:hidden flex items-center gap-2 mb-4">
            {project.links.live && (
              <a
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Live
              </a>
            )}
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              >
                <Github className="w-3.5 h-3.5" />
                Code
              </a>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-1.5">
          {project.technologies.slice(0, 5).map((tech) => {
            const iconUrl = getTechIconUrl(tech);
            return (
              <span
                key={tech}
                className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
              >
                {iconUrl && (
                  <img
                    src={iconUrl}
                    alt={tech}
                    className="w-3.5 h-3.5 object-contain"
                    loading="lazy"
                  />
                )}
                {tech}
              </span>
            );
          })}
          {project.technologies.length > 5 && (
            <span className="px-2 py-0.5 text-xs rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
              +{project.technologies.length - 5}
            </span>
          )}
        </div>

        {project.stats && (
          <div className="flex gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            {Object.entries(project.stats).map(([key, value]) => (
              <div key={key} className="text-center">
                <div className="text-sm font-semibold text-primary-500">{value}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">{key}</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Section id="projects" title={projects.title} subtitle={projects.subtitle}>
      <div ref={ref}>
        <motion.div
          variants={staggerItem}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                filter === category
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              )}
            >
              {category}
            </button>
          ))}
        </motion.div>

        <motion.div layout className="hidden lg:grid lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                variants={scaleIn}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
                onMouseEnter={() => setHoveredId(project.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {renderProjectCard(project)}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="lg:hidden -mx-4 px-4">
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  layout
                  variants={scaleIn}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.04 }}
                  className="snap-center shrink-0 w-[88%] sm:w-[72%] md:w-[58%]"
                >
                  {renderProjectCard(project)}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Section>
  );
}
