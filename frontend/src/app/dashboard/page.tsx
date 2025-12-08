'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  FileText, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Users,
  Plus,
  Eye
} from 'lucide-react';
import { examsAPI, copiesAPI } from '@/lib/api';
import { Exam, Copy } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import Link from 'next/link';
import { toast } from 'sonner';

interface DashboardStats {
  totalExams: number;
  totalCopies: number;
  gradedCopies: number;
  pendingCopies: number;
  averageGrade: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalExams: 0,
    totalCopies: 0,
    gradedCopies: 0,
    pendingCopies: 0,
    averageGrade: 0,
  });
  const [recentExams, setRecentExams] = useState<Exam[]>([]);
  const [recentCopies, setRecentCopies] = useState<Copy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch exams
      const exams = await examsAPI.getExams();
      setRecentExams(exams.slice(0, 5));

      // Fetch copies for all exams
      let allCopies: Copy[] = [];
      for (const exam of exams) {
        const copies = await copiesAPI.getCopies(exam.id);
        allCopies = [...allCopies, ...copies];
      }

      // Calculate stats
      const gradedCopies = allCopies.filter(copy => copy.grade !== null);
      const totalGrades = gradedCopies.reduce((sum, copy) => sum + (copy.grade || 0), 0);
      const averageGrade = gradedCopies.length > 0 ? totalGrades / gradedCopies.length : 0;

      setStats({
        totalExams: exams.length,
        totalCopies: allCopies.length,
        gradedCopies: gradedCopies.length,
        pendingCopies: allCopies.length - gradedCopies.length,
        averageGrade: Math.round(averageGrade * 10) / 10,
      });

      setRecentCopies(allCopies.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const gradingProgress = stats.totalCopies > 0 ? (stats.gradedCopies / stats.totalCopies) * 100 : 0;

  const statCards = [
    {
      title: 'Total Exams',
      value: stats.totalExams,
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Total Copies',
      value: stats.totalCopies,
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Graded Copies',
      value: stats.gradedCopies,
      icon: CheckCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Pending Copies',
      value: stats.pendingCopies,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
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
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.email?.split('@')[0]}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's what's happening with your exams today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Grading Progress
            </CardTitle>
            <CardDescription>
              Overall grading progress across all exams
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-gray-600">
                  {stats.gradedCopies} / {stats.totalCopies} copies
                </span>
              </div>
              <Progress value={gradingProgress} className="h-2" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{Math.round(gradingProgress)}% complete</span>
                {stats.averageGrade > 0 && (
                  <span className="font-medium">Average Grade: {stats.averageGrade}%</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {user?.role !== 'student' && (
              <>
                <Link href="/dashboard/exams">
                  <Button className="w-full justify-start" variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Exam
                  </Button>
                </Link>
                <Link href="/dashboard/copies">
                  <Button className="w-full justify-start" variant="outline">
                    <FileText className="mr-2 h-4 w-4" />
                    Upload Copies
                  </Button>
                </Link>
              </>
            )}
            <Link href="/dashboard/reports">
              <Button className="w-full justify-start" variant="outline">
                <Eye className="mr-2 h-4 w-4" />
                View Reports
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Exams</CardTitle>
            <CardDescription>Latest exams created in the system</CardDescription>
          </CardHeader>
          <CardContent>
            {recentExams.length > 0 ? (
              <div className="space-y-4">
                {recentExams.map((exam) => (
                  <div key={exam.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{exam.course}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(exam.date).toLocaleDateString()}
                      </p>
                    </div>
                    <Link href={`/dashboard/exams/${exam.id}`}>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No exams found</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Copies</CardTitle>
            <CardDescription>Latest student copies uploaded</CardDescription>
          </CardHeader>
          <CardContent>
            {recentCopies.length > 0 ? (
              <div className="space-y-4">
                {recentCopies.map((copy) => (
                  <div key={copy.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Copy #{copy.id.slice(-6)}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant={copy.grade ? 'default' : 'secondary'}>
                          {copy.grade ? `Grade: ${copy.grade}%` : 'Pending'}
                        </Badge>
                      </div>
                    </div>
                    <Link href={`/dashboard/copies/${copy.id}`}>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No copies found</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}