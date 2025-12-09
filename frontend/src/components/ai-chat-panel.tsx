'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Send,
  Loader2,
  Sparkles,
  Lightbulb,
  FileText,
  MessageSquare,
  BookOpen,
  AlertCircle,
  CheckCircle,
  Info,
  Brain
} from 'lucide-react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    highlighted_text?: string;
    confidence?: number;
    suggestions?: string[];
  };
}

interface AIChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isSending: boolean;
  thinkingMode?: boolean;
  context?: {
    copyId: string;
    examName?: string;
    studentName?: string;
  };
}

export function AIChatPanel({
  messages,
  onSendMessage,
  isSending,
  thinkingMode = true,
  context
}: AIChatPanelProps) {
  const [inputMessage, setInputMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!inputMessage.trim() || isSending) return;
    onSendMessage(inputMessage);
    setInputMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Assistant IA</h2>
          </div>
          {thinkingMode && (
            <Badge variant="outline" className="gap-1">
              <Brain className="h-3 w-3" />
              Mode Réflexion
            </Badge>
          )}
        </div>

        {context && (
          <div className="space-y-1 text-xs text-muted-foreground">
            {context.examName && (
              <p className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                {context.examName}
              </p>
            )}
            {context.studentName && (
              <p className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                Étudiant: {context.studentName}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessageItem key={message.id} message={message} />
          ))}
          {isSending && (
            <div className="flex justify-start">
              <Card className="p-3 bg-muted max-w-[85%]">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">
                    L'IA réfléchit...
                  </span>
                </div>
              </Card>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </ScrollArea>

      {/* Suggestions */}
      <div className="px-4 pb-2">
        <SuggestedPrompts onSelect={setInputMessage} />
      </div>

      {/* Input */}
      <div className="p-4 border-t space-y-2">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Posez une question sur cette copie..."
            disabled={isSending}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={!inputMessage.trim() || isSending}
            size="icon"
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        {thinkingMode && (
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Lightbulb className="h-3 w-3" />
            Mode Réflexion activé - L'IA analyse en profondeur
          </p>
        )}
      </div>
    </div>
  );
}

interface ChatMessageItemProps {
  message: ChatMessage;
}

function ChatMessageItem({ message }: ChatMessageItemProps) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  if (isSystem) {
    return (
      <div className="flex justify-center">
        <Badge variant="outline" className="gap-1">
          <Info className="h-3 w-3" />
          {message.content}
        </Badge>
      </div>
    );
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <Card
        className={`p-3 max-w-[85%] ${
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted'
        }`}
      >
        <div className="space-y-2">
          {/* Highlighted context if present */}
          {message.metadata?.highlighted_text && (
            <div className="text-xs opacity-70 p-2 bg-black/10 rounded">
              <p className="font-medium mb-1">Contexte sélectionné:</p>
              <p className="italic">"{message.metadata.highlighted_text}"</p>
            </div>
          )}

          {/* Message content */}
          <p className="text-sm whitespace-pre-wrap leading-relaxed">
            {message.content}
          </p>

          {/* Confidence indicator for AI messages */}
          {!isUser && message.metadata?.confidence && (
            <div className="flex items-center gap-2 text-xs opacity-70">
              {message.metadata.confidence > 0.8 ? (
                <>
                  <CheckCircle className="h-3 w-3" />
                  <span>Haute confiance</span>
                </>
              ) : message.metadata.confidence > 0.5 ? (
                <>
                  <AlertCircle className="h-3 w-3" />
                  <span>Confiance moyenne</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-3 w-3" />
                  <span>Faible confiance</span>
                </>
              )}
            </div>
          )}

          {/* Suggestions */}
          {message.metadata?.suggestions && message.metadata.suggestions.length > 0 && (
            <div className="space-y-1 pt-2 border-t border-border/50">
              <p className="text-xs font-medium">Suggestions:</p>
              <ul className="text-xs space-y-1">
                {message.metadata.suggestions.map((suggestion, idx) => (
                  <li key={idx} className="flex items-start gap-1">
                    <span className="text-primary">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Timestamp */}
          <span className="text-xs opacity-70 block">
            {message.timestamp.toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
      </Card>
    </div>
  );
}

function SuggestedPrompts({ onSelect }: { onSelect: (prompt: string) => void }) {
  const prompts = [
    { icon: BookOpen, text: "Analyser cette réponse", color: "text-blue-500" },
    { icon: CheckCircle, text: "Vérifier l'exactitude", color: "text-green-500" },
    { icon: Lightbulb, text: "Suggérer des améliorations", color: "text-yellow-500" },
    { icon: AlertCircle, text: "Identifier les erreurs", color: "text-red-500" },
  ];

  const [expanded, setExpanded] = useState(false);

  return (
    <div className="space-y-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setExpanded(!expanded)}
        className="w-full text-xs text-muted-foreground"
      >
        {expanded ? 'Masquer' : 'Afficher'} les suggestions
      </Button>
      
      {expanded && (
        <div className="grid grid-cols-2 gap-2">
          {prompts.map((prompt, idx) => (
            <Button
              key={idx}
              variant="outline"
              size="sm"
              onClick={() => onSelect(prompt.text)}
              className="justify-start gap-2 text-xs h-auto py-2"
            >
              <prompt.icon className={`h-3 w-3 ${prompt.color}`} />
              <span className="text-left">{prompt.text}</span>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

export { ChatMessageItem, SuggestedPrompts };
