'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Flag,
  Search,
  FileText,
  Eye,
  RefreshCw
} from 'lucide-react';
import { Exam, Copy } from '@/lib/api';
import { examsAPI, copiesAPI, chatbotAPI } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { toast } from 'sonner';
import { format } from 'date-fns';
import Link from 'next/link';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  message: string;
  timestamp: Date;
  status?: 'pending' | 'resolved';
}

interface RectificationRequest {
  id: string;
  copyId: string;
  message: string;
  status: 'pending' | 'resolved';
  response: string;
  timestamp: Date;
}

interface FlaggedIssue {
  id: string;
  copyId: string;
  issue: string;
  flagged: boolean;
  timestamp: Date;
}

export default function ChatbotPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string>('');
  const [copies, setCopies] = useState<Copy[]>([]);
  const [selectedCopyId, setSelectedCopyId] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [rectificationRequests, setRectificationRequests] = useState<RectificationRequest[]>([]);
  const [flaggedIssues, setFlaggedIssues] = useState<FlaggedIssue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuthStore();

  useEffect(() => {
    fetchExams();
  }, []);

  useEffect(() => {
    if (selectedExamId) {
      fetchCopies(selectedExamId);
    }
  }, [selectedExamId]);

  const fetchExams = async () => {
    try {
      const examsData = await examsAPI.getExams();
      setExams(examsData);
      if (examsData.length > 0) {
        setSelectedExamId(examsData[0].id);
      }
    } catch (error) {
      console.error('Error fetching exams:', error);
      toast.error('Failed to load exams');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCopies = async (examId: string) => {
    try {
      const copiesData = await copiesAPI.getCopies(examId);
      setCopies(copiesData);
      if (copiesData.length > 0) {
        setSelectedCopyId(copiesData[0].id);
      }
    } catch (error) {
      console.error('Error fetching copies:', error);
      toast.error('Failed to load copies');
    }
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || !selectedCopyId) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: currentMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsSending(true);

    try {
      const response = await chatbotAPI.requestRectification(selectedExamId, selectedCopyId, currentMessage);
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        message: response.response,
        timestamp: new Date(),
        status: response.status as 'pending' | 'resolved',
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Add to rectification requests
      const request: RectificationRequest = {
        id: Date.now().toString(),
        copyId: selectedCopyId,
        message: currentMessage,
        status: response.status as 'pending' | 'resolved',
        response: response.response,
        timestamp: new Date(),
      };
      
      setRectificationRequests(prev => [request, ...prev]);
      toast.success('Rectification request submitted successfully');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        message: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  const handleFlagIssue = async (copyId: string, issue: string) => {
    try {
      await chatbotAPI.flagIssue(selectedExamId, copyId, issue);
      
      const flaggedIssue: FlaggedIssue = {
        id: Date.now().toString(),
        copyId,
        issue,
        flagged: true,
        timestamp: new Date(),
      };
      
      setFlaggedIssues(prev => [flaggedIssue, ...prev]);
      toast.success('Issue flagged successfully');
    } catch (error) {
      console.error('Error flagging issue:', error);
      toast.error('Failed to flag issue');
    }
  };

  const selectedExam = exams.find(exam => exam.id === selectedExamId);
  const selectedCopy = copies.find(copy => copy.id === selectedCopyId);
  const filteredCopies = copies.filter(copy =>
    copy.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingRequests = rectificationRequests.filter(req => req.status === 'pending');
  const resolvedRequests = rectificationRequests.filter(req => req.status === 'resolved');

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">AI Assistant</h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="animate-pulse h-96"></Card>
          </div>
          <div className="space-y-4">
            <Card className="animate-pulse h-48"></Card>
            <Card className="animate-pulse h-48"></Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Assistant</h1>
          <p className="text-gray-600 mt-2">
            Get help with grade rectifications and flag issues
          </p>
        </div>
      </div>

      {/* Selection Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Select Exam</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedExamId} onValueChange={setSelectedExamId}>
              <SelectTrigger>
                <SelectValue placeholder="Select an exam" />
              </SelectTrigger>
              <SelectContent>
                {exams.map((exam) => (
                  <SelectItem key={exam.id} value={exam.id}>
                    {exam.course} - {format(new Date(exam.date), 'MMM dd, yyyy')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Select Copy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search copies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCopyId} onValueChange={setSelectedCopyId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a copy" />
                </SelectTrigger>
                <SelectContent>
                  {filteredCopies.map((copy) => (
                    <SelectItem key={copy.id} value={copy.id}>
                      Copy #{copy.id.slice(-6)} - {copy.grade ? `${copy.grade}%` : 'Not graded'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Grade Rectification Chat
              </CardTitle>
              <CardDescription>
                Chat with AI assistant to request grade reviews or clarifications
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-8">
                      <Bot className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">Start a conversation</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Ask about grade rectifications or request reviews
                      </p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.type === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            {message.type === 'bot' && <Bot className="h-4 w-4 mt-1" />}
                            {message.type === 'user' && <User className="h-4 w-4 mt-1" />}
                            <div className="flex-1">
                              <p className="text-sm">{message.message}</p>
                              {message.status && (
                                <Badge
                                  variant={message.status === 'resolved' ? 'default' : 'secondary'}
                                  className="mt-1"
                                >
                                  {message.status}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-xs mt-1 opacity-70">
                            {format(message.timestamp, 'HH:mm')}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
              
              <div className="mt-4 flex gap-2">
                <Textarea
                  placeholder="Type your message..."
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  className="min-h-[60px]"
                  disabled={!selectedCopyId || isSending}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!currentMessage.trim() || !selectedCopyId || isSending}
                  className="self-end"
                >
                  {isSending ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side Panels */}
        <div className="space-y-6">
          {/* Current Copy Info */}
          {selectedCopy && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Current Copy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Copy ID:</span>
                    <span className="text-sm">#{selectedCopy.id.slice(-6)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Grade:</span>
                    <Badge variant={selectedCopy.grade ? 'default' : 'secondary'}>
                      {selectedCopy.grade ? `${selectedCopy.grade}%` : 'Not graded'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">File:</span>
                    <span className="text-sm text-gray-600 truncate">
                      {selectedCopy.file_path.split('/').pop()}
                    </span>
                  </div>
                  <div className="pt-2">
                    <Link href={`/dashboard/copies/${selectedCopy.id}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="mr-2 h-4 w-4" />
                        View Copy
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleFlagIssue(selectedCopyId, 'OCR error detected')}
                disabled={!selectedCopyId}
              >
                <Flag className="mr-2 h-4 w-4" />
                Flag OCR Error
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleFlagIssue(selectedCopyId, 'Incorrect grade calculation')}
                disabled={!selectedCopyId}
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                Flag Grade Issue
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleFlagIssue(selectedCopyId, 'Missing annotations')}
                disabled={!selectedCopyId}
              >
                <FileText className="mr-2 h-4 w-4" />
                Flag Missing Data
              </Button>
            </CardContent>
          </Card>

          {/* Recent Requests */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingRequests.length === 0 && resolvedRequests.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No requests yet
                  </p>
                ) : (
                  <>
                    {pendingRequests.slice(0, 3).map((request) => (
                      <div key={request.id} className="border-l-2 border-orange-500 pl-3">
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3 text-orange-500" />
                          <span className="text-xs text-gray-500">
                            {format(request.timestamp, 'MMM dd, HH:mm')}
                          </span>
                        </div>
                        <p className="text-sm font-medium truncate">{request.message}</p>
                        <Badge variant="secondary" className="mt-1">Pending</Badge>
                      </div>
                    ))}
                    {resolvedRequests.slice(0, 2).map((request) => (
                      <div key={request.id} className="border-l-2 border-green-500 pl-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span className="text-xs text-gray-500">
                            {format(request.timestamp, 'MMM dd, HH:mm')}
                          </span>
                        </div>
                        <p className="text-sm font-medium truncate">{request.message}</p>
                        <Badge variant="default" className="mt-1">Resolved</Badge>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}