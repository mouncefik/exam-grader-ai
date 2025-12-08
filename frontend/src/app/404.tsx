'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Search, 
  Home, 
  ArrowLeft,
  FileQuestion,
  GraduationCap
} from 'lucide-react';
import Navbar from '@/components/navbar';

export default function GlobalNotFound() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isAuthenticated={false} />
      
      <div className="flex items-center justify-center flex-1 px-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader className="space-y-4">
            <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <FileQuestion className="h-10 w-10 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">404 - Page Not Found</CardTitle>
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
                  <Button variant="outline" className="w-full justify-start">
                    <Home className="mr-3 h-4 w-4" />
                    Back to Home
                  </Button>
                </Link>
                
                <Link href="/dashboard">
                  <Button variant="outline" className="w-full justify-start">
                    <GraduationCap className="mr-3 h-4 w-4" />
                    Go to Dashboard
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-4">
                If you believe this is an error, please contact our support team.
              </p>
              <Link href="/#about">
                <Button size="sm">
                  Contact Support
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}