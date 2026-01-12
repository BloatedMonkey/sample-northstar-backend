/**
 * Northstar Platform - Root Layout
 * 
 * @author Arman Hazrati
 * @license MIT
 * @copyright 2024 Arman Hazrati. All rights reserved.
 * 
 * This is a portfolio project demonstrating enterprise-level full-stack development.
 * Unauthorized use, duplication, or distribution without proper attribution is prohibited.
 */
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Northstar - Service Platform',
  description: 'Enterprise-grade service orchestration platform built by Arman Hazrati',
  authors: [{ name: 'Arman Hazrati' }],
  keywords: ['service platform', 'business', 'enterprise', 'API', 'full-stack', 'portfolio'],
  creator: 'Arman Hazrati',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script id="copyright-notice" strategy="beforeInteractive">
          {`
            console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #3b82f6; font-weight: bold;');
            console.log('%c🏗️  NORTHSTAR PLATFORM', 'color: #3b82f6; font-size: 20px; font-weight: bold;');
            console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #3b82f6; font-weight: bold;');
            console.log('%c© ${new Date().getFullYear()} Arman Hazrati. All Rights Reserved.', 'color: #6b7280; font-size: 12px;');
            console.log('%cDeveloper: Arman Hazrati', 'color: #10b981; font-weight: bold;');
            console.log('%cLicense: MIT', 'color: #6b7280;');
            console.log('%cPortfolio Project', 'color: #8b5cf6; font-weight: bold;');
            console.log('%c', '');
            console.log('%c⚠️  This is a portfolio project.', 'color: #f59e0b; font-weight: bold;');
            console.log('%cUnauthorized use or reproduction without attribution is prohibited.', 'color: #ef4444;');
            console.log('%c', '');
            console.log('%cTech Stack:', 'color: #3b82f6; font-weight: bold;');
            console.log('%c  • Frontend: Next.js 14, React, TypeScript, TailwindCSS', 'color: #6b7280;');
            console.log('%c  • Backend: NestJS, PostgreSQL, Redis, Prisma ORM', 'color: #6b7280;');
            console.log('%c  • DevOps: Docker, Kubernetes, GitHub Actions', 'color: #6b7280;');
            console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #3b82f6; font-weight: bold;');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
