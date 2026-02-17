import { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

const ChatWidget = lazy(() => import('./ChatWidget').then(module => ({ default: module.ChatWidget })));

interface LazyChatWidgetProps {
  className?: string;
}

export function LazyChatWidget({ className }: LazyChatWidgetProps) {
  return (
    <Suspense 
      fallback={
        <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
          <div className="bg-primary-500 text-white rounded-full p-4 shadow-lg animate-pulse" title="Lumi - Professional portfolio guide">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        </div>
      }
    >
      <ChatWidget className={className} />
    </Suspense>
  );
}
