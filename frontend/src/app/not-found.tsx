'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Home, 
  FileQuestion,
  GraduationCap
} from 'lucide-react';
import Navbar from '@/components/navbar';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar isAuthenticated={false} />
      
      <div className="flex items-center justify-center flex-1 px-4 py-16">
        <Card className="w-full max-w-md text-center shadow-lg">
          <CardHeader className="space-y-4 pb-6">
            <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <FileQuestion className="h-10 w-10 text-blue-600" />
            </div>
            <CardTitle className="text-3xl font-bold">404 - Page Not Found</CardTitle>
            <CardDescription className="text-base">
              Oops! The page you're looking for doesn't exist or has been moved.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <p className="text-gray-600">
                Here are some helpful links instead:
              </p>
              
              <div className="space-y-3">
                <Link href="/">
                  <Button variant="outline" className="w-full justify-start hover:bg-blue-50">
                    <Home className="mr-3 h-4 w-4" />
                    Back to Home
                  </Button>
                </Link>
                
                <Link href="/dashboard">
                  <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700">
                    <GraduationCap className="mr-3 h-4 w-4" />
                    Go to Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
