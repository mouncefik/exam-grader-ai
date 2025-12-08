'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { 
  Download, 
  FileText, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  CheckCircle,
  Clock,
  AlertCircle,
  BarChart3,
  PieChart as PieChartIcon,
  Calendar,
  Award
} from 'lucide-react';
import { Exam } from '@/lib/api';
import { examsAPI, resultsAPI } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface ReportData {
  examId: string;
  type: string;
  data: any;
}

interface ExamStats {
  exam: Exam;
  totalCopies: number;
  gradedCopies: number;
  averageGrade: number;
  gradeDistribution: { grade: string; count: number }[];
  passRate: number;
  highestGrade: number;
  lowestGrade: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function ReportsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string>('');
  const [examStats, setExamStats] = useState<ExamStats[]>([]);
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reportType, setReportType] = useState<'summary' | 'detailed'>('summary');
  const { user } = useAuthStore();

  useEffect(() => {
    fetchExamsAndReports();
  }, []);

  useEffect(() => {
    if (selectedExamId) {
      fetchExamReport(selectedExamId);
    }
  }, [selectedExamId, reportType]);

  const fetchExamsAndReports = async () => {
    try {
      setIsLoading(true);
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

  const fetchExamReport = async (examId: string) => {
    try {
      const report = await resultsAPI.getReport(examId, reportType);
      setSelectedReport(report);
      
      // Process report data to create stats
      if (report.data) {
        const stats = processReportData(report.data, examId);
        setExamStats(prev => {
          const filtered = prev.filter(s => s.exam.id !== examId);
          return [...filtered, stats];
        });
      }
    } catch (error) {
      console.error('Error fetching report:', error);
      toast.error('Failed to load report');
    }
  };

  const processReportData = (data: any, examId: string): ExamStats => {
    const exam = exams.find(e => e.id === examId);
    if (!exam) {
      throw new Error('Exam not found');
    }

    // This is a mock implementation - in real app, data would come from API
    const totalCopies = data.totalCopies || Math.floor(Math.random() * 50) + 10;
    const gradedCopies = data.gradedCopies || Math.floor(totalCopies * 0.8);
    const averageGrade = data.averageGrade || Math.floor(Math.random() * 30) + 60;
    
    const gradeDistribution = [
      { grade: 'A (90-100)', count: Math.floor(Math.random() * 10) + 5 },
      { grade: 'B (80-89)', count: Math.floor(Math.random() * 15) + 8 },
      { grade: 'C (70-79)', count: Math.floor(Math.random() * 12) + 6 },
      { grade: 'D (60-69)', count: Math.floor(Math.random() * 8) + 3 },
      { grade: 'F (0-59)', count: Math.floor(Math.random() * 5) + 1 },
    ];

    const passRate = ((gradeDistribution[0].count + gradeDistribution[1].count + gradeDistribution[2].count + gradeDistribution[3].count) / totalCopies) * 100;

    return {
      exam,
      totalCopies,
      gradedCopies,
      averageGrade,
      gradeDistribution,
      passRate,
      highestGrade: 95,
      lowestGrade: 35,
    };
  };

  const selectedExam = exams.find(exam => exam.id === selectedExamId);
  const currentExamStats = examStats.find(stat => stat.exam.id === selectedExamId);

  const generateOverallStats = () => {
    const totalExams = exams.length;
    const totalCopies = examStats.reduce((sum, stat) => sum + stat.totalCopies, 0);
    const totalGraded = examStats.reduce((sum, stat) => sum + stat.gradedCopies, 0);
    const avgGrade = examStats.length > 0 
      ? examStats.reduce((sum, stat) => sum + stat.averageGrade, 0) / examStats.length 
      : 0;

    return {
      totalExams,
      totalCopies,
      totalGraded,
      avgGrade: Math.round(avgGrade * 10) / 10,
    };
  };

  const overallStats = generateOverallStats();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-2">
            Comprehensive insights into exam performance and grading statistics
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.totalExams}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Copies</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.totalCopies}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Graded Copies</CardTitle>
            <CheckCircle className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.totalGraded}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
            <Award className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.avgGrade}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Exam Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Exam for Detailed Report</CardTitle>
          <CardDescription>
            Choose an exam to view detailed analytics and performance metrics
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
            <Select value={reportType} onValueChange={(value: 'summary' | 'detailed') => setReportType(value)}>
              <SelectTrigger className="w-full max-w-xs">
                <SelectValue placeholder="Report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="summary">Summary</SelectItem>
                <SelectItem value="detailed">Detailed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {selectedExam && currentExamStats && (
        <>
          {/* Current Exam Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Copies</CardTitle>
                <FileText className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentExamStats.totalCopies}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Graded Copies</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentExamStats.gradedCopies}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentExamStats.averageGrade}%</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
                <Award className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Math.round(currentExamStats.passRate)}%</div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Grade Distribution
                </CardTitle>
                <CardDescription>
                  Distribution of grades across all copies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={currentExamStats.gradeDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="grade" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5" />
                  Performance Overview
                </CardTitle>
                <CardDescription>
                  Visual breakdown of student performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={currentExamStats.gradeDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ grade, percent }) => `${grade}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {currentExamStats.gradeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Summary</CardTitle>
              <CardDescription>
                Key performance metrics for {selectedExam.course}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{currentExamStats.highestGrade}%</div>
                  <p className="text-sm text-gray-600 mt-1">Highest Grade</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{currentExamStats.averageGrade}%</div>
                  <p className="text-sm text-gray-600 mt-1">Average Grade</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">{currentExamStats.lowestGrade}%</div>
                  <p className="text-sm text-gray-600 mt-1">Lowest Grade</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {!selectedExam && !isLoading && (
        <div className="text-center py-12">
          <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No exams available</h3>
          <p className="mt-1 text-sm text-gray-500">
            Create an exam first to view reports and analytics
          </p>
          <div className="mt-6">
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              Go to Exams
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}