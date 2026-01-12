/**
 * Northstar Platform - Footer Component
 * 
 * @author Arman Hazrati
 * @license MIT
 * @description Application footer with copyright and attribution
 * 
 * This is a portfolio project demonstrating enterprise-level full-stack development.
 * Unauthorized use, duplication, or distribution without proper attribution is prohibited.
 */
'use client';

import { Building2, Github, Linkedin, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Building2 className="h-6 w-6 text-primary-600" />
              <span className="text-lg font-bold text-gray-900">Northstar</span>
            </div>
            <p className="text-sm text-gray-600">
              Enterprise-grade service orchestration platform built with modern technologies.
            </p>
          </div>

          {/* Tech Stack */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Technology Stack</h3>
            <div className="flex flex-wrap gap-2">
              {['Next.js', 'NestJS', 'TypeScript', 'PostgreSQL', 'Redis', 'Docker'].map(
                (tech) => (
                  <span
                    key={tech}
                    className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700"
                  >
                    {tech}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Resources</h3>
            <div className="flex flex-col space-y-2 text-sm">
              <a href="/api/docs" className="text-gray-600 hover:text-primary-600">
                API Documentation
              </a>
              <a href="https://github.com" className="text-gray-600 hover:text-primary-600">
                GitHub Repository
              </a>
            </div>
          </div>
        </div>

        {/* Copyright & Attribution */}
        <div className="mt-8 border-t pt-8">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <div className="text-center text-sm text-gray-600 md:text-left">
              <p className="font-semibold">
                © {new Date().getFullYear()} Northstar Platform. All rights reserved.
              </p>
              <p className="mt-1">
                Developed by{' '}
                <span className="font-semibold text-primary-600">Arman Hazrati</span>
              </p>
              <p className="mt-1 text-xs">
                Licensed under MIT License. This is a portfolio project demonstrating
                enterprise-level full-stack development.
              </p>
            </div>

            {/* Social Links (optional - user can customize) */}
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors hover:text-gray-600"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors hover:text-gray-600"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="mailto:contact@example.com"
                className="text-gray-400 transition-colors hover:text-gray-600"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Attribution Badge */}
          <div className="mt-4 flex justify-center">
            <div className="inline-flex items-center space-x-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-2 text-xs font-medium text-primary-700">
              <span>🏗️</span>
              <span>Built by Arman Hazrati</span>
              <span className="mx-2">•</span>
              <span>Full-Stack TypeScript</span>
              <span className="mx-2">•</span>
              <span>Portfolio Project</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
