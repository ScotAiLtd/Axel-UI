import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, MessageSquare } from 'lucide-react'

interface TopUser {
  rank: number
  email: string
  messageCount: number
}

export function TopUsersCard() {
  const [topUsers, setTopUsers] = useState<TopUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        const response = await fetch('/api/dashboard/top-users')
        const data = await response.json()
        
        if (data.success) {
          setTopUsers(data.topUsers)
        } else {
          setError(data.error || 'Failed to fetch top users')
        }
      } catch (err) {
        setError('Failed to fetch top users')
        console.error('Error fetching top users:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTopUsers()
  }, [])

  if (loading) {
    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold">Top Chat Users</CardTitle>
          <Users className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="text-sm text-muted-foreground">Loading...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold">Top Chat Users</CardTitle>
          <Users className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="text-sm text-red-500">{error}</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">Top Chat Users</CardTitle>
        <Badge variant="secondary" className="flex items-center gap-1">
          <MessageSquare className="h-3 w-3" />
          Most Active
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {topUsers.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground py-4">
              No chat activity yet
            </div>
          ) : (
            topUsers.map((user) => (
              <div key={user.rank} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-medium text-sm">
                    {user.rank}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {user.email.startsWith('>') ? user.email.slice(1) : user.email}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {user.messageCount/2} messages
                </Badge>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
} 