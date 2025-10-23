"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, TrendingUp } from 'lucide-react'

type UserGroup = 'ScotAIManagers' | 'ScotAIUsers'

export function TopicsAnalyticsSection() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [lastAnalyzed, setLastAnalyzed] = useState<string | null>(null)
  const [messageCount, setMessageCount] = useState<number | null>(null)
  const [generatedBy, setGeneratedBy] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedGroup, setSelectedGroup] = useState<UserGroup>('ScotAIManagers')

  // Load saved analytics when component mounts or when group changes
  useEffect(() => {
    loadSavedAnalytics()
  }, [selectedGroup])

  const loadSavedAnalytics = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/dashboard/analytics/topics?userGroup=${selectedGroup}`)
      const data = await response.json()

      if (response.ok && data.success && data.analytics) {
        const analytics = data.analytics
        setAnalysis(analytics.analysis)
        setMessageCount(analytics.messageCount)
        setGeneratedBy(analytics.generatedBy)
        setLastAnalyzed(new Date(analytics.createdAt).toLocaleString())
      } else {
        // No analytics found for this group
        setAnalysis(null)
        setMessageCount(null)
        setGeneratedBy(null)
        setLastAnalyzed(null)
      }
    } catch (err) {
      console.error('Error loading saved analytics:', err)
      // Don't show error for loading - just start with empty state
    } finally {
      setIsLoading(false)
    }
  }

  const analyzeTopics = async () => {
    try {
      setIsAnalyzing(true)
      setError(null)

      const response = await fetch('/api/dashboard/analytics/topics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userGroup: selectedGroup })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze topics')
      }

      if (data.success && data.analytics) {
        const analytics = data.analytics
        setAnalysis(analytics.analysis)
        setMessageCount(analytics.messageCount)
        setGeneratedBy(analytics.generatedBy)
        setLastAnalyzed(new Date(analytics.createdAt).toLocaleString())
      } else {
        throw new Error(data.error || 'Analysis failed')
      }
    } catch (err) {
      console.error('Error analyzing topics:', err)
      setError(err instanceof Error ? err.message : 'Failed to analyze topics')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-col space-y-3 pb-4">
        <div className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-lg font-semibold">
            Analytics
          </CardTitle>
          <Button
            onClick={analyzeTopics}
            disabled={isAnalyzing}
            size="sm"
            className="flex items-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <TrendingUp className="h-4 w-4" />
                Analyze Topics
              </>
            )}
          </Button>
        </div>

        {/* Group Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedGroup('ScotAIManagers')}
            disabled={isAnalyzing || isLoading}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              selectedGroup === 'ScotAIManagers'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Managers
          </button>
          <button
            onClick={() => setSelectedGroup('ScotAIUsers')}
            disabled={isAnalyzing || isLoading}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              selectedGroup === 'ScotAIUsers'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Users
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Analysis Results */}
          {analysis && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">
                Last Week's Topic Analysis - {selectedGroup === 'ScotAIManagers' ? 'Managers' : 'Users'}
              </h4>
              <div className="text-sm text-blue-800 whitespace-pre-wrap">
                {analysis?.replace(/\*\*/g, '')}
              </div>
              {messageCount !== null && (
                <div className="mt-3 text-xs text-blue-600">
                  Based on {messageCount} {selectedGroup === 'ScotAIManagers' ? 'manager' : 'user'} messages from the last 7 days
                </div>
              )}
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="text-red-700 text-sm">{error}</div>
            </div>
          )}

         

          {/* Empty State */}
          {!isLoading && !analysis && !error && !isAnalyzing && (
            <div className="text-center py-8 text-gray-500">
              <TrendingUp className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">
                Click "Analyze Topics" to get AI insights on the most discussed topics from {selectedGroup === 'ScotAIManagers' ? 'Managers' : 'Users'} in the last week.
              </p>
            </div>
          )}

          {/* Last Analyzed Info */}
          {lastAnalyzed && (
            <div className="text-xs text-gray-500 text-right">
              Last analyzed: {lastAnalyzed}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}