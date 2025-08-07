import React from 'react'
import { Badge } from '@/components/ui/badge'
import { CalendarDays, TrendingUp, Users, Activity } from 'lucide-react'

export function DashboardHeader() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="relative">
      {/* Glassmorphism background */}
      <div className="absolute inset-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-2xl" />
      
      <div className="relative p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Left side - Title and description */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl  flex items-center justify-center shadow-lg">
                <img src="/Ask_Axle_256x256.png" alt="Axle Logo" className="h-full w-full object-contain" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 dark:from-slate-100 dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
                  Axle Dashboard
                </h1>
                <p className="text-slate-600 dark:text-slate-400 font-medium">
                  Analytics & Administration Portal
                </p>
              </div>
            </div>
          </div>

          {/* Right side - Quick stats and date */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Date badge */}
            <Badge variant="secondary" className="text-sm px-4 py-2 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CalendarDays className="h-4 w-4 mr-2" />
              {currentDate}
            </Badge>
            
            {/* Quick status indicators */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-medium text-green-700 dark:text-green-300">
                  System Online
                </span>
              </div>
              
              
            </div>
          </div>
        </div>

       
      </div>
    </div>
  )
} 