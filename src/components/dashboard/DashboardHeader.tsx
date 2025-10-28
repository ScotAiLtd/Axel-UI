'use client'

import React, { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { CalendarDays, User, RefreshCw, Info } from 'lucide-react'

export function DashboardHeader() {
  const [azureAdGroup, setAzureAdGroup] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('/api/user/profile')
        if (response.ok) {
          const data = await response.json()
          setAzureAdGroup(data.user.azureAdGroup)
        }
      } catch (error) {
        console.error('Error fetching user profile:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserProfile()
  }, [])

  const handleRoleChange = async (newRole: string) => {
    setIsUpdating(true)
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ azureAdGroup: newRole }),
      })

      if (response.ok) {
        setAzureAdGroup(newRole)
      } else {
        console.error('Failed to update role')
      }
    } catch (error) {
      console.error('Error updating role:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const getRoleDisplay = () => {
    if (isLoading) return 'Loading...'
    if (azureAdGroup === 'ScotAIManagers') return 'Manager'
    if (azureAdGroup === 'ScotAIUsers') return 'Employee'
    return 'null'
  }

  const getNextRole = () => {
    if (azureAdGroup === 'ScotAIManagers') return 'ScotAIUsers'
    return 'ScotAIManagers'
  }

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-2xl" />

      <div className="relative p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
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

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Badge variant="secondary" className="text-sm px-4 py-2 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CalendarDays className="h-4 w-4 mr-2" />
              {currentDate}
            </Badge>

            <div className="flex items-center gap-2 relative">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                  {getRoleDisplay()}
                </span>
              </div>

              {!isLoading && azureAdGroup && (
                <>
                  <button
                    onClick={() => handleRoleChange(getNextRole())}
                    disabled={isUpdating}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Switch role temporarily"
                  >
                    <RefreshCw className={`h-3 w-3 text-indigo-600 dark:text-indigo-400 ${isUpdating ? 'animate-spin' : ''}`} />
                    <span className="text-xs font-medium text-indigo-700 dark:text-indigo-300">
                      Switch
                    </span>
                  </button>

                  <button
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Info className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                  </button>

                  {showTooltip && (
                    <div className="absolute top-full right-0 mt-2 w-72 p-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs rounded-lg shadow-xl z-50">
                      <p className="font-semibold mb-1">Temporary Role Switch</p>
                      <p>This change is temporary. Your original role will be restored when you log in again.</p>
                      <div className="absolute -top-2 right-4 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-slate-900 dark:border-b-slate-100"></div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 