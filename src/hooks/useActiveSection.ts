import { useEffect, useState, useRef } from 'react';

export function useActiveSection(sectionIds: string[]) {
  const [activeSection, setActiveSection] = useState<string>('');
  const rafId = useRef<number>(0);

  useEffect(() => {
    const getActive = () => {
      const offset = 100; // navbar height + small buffer
      let current = '';

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        // Section is active if its top has scrolled past the offset
        if (rect.top <= offset) {
          current = id;
        }
      }

      // If near the bottom of the page, activate the last section
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 50) {
        current = sectionIds[sectionIds.length - 1];
      }

      setActiveSection(current);
    };

    const handleScroll = () => {
      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(getActive);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    getActive(); // initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId.current);
    };
  }, [sectionIds]);

  return activeSection;
}
