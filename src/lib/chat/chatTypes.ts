export interface ChatResponse {
  content: string;
  actions?: string[];
  navActions?: string[];
}

export interface QuestionPattern {
  pattern: RegExp;
  responseType: string;
  priority: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatWidgetProps {
  className?: string;
}
