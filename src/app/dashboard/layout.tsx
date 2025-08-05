import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Dashboard | Axel',
  description: 'Analytics and administration dashboard for Axel',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      <div className="flex flex-col h-screen">
        {/* Dashboard Navigation */}
        <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex-shrink-0 shadow-sm">
          <div className="flex h-16 items-center px-6">
            <div className="flex items-center space-x-4">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                Axel Admin
              </h1>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
} 