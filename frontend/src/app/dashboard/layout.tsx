'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  BookOpen, 
  FileText, 
  CheckCircle, 
  BarChart3, 
  MessageSquare, 
  Menu,
  GraduationCap
} from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Navbar from '@/components/navbar';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Exams', href: '/dashboard/exams', icon: BookOpen },
  { name: 'Copies', href: '/dashboard/copies', icon: FileText },
  { name: 'Grading', href: '/dashboard/grading', icon: CheckCircle },
  { name: 'Reports', href: '/dashboard/reports', icon: BarChart3 },
  { name: 'Chatbot', href: '/dashboard/chatbot', icon: MessageSquare },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="flex items-center justify-center h-16 px-4 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-8 w-8 text-blue-400" />
          <span className="text-xl font-bold text-white">MarkScanner</span>
        </div>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
        })}
      </nav>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar isAuthenticated={true} />
      
      {/* Dashboard Navigation Sidebar */}
      <div className="flex pt-16">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex md:w-64 md:flex-col">
          <Sidebar />
        </div>

        {/* Mobile Sidebar */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden fixed top-20 left-4 z-40"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <Sidebar />
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Page Title Header */}
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="flex items-center h-16 px-4 md:px-6">
              <h1 className="text-xl font-semibold text-gray-900">
                {navigation.find(item => item.href === pathname)?.name || 'Dashboard'}
              </h1>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-auto">
            <div className="p-4 md:p-6 lg:p-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}