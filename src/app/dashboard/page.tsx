"use client"

import React from 'react'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { MetricsCards } from '@/components/dashboard/MetricsCards'
import { ChartSection } from '@/components/dashboard/ChartSection'
import { LastScrapingBox } from '@/components/dashboard/LastScrapingBox'
import { FeedbackSection } from '@/components/dashboard/FeedbackSection'
import { TopUsersCard } from '@/components/dashboard/TopUsersCard'
import { UserManagementSection } from '@/components/dashboard/UserManagementSection'
import { ChangelogManagementSection } from '@/components/dashboard/ChangelogManagementSection'
import { SystemStatusManagementSection } from '@/components/dashboard/SystemStatusManagementSection'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
      
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Dashboard Header */}
          <div className="mb-8">
            <DashboardHeader />
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
            {/* Left Column - Primary Metrics */}
            <div className="lg:col-span-8 space-y-6">
              {/* Top Metrics Row */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent dark:from-slate-700 ml-4" />
                </div>
                <div className="transform transition-all duration-300 hover:scale-[1.01]">
                  <MetricsCards />
                </div>
              </div>
              
              {/* Activity Overview */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                    Activity Overview
                  </h2>
                  <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent dark:from-slate-700 ml-4" />
                </div>
                <div className="transform transition-all duration-300 hover:scale-[1.01]">
                  <ChartSection />
                </div>
              </div>
            </div>

            {/* Right Column - Secondary Info */}
            <div className="lg:col-span-4 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                  
                </h2>
                <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent dark:from-slate-700 ml-4" />
              </div>
              
              {/* Last Scraping Status */}
              <div className="transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
                <LastScrapingBox />
              </div>
              
              {/* Top Users */}
              <div className="transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
                <TopUsersCard />
              </div>
            </div>
          </div>

          {/* User Management Section */}
          <div className="space-y-6 mb-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                User Management
              </h2>
              <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent dark:from-slate-700 ml-4" />
            </div>
            
            <div className="transform transition-all duration-300 hover:scale-[1.005] hover:shadow-xl">
              <UserManagementSection />
            </div>
          </div>

          {/* Admin Management Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 items-start">
            {/* Changelog Management */}
            <div className="transform transition-all duration-300 hover:scale-[1.005] hover:shadow-xl">
              <ChangelogManagementSection />
            </div>
            
            {/* System Status Management */}
            <div className="transform transition-all duration-300 hover:scale-[1.005] hover:shadow-xl">
              <SystemStatusManagementSection />
            </div>
          </div>

          {/* Bottom Section - Full Width */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                Feedback Management
              </h2>
              <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent dark:from-slate-700 ml-4" />
            </div>
            
            {/* Feedback Management - Full Width */}
            <div className="transform transition-all duration-300 hover:scale-[1.005] hover:shadow-xl">
              <FeedbackSection />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}