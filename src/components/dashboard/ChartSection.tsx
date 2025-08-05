import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp } from 'lucide-react'

export function ChartSection() {
  // Mock data for the chart
  const chartData = [
    { day: 'Mon', users: 120, sessions: 89 },
    { day: 'Tue', users: 98, sessions: 76 },
    { day: 'Wed', users: 145, sessions: 112 },
    { day: 'Thu', users: 167, sessions: 134 },
    { day: 'Fri', users: 189, sessions: 145 },
    { day: 'Sat', users: 156, sessions: 123 },
    { day: 'Sun', users: 134, sessions: 98 }
  ]

  const maxValue = Math.max(...chartData.map(d => Math.max(d.users, d.sessions)))

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">Weekly Activity</CardTitle>
        <Badge variant="secondary" className="flex items-center gap-1">
          <TrendingUp className="h-3 w-3" />
          +12.5%
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Users vs Sessions</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Users</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Sessions</span>
              </div>
            </div>
          </div>
          
          {/* Simple bar chart */}
          <div className="space-y-3">
            {chartData.map((data, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-8 text-xs text-muted-foreground font-mono">
                  {data.day}
                </div>
                <div className="flex-1 space-y-1">
                  {/* Users bar */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full transition-all duration-300"
                        style={{ width: `${(data.users / maxValue) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-muted-foreground w-8">{data.users}</span>
                  </div>
                  {/* Sessions bar */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-full bg-green-500 rounded-full transition-all duration-300"
                        style={{ width: `${(data.sessions / maxValue) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-muted-foreground w-8">{data.sessions}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 