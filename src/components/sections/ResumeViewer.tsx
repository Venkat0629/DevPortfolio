import { useEffect, useState } from 'react';
import { Download, ExternalLink, AlertCircle, FileText } from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';
import { Modal, Button } from '@/components/ui';

interface ResumeViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ResumeViewer({ isOpen, onClose }: ResumeViewerProps) {
  const { personal } = usePortfolio();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setHasError(false);
    }
  }, [isOpen, personal.resumeUrl]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleRetry = () => {
    setIsLoading(true);
    setHasError(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Resume" size="xl">
      <div className="relative min-h-[55vh] sm:min-h-[70vh] bg-gray-100 dark:bg-gray-800">
        {isLoading && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <FileText className="w-8 h-8 text-primary-500 animate-pulse" />
              </div>
              <p className="text-gray-600 dark:text-gray-400">Loading resume...</p>
            </div>
          </div>
        )}

        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
            <div className="text-center max-w-sm px-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Failed to Load Resume
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                The resume could not be loaded. Please try again or download it directly.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline" onClick={handleRetry}>
                  Try Again
                </Button>
                <a
                  href={personal.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all duration-300"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </a>
              </div>
            </div>
          </div>
        )}

        {!hasError && (
          <iframe
            key={isLoading ? 'loading' : 'loaded'}
            src={`${personal.resumeUrl}#toolbar=0&navpanes=0&zoom=100`}
            className="w-full h-[55vh] sm:h-[70vh]"
            title="Resume"
            onLoad={handleLoad}
            onError={handleError}
            style={{ display: isLoading ? 'none' : 'block' }}
          />
        )}
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-3 justify-end">
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
        <Button
          variant="outline"
          leftIcon={<ExternalLink className="w-4 h-4" />}
          onClick={() => window.open(personal.resumeUrl, '_blank')}
        >
          Open in New Tab
        </Button>
        <Button
          leftIcon={<Download className="w-4 h-4" />}
          onClick={() => {
            const link = document.createElement('a');
            link.href = personal.resumeUrl;
            link.download = `${personal.name.replace(/\s+/g, '_')}_Resume.pdf`;
            link.click();
          }}
        >
          Download
        </Button>
      </div>
    </Modal>
  );
}
