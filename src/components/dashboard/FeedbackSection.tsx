"use client"

import React, { useState, useEffect } from 'react'
import { MessageSquare, Clock, CheckCircle, XCircle, AlertCircle, Eye } from 'lucide-react'

interface FeedbackItem {
  id: string
  title: string
  content: string
  category: string
  status: string
  createdAt: string
  user: {
    id: string
    name: string | null
    email: string | null
  }
}

const statusColors = {
  open: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  resolved: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-800'
}

const statusIcons = {
  open: AlertCircle,
  in_progress: Clock,
  resolved: CheckCircle,
  closed: XCircle
}

const categoryColors = {
  general: 'bg-gray-100 text-gray-800',
  bug: 'bg-red-100 text-red-800',
  feature: 'bg-purple-100 text-purple-800',
  improvement: 'bg-blue-100 text-blue-800'
}

export function FeedbackSection() {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    loadFeedback()
  }, [])

  const loadFeedback = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/feedback')
      
      if (response.ok) {
        const data = await response.json()
        setFeedback(data.feedback)
      } else {
        console.error('Failed to load feedback')
      }
    } catch (error) {
      console.error('Error loading feedback:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateFeedbackStatus = async (feedbackId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/feedback', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ feedbackId, status: newStatus }),
      })

      if (response.ok) {
        // Update local state
        setFeedback(prev => prev.map(item => 
          item.id === feedbackId ? { ...item, status: newStatus } : item
        ))
        
        // Update selected feedback if it's the one being updated
        if (selectedFeedback?.id === feedbackId) {
          setSelectedFeedback(prev => prev ? { ...prev, status: newStatus } : null)
        }
      } else {
        console.error('Failed to update feedback status')
      }
    } catch (error) {
      console.error('Error updating feedback status:', error)
    }
  }

  const openFeedbackModal = (item: FeedbackItem) => {
    setSelectedFeedback(item)
    setIsModalOpen(true)
  }

  const closeFeedbackModal = () => {
    setSelectedFeedback(null)
    setIsModalOpen(false)
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <MessageSquare size={20} />
          User Feedback
        </h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <MessageSquare size={20} />
          User Feedback ({feedback.length})
        </h3>
        
        {feedback.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No feedback submitted yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {feedback.map((item) => {
              const StatusIcon = statusIcons[item.status as keyof typeof statusIcons]
              
              return (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-gray-900">{item.title}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[item.category as keyof typeof categoryColors]}`}>
                          {item.category}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusColors[item.status as keyof typeof statusColors]}`}>
                          <StatusIcon size={12} />
                          {item.status.replace('_', ' ')}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                        {item.content}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>
                          From: {item.user.email || 'Unknown User'}
                        </span>
                        <span>
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => openFeedbackModal(item)}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      
                      {item.status !== 'resolved' && (
                        <select
                          value={item.status}
                          onChange={(e) => updateFeedbackStatus(item.id, e.target.value)}
                          className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="open">Open</option>
                          <option value="in_progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                          <option value="closed">Closed</option>
                        </select>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Feedback Detail Modal */}
      {isModalOpen && selectedFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Feedback Details</h3>
              <button
                onClick={closeFeedbackModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <p className="text-gray-900">{selectedFeedback.title}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${categoryColors[selectedFeedback.category as keyof typeof categoryColors]}`}>
                      {selectedFeedback.category}
                    </span>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusColors[selectedFeedback.status as keyof typeof statusColors]}`}>
                      {selectedFeedback.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                  <p className="text-gray-600">
                    {selectedFeedback.user.email || 'Unknown User'}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Submitted</label>
                  <p className="text-gray-600">
                    {new Date(selectedFeedback.createdAt).toLocaleString()}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Details</label>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-900 whitespace-pre-wrap">{selectedFeedback.content}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Update Status</label>
                  <select
                    value={selectedFeedback.status}
                    onChange={(e) => updateFeedbackStatus(selectedFeedback.id, e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={closeFeedbackModal}
                className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 