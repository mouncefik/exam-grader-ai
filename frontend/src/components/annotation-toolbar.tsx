'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Highlighter,
  Sparkles,
  MessageSquare,
  ThumbsUp,
  Star,
  Info
} from 'lucide-react';

interface AnnotationToolbarProps {
  selectedText: string;
  onHighlight: (color: string) => void;
  onAskQuestion: (question: string) => void;
  onClearSelection: () => void;
}

export function AnnotationToolbar({
  selectedText,
  onHighlight,
  onAskQuestion,
  onClearSelection
}: AnnotationToolbarProps) {
  const [question, setQuestion] = useState('');

  const highlightColors = [
    { color: 'yellow', label: 'Jaune', class: 'bg-yellow-200' },
    { color: 'green', label: 'Vert', class: 'bg-green-200' },
    { color: 'blue', label: 'Bleu', class: 'bg-blue-200' },
    { color: 'red', label: 'Rouge', class: 'bg-red-200' },
  ];

  if (!selectedText) return null;

  return (
    <Card className="absolute z-50 p-3 shadow-lg border-2 border-primary/20 animate-in fade-in slide-in-from-bottom-2">
      <div className="space-y-3">
        {/* Selected Text Preview */}
        <div className="max-w-xs">
          <p className="text-xs text-muted-foreground mb-1">Texte sélectionné:</p>
          <p className="text-sm line-clamp-2 bg-muted p-2 rounded">
            {selectedText}
          </p>
        </div>

        {/* Highlight Colors */}
        <div className="flex items-center gap-2">
          <Highlighter className="h-4 w-4 text-muted-foreground" />
          <div className="flex gap-1">
            {highlightColors.map(({ color, label, class: className }) => (
              <Button
                key={color}
                size="sm"
                variant="outline"
                className={`w-8 h-8 p-0 ${className} hover:opacity-80`}
                onClick={() => onHighlight(color)}
                title={label}
              >
                <span className="sr-only">{label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Question Input */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <p className="text-xs font-medium">Poser une question à l'IA:</p>
          </div>
          <div className="flex gap-2">
            <Input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ex: Expliquer ce passage..."
              className="text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && question.trim()) {
                  onAskQuestion(question);
                  setQuestion('');
                }
              }}
            />
            <Button
              size="sm"
              onClick={() => {
                if (question.trim()) {
                  onAskQuestion(question);
                  setQuestion('');
                }
              }}
              disabled={!question.trim()}
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 text-xs">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onAskQuestion("Qu'est-ce que cela signifie ?")}
            className="flex-1"
          >
            Expliquer
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onAskQuestion("Est-ce correct ?")}
            className="flex-1"
          >
            Vérifier
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onClearSelection}
            className="flex-1"
          >
            Annuler
          </Button>
        </div>
      </div>
    </Card>
  );
}

interface HighlightedTextProps {
  highlights: Array<{
    id: string;
    text: string;
    color: string;
    position: { start: number; end: number };
  }>;
}

export function HighlightedText({ highlights }: HighlightedTextProps) {
  return (
    <div className="space-y-2">
      {highlights.map((highlight) => (
        <div
          key={highlight.id}
          className="flex items-start gap-2 p-2 rounded hover:bg-muted/50 cursor-pointer"
        >
          <div
            className={`w-3 h-3 rounded-full mt-1 bg-${highlight.color}-400`}
          />
          <div className="flex-1">
            <p className="text-sm">{highlight.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

interface DocumentStatsProps {
  likes: number;
  isLiked: boolean;
  onLike: () => void;
  rating?: number;
  onRate?: (rating: number) => void;
}

export function DocumentStats({ 
  likes, 
  isLiked, 
  onLike,
  rating = 0,
  onRate 
}: DocumentStatsProps) {
  return (
    <div className="flex items-center gap-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={onLike}
        className={`gap-2 ${isLiked ? 'text-red-500' : ''}`}
      >
        <ThumbsUp 
          className="h-4 w-4" 
          fill={isLiked ? 'currentColor' : 'none'} 
        />
        <span>{likes}</span>
      </Button>

      {onRate && (
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Button
              key={star}
              variant="ghost"
              size="sm"
              className="p-0 h-6 w-6"
              onClick={() => onRate(star)}
            >
              <Star
                className={`h-4 w-4 ${
                  star <= rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

interface DocumentInfoBadgeProps {
  status: 'pending' | 'corrected' | 'reviewed';
  grade?: number;
}

export function DocumentInfoBadge({ status, grade }: DocumentInfoBadgeProps) {
  const statusConfig = {
    pending: { label: 'En attente', variant: 'secondary' as const },
    corrected: { label: 'Corrigé', variant: 'default' as const },
    reviewed: { label: 'Vérifié', variant: 'outline' as const },
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center gap-2">
      <Badge variant={config.variant}>{config.label}</Badge>
      {grade !== undefined && (
        <Badge variant="outline" className="font-mono">
          {grade}/100
        </Badge>
      )}
    </div>
  );
}
