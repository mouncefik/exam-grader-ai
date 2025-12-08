'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  CheckCircle, 
  Clock, 
  Play, 
  RefreshCw, 
  Search,
  FileText,
  Eye,
  AlertCircle,
  Loader2,
  BarChart3,
  TrendingUp
} from 'lucide-react';
import { Exam, Copy, CorrectionResult } from '@/lib/api';
import { examsAPI, copiesAPI, correctionAPI } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { toast } from 'sonner';
import Link from 'next/link';
import { format } from 'date-fns';

export default function GradingPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string>('');
  const [copies, setCopies] = useState<Copy[]>([]);
  const [filteredCopies, setFilteredCopies] = useState<Copy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCorrecting, setIsCorrecting] = useState(false);
  const [isCorrectingAll, setIsCorrectingAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [gradingStats, setGradingStats] = useState({
    total: 0,
    graded: 0,
    pending: 0,
    averageGrade: 0,
  });
  const { user } = useAuthStore();

  useEffect(() => {
    fetchExams();
  }, []);

  useEffect(() => {
    if (selectedExamId) {
      fetchCopies(selectedExamId);
    }
  }, [selectedExamId]);

  useEffect(() => {
    const filtered = copies.filter(copy =>
      copy.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCopies(filtered);
  }, [searchTerm, copies]);

  useEffect(() => {
    calculateStats();
  }, [copies]);

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
    }
  };

  const fetchCopies = async (examId: string) => {
    try {
      setIsLoading(true);
      const copiesData = await copiesAPI.getCopies(examId);
      setCopies(copiesData);
    } catch (error) {
      console.error('Error fetching copies:', error);
      toast.error('Failed to load copies');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = () => {
    const graded = copies.filter(copy => copy.grade !== null);
    const pending = copies.filter(copy => copy.grade === null);
    const totalGrades = graded.reduce((sum, copy) => sum + (copy.grade || 0), 0);
    const averageGrade = graded.length > 0 ? totalGrades / graded.length : 0;

    setGradingStats({
      total: copies.length,
      graded: graded.length,
      pending: pending.length,
      averageGrade: Math.round(averageGrade * 10) / 10,
    });
  };

  const handleCorrectCopy = async (copyId: string) => {
    setIsCorrecting(true);
    
    try {
      await correctionAPI.correctCopy(selectedExamId, copyId);
      toast.success('Copy corrected successfully');
      fetchCopies(selectedExamId);
    } catch (error) {
      console.error('Error correcting copy:', error);
      toast.error('Failed to correct copy');
    } finally {
      setIsCorrecting(false);
    }
  };

  const handleCorrectAll = async () => {
    setIsCorrectingAll(true);
    
    try {
      const results = await correctionAPI.correctAllCopies(selectedExamId);
      toast.success(`Successfully corrected ${results.length} copies`);
      fetchCopies(selectedExamId);
    } catch (error) {
      console.error('Error correcting all copies:', error);
      toast.error('Failed to correct copies');
    } finally {
      setIsCorrectingAll(false);
    }
  };

  const selectedExam = exams.find(exam => exam.id === selectedExamId);
  const gradedCopies = copies.filter(copy => copy.grade !== null);
  const pendingCopies = copies.filter(copy => copy.grade === null);
  const gradingProgress = copies.length > 0 ? (gradedCopies.length / copies.length) * 100 : 0;

  const canGrade = user?.role !== 'student';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Grading</h1>
          <p className="text-gray-600 mt-2">
            Manage AI-powered grading and correction of student copies
          </p>
        </div>
        {canGrade && selectedExamId && pendingCopies.length > 0 && (
          <Button 
            onClick={handleCorrectAll}
            disabled={isCorrectingAll}
            size="lg"
          >
            {isCorrectingAll ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Correcting All...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Correct All Copies
              </>
            )}
          </Button>
        )}
      </div>

      {/* Exam Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Exam</CardTitle>
          <CardDescription>
            Choose an exam to view and grade its copies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Select value={selectedExamId} onValueChange={setSelectedExamId}>
              <SelectTrigger className="w-full max-w-md">
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
            <Button variant="outline" onClick={() => fetchCopies(selectedExamId)}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {selectedExam && (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Copies</CardTitle>
                <FileText className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{gradingStats.total}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Graded Copies</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{gradingStats.graded}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Copies</CardTitle>
                <Clock className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{gradingStats.pending}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{gradingStats.averageGrade}%</div>
              </CardContent>
            </Card>
          </div>

          {/* Progress Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Grading Progress
              </CardTitle>
              <CardDescription>
                Overall grading progress for {selectedExam.course}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-gray-600">
                    {gradingStats.graded} / {gradingStats.total} copies
                  </span>
                </div>
                <Progress value={gradingProgress} className="h-3" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{Math.round(gradingProgress)}% complete</span>
                  {gradingStats.averageGrade > 0 && (
                    <span className="font-medium">Average Grade: {gradingStats.averageGrade}%</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Search */}
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search copies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Copies List */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">All Copies ({copies.length})</TabsTrigger>
              <TabsTrigger value="graded">Graded ({gradedCopies.length})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({pendingCopies.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <CopiesList 
                copies={filteredCopies} 
                examId={selectedExamId}
                canGrade={canGrade}
                onCorrectCopy={handleCorrectCopy}
                isCorrecting={isCorrecting}
              />
            </TabsContent>

            <TabsContent value="graded" className="space-y-4">
              <CopiesList 
                copies={filteredCopies.filter(copy => copy.grade !== null)} 
                examId={selectedExamId}
                canGrade={canGrade}
                onCorrectCopy={handleCorrectCopy}
                isCorrecting={isCorrecting}
              />
            </TabsContent>

            <TabsContent value="pending" className="space-y-4">
              <CopiesList 
                copies={filteredCopies.filter(copy => copy.grade === null)} 
                examId={selectedExamId}
                canGrade={canGrade}
                onCorrectCopy={handleCorrectCopy}
                isCorrecting={isCorrecting}
              />
            </TabsContent>
          </Tabs>
        </>
      )}

      {!selectedExam && !isLoading && (
        <div className="text-center py-12">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No exams available</h3>
          <p className="mt-1 text-sm text-gray-500">
            Create an exam first to start grading copies
          </p>
          <div className="mt-6">
            <Link href="/dashboard/exams">
              <Button>
                <FileText className="mr-2 h-4 w-4" />
                Go to Exams
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

interface CopiesListProps {
  copies: Copy[];
  examId: string;
  canGrade: boolean;
  onCorrectCopy: (copyId: string) => void;
  isCorrecting: boolean;
}

function CopiesList({ copies, examId, canGrade, onCorrectCopy, isCorrecting }: CopiesListProps) {
  if (copies.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No copies found</h3>
        <p className="mt-1 text-sm text-gray-500">
          No copies match your search criteria
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {copies.map((copy) => (
        <Card key={copy.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">Copy #{copy.id.slice(-6)}</CardTitle>
                <CardDescription>
                  {copy.file_path.split('/').pop()}
                </CardDescription>
              </div>
              <Badge variant={copy.grade ? 'default' : 'secondary'}>
                {copy.grade ? `${copy.grade}%` : 'Pending'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {copy.grade && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Grade:</span>
                  <span className="font-medium">{copy.grade}%</span>
                </div>
              )}
              
              {copy.annotations && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Annotations:</span>
                  <span className="font-medium">
                    {Object.keys(copy.annotations).length} items
                  </span>
                </div>
              )}
              
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-2">
                  <Link href={`/dashboard/copies/${copy.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                  </Link>
                </div>
                
                {canGrade && !copy.grade && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onCorrectCopy(copy.id)}
                    disabled={isCorrecting}
                  >
                    {isCorrecting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle className="mr-2 h-4 w-4" />
                    )}
                    Correct
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}