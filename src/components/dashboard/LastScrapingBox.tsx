import React from 'react'
import { Card } from '@/components/ui/card'
import { Calendar } from 'lucide-react'

export function LastScrapingBox() {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Last Document Scraping</p>
          <p className="text-3xl font-bold text-foreground">July 10th, 2024</p>
        </div>
        <div className="rounded-full p-3 bg-muted">
          <Calendar className="h-6 w-6 text-blue-500" />
        </div>
      </div>
    </Card>
  )
} 