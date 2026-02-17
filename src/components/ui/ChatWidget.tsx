import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { portfolioAgent } from '@/lib/chat';
import type { Message, ChatWidgetProps } from '@/lib/chat';
import { CHAT_CONSTANTS } from '@/lib/chat';

export function ChatWidget({ className }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

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
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="bg-primary-500 hover:bg-primary-600 text-white rounded-full p-4 shadow-lg shadow-primary-500/25 transition-all duration-200"
            aria-label="Open Lumi chat"
            title="Lumi - Professional portfolio guide"
          >
            <MessageCircle className="w-6 h-6" />
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
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-primary-600 rounded-full p-1 transition-colors"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
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
