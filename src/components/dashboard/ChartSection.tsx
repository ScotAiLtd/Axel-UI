import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TrendingUp, Loader2, Users, MessageSquare } from 'lucide-react'

interface ActivityStats {
  totalUsers: number
  totalSessions: number
  totalMessages: number
}

type TimePeriod = '24h' | '1w' | '1m'

export function ChartSection() {
  const [activityStats, setActivityStats] = useState<ActivityStats | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('1w')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const periodLabels = {
    '24h': 'Past 24 Hours',
    '1w': 'Past Week', 
    '1m': 'Past Month'
  }

  useEffect(() => {
    fetchActivityStats(selectedPeriod)
  }, [selectedPeriod])

  const fetchActivityStats = async (period: TimePeriod) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/dashboard/stats?period=${period}`)
      const data = await response.json()
      
      if (data.success) {
        setActivityStats(data.stats)
      } else {
        setError(data.error || 'Failed to fetch stats')
      }
    } catch (err) {
      setError('Failed to fetch stats')
      console.error('Error fetching stats:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold">Activity Overview</CardTitle>
          <Badge variant="secondary" className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            {periodLabels[selectedPeriod]}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <div className="text-sm text-muted-foreground">Loading stats...</div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold">Activity Overview</CardTitle>
          <Badge variant="destructive" className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            Error
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-sm text-red-500">{error}</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!activityStats) {
    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold">Activity Overview</CardTitle>
          <Badge variant="secondary" className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            Total Stats
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-sm text-muted-foreground">No data available</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Calculate pie chart data
  const total = activityStats.totalUsers + activityStats.totalSessions
  const userPercentage = total > 0 ? (activityStats.totalUsers / total) * 100 : 50
  const sessionPercentage = total > 0 ? (activityStats.totalSessions / total) * 100 : 50

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">Activity Overview</CardTitle>
        <Badge variant="secondary" className="flex items-center gap-1">
          <TrendingUp className="h-3 w-3" />
          {periodLabels[selectedPeriod]}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Time Period Filters */}
          <div className="flex gap-2 justify-center">
            {(Object.keys(periodLabels) as TimePeriod[]).map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod(period)}
                className="text-xs"
              >
                {periodLabels[period]}
              </Button>
            ))}
          </div>

          {/* Pie Chart */}
          <div className="flex items-center justify-center">
            <div className="relative w-48 h-48">
              <svg width="192" height="192" className="transform -rotate-90">
                {/* Background circle */}
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  fill="none"
                  stroke="#f1f5f9"
                  strokeWidth="12"
                />
                
                {/* Users segment */}
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="12"
                  strokeDasharray={`${(userPercentage / 100) * 502.65} 502.65`}
                  strokeDashoffset="0"
                  className="transition-all duration-500"
                />
                
                {/* Sessions segment */}
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="12"
                  strokeDasharray={`${(sessionPercentage / 100) * 502.65} 502.65`}
                  strokeDashoffset={`-${(userPercentage / 100) * 502.65}`}
                  className="transition-all duration-500"
                />
              </svg>
              
              {/* Center text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{total}</div>
                  <div className="text-xs text-gray-500">Total Activity</div>
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <span className="text-sm">Users ({activityStats.totalUsers})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="text-sm">Sessions ({activityStats.totalSessions})</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{activityStats.totalUsers}</div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <MessageSquare className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{activityStats.totalSessions}</div>
              <div className="text-sm text-gray-600">Chat Sessions</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 