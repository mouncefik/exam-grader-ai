"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap,
  Zap,
  FileText,
  BarChart3,
  Shield,
  Users,
  CheckCircle,
  ArrowRight,
  Star,
  TrendingUp,
  Clock,
  Award,
  Brain,
  Camera,
  Target,
  MessageSquare
} from "lucide-react";
import Navbar from "@/components/navbar";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState('professors');

  const features = [
    {
      icon: <Brain className="h-6 w-6" />,
      title: 'AI-Powered Grading',
      description: 'Advanced artificial intelligence analyzes and grades student papers with high accuracy.',
    },
    {
      icon: <Camera className="h-6 w-6" />,
      title: 'OCR Technology',
      description: 'Optical Character Recognition converts handwritten and printed text to digital format.',
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: 'Detailed Analytics',
      description: 'Comprehensive reports and insights on student performance and exam statistics.',
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: 'High Accuracy',
      description: 'Precision grading with customizable rubrics and feedback mechanisms.',
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: 'Time Saving',
      description: 'Reduce grading time by up to 90% while maintaining quality and consistency.',
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: 'Grade Appeals',
      description: 'Built-in chatbot for grade rectification requests and issue resolution.',
    },
  ];

  const professorBenefits = [
    'Save hours of grading time each week',
    'Consistent and unbiased evaluation',
    'Detailed performance analytics',
    'Easy bulk upload of student papers',
    'Customizable grading rubrics',
    'Secure cloud-based storage',
  ];

  const studentBenefits = [
    'Faster grade turnaround',
    'Detailed feedback and annotations',
    'Grade appeal and clarification system',
    'Access to performance history',
    'Transparent grading process',
    'Mobile-friendly interface',
  ];

  const testimonials = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Professor of Mathematics',
      institution: 'State University',
      content: 'MarkScanner has revolutionized how I grade exams. What used to take hours now takes minutes, and quality is outstanding.',
      rating: 5,
    },
    {
      name: 'Prof. Michael Chen',
      role: 'Computer Science Department',
      institution: 'Tech Institute',
      content: 'The AI accuracy is impressive, and analytics help me identify common misconceptions in my classes immediately.',
      rating: 5,
    },
    {
      name: 'Dr. Emily Rodriguez',
      role: 'English Literature',
      institution: 'Liberal Arts College',
      content: 'The grade appeal system has improved transparency and student satisfaction significantly. Highly recommended!',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar isAuthenticated={false} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 bg-blue-100 text-blue-800">
              <Zap className="mr-2 h-3 w-3" />
              AI-Powered Exam Grading
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Grade Exams with
              <span className="text-blue-600"> AI Precision</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Transform your grading process with advanced AI technology. Save time, ensure consistency, 
              and provide detailed feedback to students in minutes, not hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button size="lg" className="text-lg px-8 py-3">
                  <GraduationCap className="mr-2 h-5 w-5" />
                  Request Access
                </Button>
              </Link>
              <Link href="/#features">
                <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                  Learn More
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">90%</div>
                <div className="text-gray-600">Time Saved</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">95%</div>
                <div className="text-gray-600">Accuracy Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">10K+</div>
                <div className="text-gray-600">Exams Graded</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">4.9★</div>
                <div className="text-gray-600">User Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Modern Education
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to streamline your grading workflow and enhance student learning
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How MarkScanner Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started in minutes with our simple three-step process
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload Papers</h3>
              <p className="text-gray-600">
                Scan or upload student papers in PDF or image format. Our system accepts bulk uploads for efficiency.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
              <p className="text-gray-600">
                Our advanced AI analyzes content, applies grading rubrics, and provides detailed feedback and annotations.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Review & Publish</h3>
              <p className="text-gray-600">
                Review AI-generated grades, make adjustments if needed, and publish results to students instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Benefits Tailored for You
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how MarkScanner transforms educational experience
            </p>
          </div>
          
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-lg shadow-sm p-1 inline-flex">
              <button
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'professors'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setActiveTab('professors')}
              >
                For Professors
              </button>
              <button
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'students'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setActiveTab('students')}
              >
                For Students
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(activeTab === 'professors' ? professorBenefits : studentBenefits).map((benefit, index) => (
              <div key={index} className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Educators Worldwide
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See what our users have to say about their experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                    <div className="text-sm text-blue-600">{testimonial.institution}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <GraduationCap className="h-8 w-8 text-blue-400" />
                <span className="text-xl font-bold text-white">MarkScanner</span>
              </div>
              <p className="text-sm">
                AI-powered exam grading solution for modern education.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/landing#features" className="hover:text-white">Features</Link></li>
                <li><Link href="/landing#how-it-works" className="hover:text-white">How it Works</Link></li>
                <li><Link href="/login" className="hover:text-white">Request Access</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/#about" className="hover:text-white">About</Link></li>
                <li><Link href="#" className="hover:text-white">Blog</Link></li>
                <li><Link href="#" className="hover:text-white">Careers</Link></li>
                <li><Link href="#" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white">Help Center</Link></li>
                <li><Link href="#" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-white">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-white">Status</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2024 MarkScanner. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}