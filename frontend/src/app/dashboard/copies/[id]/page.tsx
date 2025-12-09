'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ThumbsUp,
  Bookmark,
  Download,
  Info,
  Search as SearchIcon,
  EyeOff,
  Highlighter,
  AtSign,
  Plus,
  ArrowLeft,
  Loader2,
  FileText,
  Lightbulb,
  BookOpen,
  MessageSquare
} from 'lucide-react';
import { Copy, copiesAPI } from '@/lib/api';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { toast } from 'sonner';
import { DocumentViewer } from '@/components/document-viewer';
import { AIChatPanel, ChatMessage } from '@/components/ai-chat-panel';
import { DocumentInfoBadge } from '@/components/annotation-toolbar';

interface Highlight {
  id: string;
  text: string;
  position: { x: number; y: number };
  question?: string;
}

// Helper function to send messages to chatbot
const sendChatMessage = async (data: { message: string; copy_id: string; context?: string }) => {
  const response = await api.post<{ response: string; message_id?: string }>('/chatbot/message', data);
  return response.data;
};

export default function CopyViewerPage() {
  const params = useParams();
  const router = useRouter();
  const copyId = params.id as string;
  
  const [copy, setCopy] = useState<Copy | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showTools, setShowTools] = useState(true);
  const [selectedText, setSelectedText] = useState('');
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [activeTab, setActiveTab] = useState('highlight');
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    if (copyId) {
      fetchCopyData();
    }
  }, [copyId]);

  const fetchCopyData = async () => {
    try {
      setIsLoading(true);
      const copyData = await copiesAPI.getCopy(copyId);
      setCopy(copyData);
      
      // Initialize welcome message
      setMessages([{
        id: '1',
        role: 'assistant',
        content: 'Bonjour ! Je suis votre assistant de correction IA. Sélectionnez du texte dans la copie pour poser des questions, ou discutez directement avec moi pour analyser cette copie d\'examen.',
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Error fetching copy:', error);
      toast.error('Échec du chargement de la copie');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextSelection = (text: string, position: { x: number; y: number }) => {
    setSelectedText(text);
    setActiveTab('highlight');
  };

  const handleAskQuestion = async (question: string) => {
    if (!question.trim()) return;

    const highlight: Highlight = {
      id: Date.now().toString(),
      text: selectedText,
      position: { x: 0, y: 0 },
      question
    };

    if (selectedText) {
      setHighlights([...highlights, highlight]);
    }

    // Send to chatbot
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: selectedText ? `À propos de "${selectedText}": ${question}` : question,
      timestamp: new Date(),
      metadata: selectedText ? { highlighted_text: selectedText } : undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setIsSending(true);

    try {
      const response = await sendChatMessage({
        message: question,
        context: selectedText,
        copy_id: copyId
      });

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Échec de l\'envoi du message');
    } finally {
      setIsSending(false);
      setSelectedText('');
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || isSending) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsSending(true);

    try {
      const response = await sendChatMessage({
        message,
        copy_id: copyId
      });

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Échec de l\'envoi du message');
    } finally {
      setIsSending(false);
    }
  };

  const handleDownload = () => {
    if (copy?.file_url) {
      window.open(copy.file_url, '_blank');
    }
  };

  const getSampleCopyContent = () => {
    return `
      <div class="space-y-6">
        <div class="border-b pb-4">
          <h2 class="text-2xl font-bold mb-2">Copie d'Examen - ${copy?.student_name || 'Étudiant'}</h2>
          <p class="text-sm text-muted-foreground">Examen ID: ${copy?.exam_id}</p>
        </div>
        
        <div class="space-y-6">
          <div>
            <h3 class="font-semibold text-lg mb-2">Question 1: Qu'est-ce que l'intelligence artificielle ?</h3>
            <p class="text-sm leading-relaxed pl-4 border-l-2 border-primary/30">
              L'intelligence artificielle (IA) est un domaine de l'informatique qui vise à créer 
              des systèmes capables d'effectuer des tâches qui nécessiteraient normalement l'intelligence 
              humaine. Ces tâches incluent l'apprentissage, le raisonnement, la résolution de problèmes, 
              la perception et la compréhension du langage naturel.
            </p>
          </div>
          
          <div>
            <h3 class="font-semibold text-lg mb-2">Question 2: Expliquez le concept d'apprentissage automatique</h3>
            <p class="text-sm leading-relaxed pl-4 border-l-2 border-primary/30">
              L'apprentissage automatique est une sous-catégorie de l'IA qui permet aux systèmes 
              d'apprendre et de s'améliorer automatiquement à partir de l'expérience sans être 
              explicitement programmés. Il utilise des algorithmes qui analysent des données, 
              identifient des modèles et prennent des décisions avec une intervention humaine minimale.
            </p>
          </div>
          
          <div>
            <h3 class="font-semibold text-lg mb-2">Question 3: Applications pratiques de l'IA</h3>
            <p class="text-sm leading-relaxed pl-4 border-l-2 border-primary/30">
              Les applications de l'IA sont nombreuses et variées : reconnaissance vocale et faciale, 
              véhicules autonomes, recommandations personnalisées, diagnostic médical assisté, 
              traduction automatique, et systèmes de chatbot. Ces technologies transforment 
              de nombreux secteurs industriels et notre vie quotidienne.
            </p>
          </div>
        </div>
      </div>
    `;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!copy) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <FileText className="h-16 w-16 text-muted-foreground" />
        <p className="text-lg text-muted-foreground">Copie introuvable</p>
        <Button onClick={() => router.back()}>Retour</Button>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <h1 className="text-lg font-semibold">Copie #{copy.id.slice(-8)}</h1>
                <p className="text-sm text-muted-foreground">
                  {copy.student_name || 'Étudiant anonyme'}
                </p>
              </div>
              <DocumentInfoBadge 
                status={copy.status || 'pending'} 
                grade={copy.grade || undefined} 
              />
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsLiked(!isLiked)}
              className={isLiked ? 'text-red-500' : ''}
            >
              <ThumbsUp className="h-5 w-5" fill={isLiked ? 'currentColor' : 'none'} />
            </Button>
            <span className="text-sm text-muted-foreground mr-2">99</span>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={isBookmarked ? 'text-yellow-500' : ''}
            >
              <Bookmark className="h-5 w-5" fill={isBookmarked ? 'currentColor' : 'none'} />
            </Button>
            
            <Button variant="ghost" size="icon" onClick={handleDownload}>
              <Download className="h-5 w-5" />
            </Button>
            
            <Button variant="ghost" size="icon">
              <Info className="h-5 w-5" />
            </Button>
            
            <Separator orientation="vertical" className="h-6 mx-2" />
            
            <Button variant="ghost" size="icon">
              <SearchIcon className="h-5 w-5" />
            </Button>
            
            <Separator orientation="vertical" className="h-6 mx-2" />
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowTools(!showTools)}
              className="gap-2"
            >
              <EyeOff className="h-4 w-4" />
              {showTools ? 'Masquer' : 'Afficher'} l'assistant
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Document Viewer */}
        <div className="flex-1 bg-muted/30">
          <DocumentViewer
            documentUrl={copy.file_url}
            documentType={copy.file_url?.endsWith('.pdf') ? 'pdf' : 'image'}
            content={!copy.file_url ? getSampleCopyContent() : undefined}
            onTextSelect={handleTextSelection}
          />
        </div>

        {/* AI Assistant Sidebar */}
        {showTools && (
          <div className="w-[420px] border-l bg-background">
            <div className="h-full flex flex-col">
              {/* Quick Actions Tabs */}
              <div className="p-4 border-b">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="highlight" className="text-xs">
                      <Highlighter className="h-3 w-3 mr-1" />
                      Surligner
                    </TabsTrigger>
                    <TabsTrigger value="context" className="text-xs">
                      <AtSign className="h-3 w-3 mr-1" />
                      Contexte
                    </TabsTrigger>
                    <TabsTrigger value="additional" className="text-xs">
                      <Plus className="h-3 w-3 mr-1" />
                      Plus
                    </TabsTrigger>
                  </TabsList>

                  <div className="mt-4">
                    <TabsContent value="highlight" className="m-0">
                      <Card className="p-3 bg-muted/30 border-primary/20">
                        <p className="text-xs text-muted-foreground mb-2">
                          Sélectionnez du texte dans la copie pour poser des questions
                        </p>
                        {selectedText && (
                          <div className="space-y-2 mt-3">
                            <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded text-xs">
                              <span className="font-medium">Sélection:</span> "{selectedText.substring(0, 80)}{selectedText.length > 80 ? '...' : ''}"
                            </div>
                            <Input
                              placeholder="Votre question..."
                              className="text-sm"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleAskQuestion(e.currentTarget.value);
                                  e.currentTarget.value = '';
                                }
                              }}
                            />
                          </div>
                        )}
                      </Card>
                    </TabsContent>

                    <TabsContent value="context" className="m-0">
                      <Card className="p-3 bg-muted/30">
                        <p className="text-xs text-muted-foreground mb-3">
                          Ajoutez des documents de référence
                        </p>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <BookOpen className="h-4 w-4 mr-2" />
                          Barème de correction
                        </Button>
                      </Card>
                    </TabsContent>

                    <TabsContent value="additional" className="m-0">
                      <Card className="p-3 bg-muted/30">
                        <div className="space-y-1">
                          <Button variant="ghost" size="sm" className="w-full justify-start text-xs">
                            <FileText className="h-3.5 w-3.5 mr-2" />
                            Historique de correction
                          </Button>
                          <Button variant="ghost" size="sm" className="w-full justify-start text-xs">
                            <Lightbulb className="h-3.5 w-3.5 mr-2" />
                            Suggestions
                          </Button>
                        </div>
                      </Card>
                    </TabsContent>
                  </div>
                </Tabs>
              </div>

              {/* AI Chat Panel */}
              <div className="flex-1 min-h-0">
                <AIChatPanel
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  isSending={isSending}
                  thinkingMode={true}
                  context={{
                    copyId: copy.id,
                    studentName: copy.student_name
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
