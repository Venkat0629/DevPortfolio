import { useState, useEffect } from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { PortfolioProvider } from '@/context/PortfolioContext';
import { ToastProvider } from '@/components/ui';
import { LazyChatWidget } from '@/components/ui';
import { Navbar, Footer, ErrorBoundary } from '@/components/layout';
import { Hero, About, Skills, Experience, Projects, Certifications, Education, Contact, ResumeViewer, GithubContributions } from '@/components/sections';
import { SEO } from '@/components/SEO';

function App() {
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  useEffect(() => {
    const handleOpenResume = () => setIsResumeOpen(true);
    window.addEventListener('openResume', handleOpenResume);
    return () => window.removeEventListener('openResume', handleOpenResume);
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <PortfolioProvider>
          <ToastProvider>
            <SEO />
            <div className="min-h-screen bg-background text-foreground">
              <Navbar onResumeClick={() => setIsResumeOpen(true)} />
              
              <main>
                <Hero />
                <About />
                <Skills />
                <Experience />
                <Projects />
                <Certifications />
                <GithubContributions username="Venkat0629" />
                <Education />
                <Contact />
              </main>
              
              <Footer />
              
              <ResumeViewer 
                isOpen={isResumeOpen} 
                onClose={() => setIsResumeOpen(false)} 
              />
              
              <LazyChatWidget />
            </div>
          </ToastProvider>
        </PortfolioProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
