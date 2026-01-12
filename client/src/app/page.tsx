/**
 * @author Arman Hazrati
 * Home page - Landing and authentication
 */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { 
  Building2, 
  Shield, 
  Zap, 
  Users, 
  BarChart3, 
  Lock 
} from 'lucide-react';

export default function HomePage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const router = useRouter();

  const features = [
    {
      icon: Building2,
      title: 'Enterprise Ready',
      description: 'Built for scale with production-grade architecture',
    },
    {
      icon: Shield,
      title: 'Secure by Default',
      description: 'JWT authentication, RBAC, and API key management',
    },
    {
      icon: Zap,
      title: 'Real-time Updates',
      description: 'WebSocket support for live notifications',
    },
    {
      icon: Users,
      title: 'Multi-tenancy',
      description: 'Support for businesses, staff, and customers',
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Comprehensive metrics and audit logging',
    },
    {
      icon: Lock,
      title: 'Compliance Ready',
      description: 'GDPR compliant with full audit trails',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">Northstar</span>
          </div>
          <nav className="hidden space-x-6 md:flex">
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Features
            </a>
            <a href="#about" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              About
            </a>
            <a href="#docs" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Docs
            </a>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Hero Section */}
          <div className="flex flex-col justify-center space-y-6">
            <div className="animate-fade-in space-y-4">
              <h1 className="text-5xl font-bold leading-tight text-gray-900 lg:text-6xl">
                Enterprise Service
                <span className="block text-primary-600">Platform</span>
              </h1>
              <p className="text-xl text-gray-600">
                Production-ready backend with modern frontend. Built by senior engineers, for
                senior projects.
              </p>
            </div>

            {/* Features Grid */}
            <div id="features" className="grid gap-4 sm:grid-cols-2">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="group rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-primary-300 hover:shadow-lg"
                  >
                    <Icon className="mb-2 h-6 w-6 text-primary-600 transition-transform group-hover:scale-110" />
                    <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                );
              })}
            </div>

            {/* Tech Stack */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="mb-3 font-semibold text-gray-900">Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  'Next.js 14',
                  'NestJS',
                  'TypeScript',
                  'PostgreSQL',
                  'Redis',
                  'Prisma',
                  'TailwindCSS',
                  'Docker',
                  'Kubernetes',
                ].map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Auth Forms */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md animate-slide-in rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {mode === 'login' ? 'Welcome Back' : 'Get Started'}
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  {mode === 'login'
                    ? 'Sign in to access your dashboard'
                    : 'Create an account to get started'}
                </p>
              </div>

              {mode === 'login' ? (
                <LoginForm onSuccess={() => router.push('/dashboard')} />
              ) : (
                <RegisterForm onSuccess={() => router.push('/dashboard')} />
              )}

              <div className="mt-6 text-center">
                <button
                  onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  {mode === 'login'
                    ? "Don't have an account? Sign up"
                    : 'Already have an account? Sign in'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer with Copyright */}
      <footer className="mt-16 border-t bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="font-semibold text-gray-900">
              © {new Date().getFullYear()} Northstar Platform. All Rights Reserved.
            </p>
            <p className="mt-2 text-sm text-gray-600">
              Developed by <span className="font-semibold text-primary-600">Arman Hazrati</span>
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Licensed under MIT License. Portfolio Project - Enterprise Full-Stack Application
            </p>
            <p className="mt-4 text-xs text-gray-400">
              Built with Next.js 14, NestJS, TypeScript, PostgreSQL, Redis, Docker & Kubernetes
            </p>
          </div>
          
          {/* Attribution Badge */}
          <div className="mt-6 flex justify-center">
            <div className="inline-flex items-center space-x-2 rounded-full border-2 border-primary-300 bg-primary-50 px-6 py-2 text-sm font-semibold text-primary-700 shadow-sm">
              <span>🏗️</span>
              <span>Built by Arman Hazrati</span>
              <span className="mx-2">•</span>
              <span>Senior Full-Stack Engineer</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
