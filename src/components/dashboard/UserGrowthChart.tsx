import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface GrowthDataPoint {
  month: string
  users: number
  growth: number
}

export function UserGrowthChart() {
  const [growthData, setGrowthData] = useState<GrowthDataPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGrowthData = async () => {
      try {
        const response = await fetch('/api/dashboard/user-growth')
        const data = await response.json()
        
        if (data.success) {
          setGrowthData(data.growthData)
        } else {
          setError(data.error || 'Failed to fetch growth data')
        }
      } catch (err) {
        setError('Failed to fetch growth data')
        console.error('Error fetching growth data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchGrowthData()
  }, [])

  // Use mock data if no real data is available or if loading
  const defaultData = [
    { month: 'Jan', users: 0, growth: 0 },
    { month: 'Feb', users: 0, growth: 0 },
    { month: 'Mar', users: 0, growth: 0 },
    { month: 'Apr', users: 0, growth: 0 },
    { month: 'May', users: 0, growth: 0 },
    { month: 'Jun', users: 0, growth: 0 }
  ]

  const displayData = loading || error || growthData.length === 0 ? defaultData : growthData
  const maxUsers = Math.max(...displayData.map(d => d.users), 1) // Ensure at least 1 to avoid division by zero
  const minUsers = Math.min(...displayData.map(d => d.users), 0)

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">User Growth</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-2xl font-bold text-foreground">
            {loading ? '...' : (displayData.length > 0 ? displayData[displayData.length - 1].users.toLocaleString() : '0')}
            <span className="text-sm font-normal text-muted-foreground ml-2">
              total users
            </span>
          </div>
          
          {/* Line chart visualization */}
          <div className="relative h-32">
            <svg className="w-full h-full" viewBox="0 0 300 128">
              {/* Grid lines */}
              <defs>
                <pattern id="grid" width="50" height="32" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Line path */}
              <path
                d={`M ${displayData.map((point, index) => {
                  const x = (index / (displayData.length - 1)) * 280 + 10
                  const y = 120 - ((point.users - minUsers) / (maxUsers - minUsers)) * 100
                  return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
                }).join(' ')}`}
                fill="none"
                stroke="rgb(59, 130, 246)"
                strokeWidth="2"
                className="drop-shadow-sm"
              />
              
              {/* Data points */}
              {displayData.map((point, index) => {
                const x = (index / (displayData.length - 1)) * 280 + 10
                const y = 120 - ((point.users - minUsers) / (maxUsers - minUsers)) * 100
                return (
                  <g key={index}>
                    <circle
                      cx={x}
                      cy={y}
                      r="4"
                      fill="rgb(59, 130, 246)"
                      className="drop-shadow-sm"
                    />
                    <circle
                      cx={x}
                      cy={y}
                      r="2"
                      fill="white"
                    />
                  </g>
                )
              })}
            </svg>
          </div>
          
          {/* Month labels */}
          <div className="flex justify-between text-xs text-muted-foreground">
            {displayData.map((point, index) => (
              <div key={index} className="flex flex-col items-center gap-1">
                <span>{point.month}</span>
                <span className="font-mono">{point.users.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 