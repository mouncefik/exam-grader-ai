'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Upload, 
  FileText, 
  Search, 
  Download,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Play,
  RefreshCw
} from 'lucide-react';
import { Exam, Copy } from '@/lib/api';
import { examsAPI, copiesAPI, correctionAPI } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { toast } from 'sonner';
import Link from 'next/link';
import { format } from 'date-fns';

export default function ExamCopiesPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.id as string;
  
  const [exam, setExam] = useState<Exam | null>(null);
  const [copies, setCopies] = useState<Copy[]>([]);
  const [filteredCopies, setFilteredCopies] = useState<Copy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isCorrecting, setIsCorrecting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { user } = useAuthStore();

  useEffect(() => {
    if (examId) {
      fetchExamData();
    }
  }, [examId]);

  useEffect(() => {
    const filtered = copies.filter(copy =>
      copy.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCopies(filtered);
  }, [searchTerm, copies]);

  const fetchExamData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch exam details
      const examData = await examsAPI.getExam(examId);
      setExam(examData);
      
      // Fetch copies
      const copiesData = await copiesAPI.getCopies(examId);
      setCopies(copiesData);
    } catch (error) {
      console.error('Error fetching exam data:', error);
      toast.error('Failed to load exam data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setSelectedFiles(files);
    }
  };

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      toast.error('Please select files to upload');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const totalFiles = selectedFiles.length;
      let uploadedFiles = 0;

      for (let i = 0; i < totalFiles; i++) {
        const file = selectedFiles[i];
        await copiesAPI.uploadCopy(examId, file);
        uploadedFiles++;
        setUploadProgress((uploadedFiles / totalFiles) * 100);
      }

      toast.success(`${totalFiles} files uploaded successfully`);
      setSelectedFiles(null);
      setUploadProgress(0);
      
      // Reset file input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
      
      fetchExamData();
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error('Failed to upload files');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCorrectAll = async () => {
    setIsCorrecting(true);
    
    try {
      const results = await correctionAPI.correctAllCopies(examId);
      toast.success(`Successfully corrected ${results.length} copies`);
      fetchExamData();
    } catch (error) {
      console.error('Error correcting copies:', error);
      toast.error('Failed to correct copies');
    } finally {
      setIsCorrecting(false);
    }
  };

  const handleCorrectCopy = async (copyId: string) => {
    try {
      await correctionAPI.correctCopy(examId, copyId);
      toast.success('Copy corrected successfully');
      fetchExamData();
    } catch (error) {
      console.error('Error correcting copy:', error);
      toast.error('Failed to correct copy');
    }
  };

  const gradedCopies = copies.filter(copy => copy.grade !== null);
  const pendingCopies = copies.filter(copy => copy.grade === null);
  const gradingProgress = copies.length > 0 ? (gradedCopies.length / copies.length) * 100 : 0;

  const canManageCopies = user?.role !== 'student';

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Button variant="outline" onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </CardContent>
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
        <div className="flex items-center">
          <Button variant="outline" onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{exam?.course}</h1>
            <p className="text-gray-600 mt-1">
              {format(new Date(exam?.date || ''), 'MMMM dd, yyyy')}
            </p>
          </div>
        </div>
        {canManageCopies && (
          <div className="flex items-center space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Copies
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload Student Copies</DialogTitle>
                  <DialogDescription>
                    Select PDF or image files to upload for this exam
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="file-upload">Select Files</Label>
                    <Input
                      id="file-upload"
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileSelect}
                      disabled={isUploading}
                    />
                  </div>
                  {selectedFiles && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Selected Files:</p>
                      <div className="max-h-32 overflow-y-auto space-y-1">
                        {Array.from(selectedFiles).map((file, index) => (
                          <div key={index} className="text-sm text-gray-600">
                            {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {isUploading && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Uploading...</span>
                        <span>{Math.round(uploadProgress)}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-2" />
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setSelectedFiles(null);
                      setUploadProgress(0);
                    }}
                    disabled={isUploading}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleUpload} 
                    disabled={!selectedFiles || isUploading}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      'Upload'
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            {copies.length > 0 && pendingCopies.length > 0 && (
              <Button 
                onClick={handleCorrectAll}
                disabled={isCorrecting}
                variant="outline"
              >
                {isCorrecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Correcting...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Correct All
                  </>
                )}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Total Copies</span>
              <FileText className="h-5 w-5 text-blue-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{copies.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Graded Copies</span>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gradedCopies.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Pending Copies</span>
              <Clock className="h-5 w-5 text-orange-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCopies.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Progress */}
      {copies.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Grading Progress</CardTitle>
            <CardDescription>
              Overall grading progress for this exam
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-gray-600">
                  {gradedCopies.length} / {copies.length} copies
                </span>
              </div>
              <Progress value={gradingProgress} className="h-2" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{Math.round(gradingProgress)}% complete</span>
                {gradedCopies.length > 0 && (
                  <span className="font-medium">
                    Avg Grade: {Math.round(gradedCopies.reduce((sum, copy) => sum + (copy.grade || 0), 0) / gradedCopies.length)}%
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
        <Button variant="outline" onClick={fetchExamData}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
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
            examId={examId}
            canManageCopies={canManageCopies}
            onCorrectCopy={handleCorrectCopy}
          />
        </TabsContent>

        <TabsContent value="graded" className="space-y-4">
          <CopiesList 
            copies={filteredCopies.filter(copy => copy.grade !== null)} 
            examId={examId}
            canManageCopies={canManageCopies}
            onCorrectCopy={handleCorrectCopy}
          />
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <CopiesList 
            copies={filteredCopies.filter(copy => copy.grade === null)} 
            examId={examId}
            canManageCopies={canManageCopies}
            onCorrectCopy={handleCorrectCopy}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface CopiesListProps {
  copies: Copy[];
  examId: string;
  canManageCopies: boolean;
  onCorrectCopy: (copyId: string) => void;
}

function CopiesList({ copies, examId, canManageCopies, onCorrectCopy }: CopiesListProps) {
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
                  File: {copy.file_path.split('/').pop()}
                </CardDescription>
              </div>
              <Badge variant={copy.grade ? 'default' : 'secondary'}>
                {copy.grade ? `Grade: ${copy.grade}%` : 'Pending'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Link href={`/dashboard/copies/${copy.id}`}>
                  <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Button>
                </Link>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
              {canManageCopies && !copy.grade && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onCorrectCopy(copy.id)}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Correct
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}