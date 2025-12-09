'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  BarChart3
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: React.ReactNode;
}

export function StatCard({ 
  title, 
  value, 
  description, 
  trend, 
  trendValue,
  icon 
}: StatCardProps) {
  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-red-500" />;
    return null;
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-muted-foreground';
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon || getTrendIcon()}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(description || trendValue) && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            {getTrendIcon()}
            <span className={getTrendColor()}>
              {trendValue} {description}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface GradingStatsProps {
  totalCopies: number;
  gradedCopies: number;
  averageGrade: number;
  pendingCopies: number;
}

export function GradingStats({ 
  totalCopies, 
  gradedCopies, 
  averageGrade,
  pendingCopies 
}: GradingStatsProps) {
  const progress = totalCopies > 0 ? (gradedCopies / totalCopies) * 100 : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total de copies"
        value={totalCopies}
        description="dans cet examen"
        icon={<FileText className="h-4 w-4 text-muted-foreground" />}
      />
      
      <StatCard
        title="Copies corrigées"
        value={gradedCopies}
        description={`${Math.round(progress)}% complété`}
        trend={gradedCopies > 0 ? 'up' : 'neutral'}
        icon={<CheckCircle className="h-4 w-4 text-green-500" />}
      />
      
      <StatCard
        title="Moyenne générale"
        value={`${averageGrade.toFixed(1)}/100`}
        trend={averageGrade >= 60 ? 'up' : 'down'}
        icon={<BarChart3 className="h-4 w-4 text-blue-500" />}
      />
      
      <StatCard
        title="En attente"
        value={pendingCopies}
        description="à corriger"
        icon={<Clock className="h-4 w-4 text-orange-500" />}
      />
    </div>
  );
}

interface GradeDistributionProps {
  grades: number[];
}

export function GradeDistribution({ grades }: GradeDistributionProps) {
  const ranges = [
    { label: '0-20', min: 0, max: 20, color: 'bg-red-500' },
    { label: '20-40', min: 20, max: 40, color: 'bg-orange-500' },
    { label: '40-60', min: 40, max: 60, color: 'bg-yellow-500' },
    { label: '60-80', min: 60, max: 80, color: 'bg-blue-500' },
    { label: '80-100', min: 80, max: 100, color: 'bg-green-500' },
  ];

  const distribution = ranges.map(range => ({
    ...range,
    count: grades.filter(g => g >= range.min && g < range.max).length
  }));

  const maxCount = Math.max(...distribution.map(d => d.count), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribution des notes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {distribution.map((range) => (
            <div key={range.label} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{range.label}</span>
                <span className="text-muted-foreground">
                  {range.count} {range.count === 1 ? 'copie' : 'copies'}
                </span>
              </div>
              <div className="relative h-8 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${range.color} transition-all duration-500 flex items-center justify-end pr-2`}
                  style={{ width: `${(range.count / maxCount) * 100}%` }}
                >
                  {range.count > 0 && (
                    <span className="text-xs font-medium text-white">
                      {range.count}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface ExamProgressProps {
  examName: string;
  totalCopies: number;
  correctedCopies: number;
  reviewedCopies: number;
}

export function ExamProgress({ 
  examName, 
  totalCopies, 
  correctedCopies, 
  reviewedCopies 
}: ExamProgressProps) {
  const correctedPercent = totalCopies > 0 ? (correctedCopies / totalCopies) * 100 : 0;
  const reviewedPercent = totalCopies > 0 ? (reviewedCopies / totalCopies) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{examName}</span>
          <Badge variant={correctedPercent === 100 ? 'default' : 'secondary'}>
            {Math.round(correctedPercent)}%
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Correction</span>
            <span className="font-medium">
              {correctedCopies}/{totalCopies}
            </span>
          </div>
          <Progress value={correctedPercent} className="h-2" />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Vérification</span>
            <span className="font-medium">
              {reviewedCopies}/{totalCopies}
            </span>
          </div>
          <Progress value={reviewedPercent} className="h-2" />
        </div>

        <div className="grid grid-cols-3 gap-2 pt-2">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">En attente</p>
            <p className="text-lg font-bold">{totalCopies - correctedCopies}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Corrigées</p>
            <p className="text-lg font-bold text-blue-500">{correctedCopies}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Vérifiées</p>
            <p className="text-lg font-bold text-green-500">{reviewedCopies}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface PerformanceIndicatorProps {
  label: string;
  value: number;
  maxValue: number;
  status: 'excellent' | 'good' | 'average' | 'poor';
}

export function PerformanceIndicator({ 
  label, 
  value, 
  maxValue, 
  status 
}: PerformanceIndicatorProps) {
  const percentage = (value / maxValue) * 100;
  
  const statusConfig = {
    excellent: { color: 'bg-green-500', icon: CheckCircle, textColor: 'text-green-600' },
    good: { color: 'bg-blue-500', icon: TrendingUp, textColor: 'text-blue-600' },
    average: { color: 'bg-yellow-500', icon: AlertCircle, textColor: 'text-yellow-600' },
    poor: { color: 'bg-red-500', icon: TrendingDown, textColor: 'text-red-600' },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 ${config.textColor}`} />
          <span className="text-sm font-medium">{label}</span>
        </div>
        <span className={`text-sm font-bold ${config.textColor}`}>
          {value}/{maxValue}
        </span>
      </div>
      <Progress value={percentage} className={`h-2 ${config.color}`} />
    </div>
  );
}
