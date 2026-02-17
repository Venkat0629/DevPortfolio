import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Loader2, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { portfolioAgent } from '@/lib/chat';
import type { Message, ChatWidgetProps } from '@/lib/chat';
import { CHAT_CONSTANTS } from '@/lib/chat';

export function ChatWidget({ className }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasShownWelcome, setHasShownWelcome] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showWelcomeNotification, setShowWelcomeNotification] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Play notification sound
  const playSound = () => {
    if (!soundEnabled) return;
    
    try {
      // Create a more audible notification sound using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Create a more noticeable sound pattern
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.1);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      // Fallback: try to create a simple beep
      try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
        audio.volume = 0.3;
        audio.play().catch(() => {});
      } catch (e) {
        // Silent fail if audio is not supported
      }
    }
  };

  // Show welcome message on component mount
  useEffect(() => {
    if (!hasShownWelcome) {
      const timer = setTimeout(() => {
        setShowWelcomeNotification(true);
        setHasShownWelcome(true);
        playSound();
        
        // Auto-hide notification after 5 seconds
        setTimeout(() => setShowWelcomeNotification(false), 5000);
      }, 2000); // Show after 2 seconds
      
      return () => clearTimeout(timer);
    }
  }, [hasShownWelcome, soundEnabled]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const parseActions = (content: string) => {
    const actions: string[] = [];
    const navActions: string[] = [];
    
    // Parse ACTION tokens
    const actionMatches = content.match(/\[\[ACTION:([^\]]+)\]\]/g);
    if (actionMatches) {
      actions.push(...actionMatches.map(match => match.replace('[[ACTION:', '').replace(']]', '')));
    }
    
    // Parse NAV tokens
    const navMatches = content.match(/\[\[NAV:([^\]]+)\]\]/g);
    if (navMatches) {
      navActions.push(...navMatches.map(match => match.replace('[[NAV:', '').replace(']]', '')));
    }
    
    // Clean content by removing action tokens
    const cleanContent = content
      .replace(/\[\[ACTION:[^\]]+\]\]/g, '')
      .replace(/\[\[NAV:[^\]]+\]\]/g, '')
      .trim();
    
    return { cleanContent, actions, navActions };
  };

  const executeAction = (action: string) => {
    switch (action) {
      case 'openResume':
        // Trigger resume viewer
        const resumeEvent = new CustomEvent('openResume');
        window.dispatchEvent(resumeEvent);
        break;
      case 'openContactForm':
        // Navigate to contact and focus form
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
          // Focus first input after scroll
          setTimeout(() => {
            const firstInput = contactSection.querySelector('input, textarea') as HTMLElement;
            firstInput?.focus();
          }, 1000);
        }
        break;
    }
  };

  const executeNav = (nav: string) => {
    if (nav.startsWith('/#')) {
      const targetId = nav.replace('/#', '');
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const generateResponse = async (userMessage: string): Promise<string> => {
    try {
      const response = await portfolioAgent.generateResponse(userMessage);
      
      // Add action tokens to content
      let content = response.content;
      
      if (response.actions?.includes('openResume')) {
        content += ' [[ACTION:openResume]]';
      }
      
      if (response.actions?.includes('openContactForm')) {
        content += ' [[ACTION:openContactForm]]';
      }
      
      if (response.navActions?.length) {
        response.navActions.forEach((nav: string) => {
          content += ` [[NAV:/${nav}]]`;
        });
      }
      
      return content;
    } catch (error) {
      return CHAT_CONSTANTS.ERROR_MESSAGES.GENERIC;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await generateResponse(input);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      playSound(); // Play sound for new message
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again or contact Veera directly.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <div className={cn("fixed bottom-4 right-4 z-50", className)}>
      {/* Welcome Toast Notification */}
      <AnimatePresence>
        {showWelcomeNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.3 }}
            transition={{ 
              type: "spring", 
              stiffness: 500, 
              damping: 28,
              mass: 0.8
            }}
            className="absolute bottom-24 right-0 flex items-start gap-3 cursor-pointer group"
            onClick={() => {
              setShowWelcomeNotification(false);
              setIsOpen(true);
            }}
          >
            {/* Avatar */}
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Bot className="w-5 h-5 text-white" />
              </div>
              {/* Online indicator */}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            
            {/* Message bubble */}
            <div className="relative">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl rounded-tl-none shadow-xl p-3 min-w-[200px] max-w-[280px]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-gray-900 dark:text-white">Lumi</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Just now</span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  Hey! 👋 I'm here to help you explore Veera's portfolio. Want to chat?
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowWelcomeNotification(false);
                      setIsOpen(true);
                    }}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg transition-colors font-medium"
                  >
                    Start chat
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowWelcomeNotification(false);
                    }}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xs p-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
              
              {/* Bubble tail */}
              <div className="absolute -left-2 top-0 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-white dark:border-r-gray-800 border-b-8 border-b-transparent"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: showWelcomeNotification ? [1, 1.1, 1] : 1,
              opacity: 1 
            }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ 
              scale: showWelcomeNotification ? {
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut"
              } : {}
            }}
            onClick={() => setIsOpen(true)}
            className="bg-primary-500 hover:bg-primary-600 text-white rounded-full p-4 shadow-lg shadow-primary-500/25 transition-all duration-200"
            aria-label="Open Lumi chat"
            title="Lumi - Professional portfolio guide"
          >
            <MessageCircle className="w-6 h-6" />
            {showWelcomeNotification && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-card border border-border rounded-2xl shadow-2xl w-96 h-[600px] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-primary-500 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bot className="w-5 h-5" />
                <div>
                  <h3 className="font-semibold">Lumi</h3>
                  <p className="text-xs text-primary-100">Professional portfolio guide</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="hover:bg-primary-600 rounded-full p-1 transition-colors"
                  aria-label={soundEnabled ? "Mute sound" : "Enable sound"}
                  title={soundEnabled ? "Mute notifications" : "Enable notifications"}
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-primary-600 rounded-full p-1 transition-colors"
                  aria-label="Close chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  <Bot className="w-12 h-12 mx-auto mb-4 text-primary-500" />
                  <p className="text-sm">Hi! I'm Lumi.</p>
                  <p className="text-sm mt-2">Ask me about Veera's experience, skills, projects, or how to connect!</p>
                </div>
              )}
              
              {messages.map((message) => {
                const { cleanContent, actions, navActions } = parseActions(message.content);
                const isUser = message.role === 'user';
                
                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex gap-3",
                      isUser ? "justify-end" : "justify-start"
                    )}
                  >
                    {!isUser && (
                      <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}
                    
                    <div className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-3",
                      isUser 
                        ? "bg-primary-500 text-white" 
                        : "bg-muted text-foreground"
                    )}>
                      <p className="text-sm whitespace-pre-wrap">{cleanContent}</p>
                      
                      {/* Action Buttons */}
                      {(actions.length > 0 || navActions.length > 0) && (
                        <div className="mt-3 space-y-2">
                          {actions.map((action, index) => (
                            <button
                              key={`action-${index}`}
                              onClick={() => executeAction(action)}
                              className="w-full bg-primary-500 hover:bg-primary-600 text-white text-xs px-3 py-2 rounded-lg transition-colors"
                            >
                              {action === 'openResume' && '📄 View Resume'}
                              {action === 'openContactForm' && '✉️ Contact Veera'}
                            </button>
                          ))}
                          {navActions.map((nav, index) => (
                            <button
                              key={`nav-${index}`}
                              onClick={() => executeNav(nav)}
                              className="w-full bg-accent-500 hover:bg-accent-600 text-white text-xs px-3 py-2 rounded-lg transition-colors"
                            >
                              📍 Navigate to Section
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {isUser && (
                      <div className="w-8 h-8 rounded-full bg-accent-500 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </motion.div>
                );
              })}
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 justify-start"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-muted rounded-2xl px-4 py-3">
                    <Loader2 className="w-4 h-4 animate-spin text-primary-500" />
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="border-t border-border p-4">
              <div className="flex gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  className="flex-1 resize-none bg-muted border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={1}
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="bg-primary-500 hover:bg-primary-600 disabled:bg-muted disabled:text-muted-foreground text-white rounded-lg p-2 transition-colors"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
