'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Download,
  Maximize,
  FileText,
  Image as ImageIcon,
  Loader2
} from 'lucide-react';

interface Annotation {
  id: string;
  type: 'highlight' | 'comment' | 'correction';
  color: string;
  text: string;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  comment?: string;
}

interface DocumentViewerProps {
  documentUrl?: string;
  documentType?: 'pdf' | 'image' | 'text';
  content?: string;
  annotations?: Annotation[];
  onTextSelect?: (text: string, position: { x: number; y: number }) => void;
  onAddAnnotation?: (annotation: Omit<Annotation, 'id'>) => void;
  className?: string;
}

export function DocumentViewer({
  documentUrl,
  documentType = 'text',
  content,
  annotations = [],
  onTextSelect,
  onAddAnnotation,
  className = ''
}: DocumentViewerProps) {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [isLoading, setIsLoading] = useState(!!documentUrl);
  const [selectedText, setSelectedText] = useState('');
  const viewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (documentUrl) {
      setIsLoading(false);
    }
  }, [documentUrl]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 50));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);
  const handleFullscreen = () => {
    if (viewerRef.current) {
      viewerRef.current.requestFullscreen();
    }
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      const text = selection.toString();
      setSelectedText(text);
      
      if (onTextSelect) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        onTextSelect(text, {
          x: rect.left,
          y: rect.top
        });
      }
    }
  };

  const handleDownload = () => {
    if (documentUrl) {
      const link = document.createElement('a');
      link.href = documentUrl;
      link.download = 'document';
      link.click();
    }
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 bg-muted/50 border-b">
        <div className="flex items-center gap-2">
          {documentType === 'pdf' && <FileText className="h-4 w-4 text-muted-foreground" />}
          {documentType === 'image' && <ImageIcon className="h-4 w-4 text-muted-foreground" />}
          <span className="text-sm font-medium">
            {zoom}%
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomOut}
            disabled={zoom <= 50}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomIn}
            disabled={zoom >= 200}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleRotate}
          >
            <RotateCw className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleFullscreen}
          >
            <Maximize className="h-4 w-4" />
          </Button>

          {documentUrl && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Document Content */}
      <ScrollArea className="flex-1">
        <div className="p-8 flex justify-center">
          <div
            ref={viewerRef}
            className="relative bg-white shadow-lg"
            style={{
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              transformOrigin: 'top center',
              transition: 'transform 0.2s ease-in-out',
              minHeight: '600px'
            }}
            onMouseUp={handleTextSelection}
          >
            {isLoading && (
              <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}

            {!isLoading && documentUrl && documentType === 'pdf' && (
              <iframe
                src={documentUrl}
                className="w-full h-[1200px] border-0"
                title="Document PDF"
              />
            )}

            {!isLoading && documentUrl && documentType === 'image' && (
              <img
                src={documentUrl}
                alt="Document"
                className="max-w-full h-auto"
              />
            )}

            {!isLoading && !documentUrl && content && (
              <div className="p-8 max-w-4xl">
                <div className="prose prose-sm max-w-none">
                  <div 
                    dangerouslySetInnerHTML={{ __html: content }}
                    className="whitespace-pre-wrap"
                  />
                </div>
              </div>
            )}

            {!isLoading && !documentUrl && !content && (
              <div className="flex flex-col items-center justify-center h-96 text-muted-foreground">
                <FileText className="h-16 w-16 mb-4" />
                <p>Aucun document à afficher</p>
              </div>
            )}

            {/* Annotations Overlay */}
            {annotations.map((annotation) => (
              <AnnotationOverlay
                key={annotation.id}
                annotation={annotation}
              />
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

interface AnnotationOverlayProps {
  annotation: Annotation;
}

function AnnotationOverlay({ annotation }: AnnotationOverlayProps) {
  const colorMap = {
    yellow: 'bg-yellow-200/50 border-yellow-400',
    green: 'bg-green-200/50 border-green-400',
    blue: 'bg-blue-200/50 border-blue-400',
    red: 'bg-red-200/50 border-red-400',
  };

  return (
    <div
      className={`absolute border-2 ${colorMap[annotation.color as keyof typeof colorMap] || colorMap.yellow} pointer-events-none`}
      style={{
        left: annotation.position.x,
        top: annotation.position.y,
        width: annotation.position.width,
        height: annotation.position.height,
      }}
      title={annotation.comment}
    >
      {annotation.comment && (
        <div className="absolute -top-8 left-0 bg-white px-2 py-1 rounded shadow-sm text-xs whitespace-nowrap">
          {annotation.comment}
        </div>
      )}
    </div>
  );
}

interface DocumentComparisonViewerProps {
  originalUrl?: string;
  correctedUrl?: string;
  originalContent?: string;
  correctedContent?: string;
}

export function DocumentComparisonViewer({
  originalUrl,
  correctedUrl,
  originalContent,
  correctedContent
}: DocumentComparisonViewerProps) {
  const [syncScroll, setSyncScroll] = useState(true);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  const handleScroll = (source: 'left' | 'right') => {
    if (!syncScroll) return;

    const sourceRef = source === 'left' ? leftRef : rightRef;
    const targetRef = source === 'left' ? rightRef : leftRef;

    if (sourceRef.current && targetRef.current) {
      targetRef.current.scrollTop = sourceRef.current.scrollTop;
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4 h-full">
      <Card className="overflow-hidden">
        <div className="p-3 bg-muted/50 border-b">
          <h3 className="text-sm font-medium">Original</h3>
        </div>
        <ScrollArea
          ref={leftRef}
          onScroll={() => handleScroll('left')}
          className="h-[calc(100%-3rem)]"
        >
          <DocumentViewer
            documentUrl={originalUrl}
            content={originalContent}
          />
        </ScrollArea>
      </Card>

      <Card className="overflow-hidden">
        <div className="p-3 bg-muted/50 border-b flex items-center justify-between">
          <h3 className="text-sm font-medium">Corrigé</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSyncScroll(!syncScroll)}
            className="text-xs"
          >
            Sync: {syncScroll ? 'ON' : 'OFF'}
          </Button>
        </div>
        <ScrollArea
          ref={rightRef}
          onScroll={() => handleScroll('right')}
          className="h-[calc(100%-3rem)]"
        >
          <DocumentViewer
            documentUrl={correctedUrl}
            content={correctedContent}
          />
        </ScrollArea>
      </Card>
    </div>
  );
}

export { type Annotation };
