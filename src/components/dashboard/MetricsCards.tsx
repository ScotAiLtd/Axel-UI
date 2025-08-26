import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Users, MessageSquare } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string
  icon: React.ReactNode
  loading?: boolean
}

function MetricCard({ title, value, icon, loading = false }: MetricCardProps) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground">
            {loading ? '...' : value}
          </p>
        </div>
        <div className="rounded-full p-3 bg-muted">
          {icon}
        </div>
      </div>
    </Card>
  )
}

interface DashboardMetrics {
  totalUsers: number
  totalChatMessages: number
  activeChatUsers: number
}

export function MetricsCards() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/dashboard/metrics')
        const data = await response.json()
        
        if (data.success) {
          setMetrics(data.metrics)
        } else {
          setError(data.error || 'Failed to fetch metrics')
        }
      } catch (err) {
        setError('Failed to fetch metrics')
        console.error('Error fetching metrics:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [])

  const metricsData = [
    {
      title: 'Total Users',
      value: metrics ? metrics.totalUsers.toString() : '0',
      icon: <Users className="h-6 w-6 text-blue-500" />
    },
    {
      title: 'Chat Sessions',
      value: metrics ? Math.floor(metrics.totalChatMessages/2).toString() : '0',
      icon: <MessageSquare className="h-6 w-6 text-green-500" />
    }
  ]

  if (error) {
    // Show error state but keep the card layout
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {metricsData.map((metric, index) => (
          <MetricCard 
            key={index} 
            title={metric.title}
            value="Error"
            icon={metric.icon}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {metricsData.map((metric, index) => (
        <MetricCard 
          key={index} 
          {...metric} 
          loading={loading}
        />
      ))}
    </div>
  )
} 