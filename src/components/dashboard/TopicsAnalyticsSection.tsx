"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, TrendingUp } from 'lucide-react'

export function TopicsAnalyticsSection() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [lastAnalyzed, setLastAnalyzed] = useState<string | null>(null)
  const [messageCount, setMessageCount] = useState<number | null>(null)
  const [generatedBy, setGeneratedBy] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load saved analytics on component mount
  useEffect(() => {
    loadSavedAnalytics()
  }, [])

  const loadSavedAnalytics = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/dashboard/analytics/topics')
      const data = await response.json()

      if (response.ok && data.success && data.analytics) {
        const analytics = data.analytics
        setAnalysis(analytics.analysis)
        setMessageCount(analytics.messageCount)
        setGeneratedBy(analytics.generatedBy)
        setLastAnalyzed(new Date(analytics.createdAt).toLocaleString())
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
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
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
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Analysis Results */}
          {analysis && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Last Week's Topic Analysis</h4>
              <div className="text-sm text-blue-800 whitespace-pre-wrap">
                {analysis?.replace(/\*\*/g, '')}
              </div>
              {messageCount !== null && (
                <div className="mt-3 text-xs text-blue-600">
                  Based on {messageCount} user messages from the last 7 days
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

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-8 text-gray-500">
              <Loader2 className="h-8 w-8 mx-auto mb-3 animate-spin text-gray-400" />
              <p className="text-sm">Loading saved analytics...</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !analysis && !error && !isAnalyzing && (
            <div className="text-center py-8 text-gray-500">
              <TrendingUp className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">
                Click "Analyze Topics" to get AI insights on the most discussed topics from the last week.
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