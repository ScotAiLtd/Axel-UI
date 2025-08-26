"use client"

import React, { useState, useEffect } from 'react'
import { Plus, Edit3, Trash2, Eye, EyeOff, BookOpen, Loader2, Calendar } from 'lucide-react'

interface ChangelogEntry {
  id: string
  title: string
  description?: string
  version?: string
  isVisible: boolean
  createdAt: string
  updatedAt: string
}

export function ChangelogManagementSection() {
  const [changelog, setChangelog] = useState<ChangelogEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<ChangelogEntry | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    version: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    loadChangelog()
  }, [])

  const loadChangelog = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/changelog')
      
      if (response.ok) {
        const data = await response.json()
        setChangelog(data.changelog)
      } else {
        console.error('Failed to load changelog')
      }
    } catch (error) {
      console.error('Error loading changelog:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      return
    }

    try {
      setIsSubmitting(true)
      
      const url = editingEntry ? '/api/changelog' : '/api/changelog'
      const method = editingEntry ? 'PATCH' : 'POST'
      const body = editingEntry 
        ? { ...formData, id: editingEntry.id }
        : formData

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        loadChangelog() // Reload the changelog
        resetForm()
      } else {
        const error = await response.json()
        console.error('Failed to save changelog:', error.error)
      }
    } catch (error) {
      console.error('Error saving changelog:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (entry: ChangelogEntry) => {
    setEditingEntry(entry)
    setFormData({
      title: entry.title,
      description: entry.description || '',
      version: entry.version || ''
    })
    setIsFormOpen(true)
  }

  const handleToggleVisibility = async (entry: ChangelogEntry) => {
    try {
      const response = await fetch('/api/changelog', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: entry.id,
          isVisible: !entry.isVisible
        }),
      })

      if (response.ok) {
        loadChangelog()
      } else {
        console.error('Failed to toggle visibility')
      }
    } catch (error) {
      console.error('Error toggling visibility:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this changelog entry?')) {
      return
    }

    try {
      const response = await fetch(`/api/changelog?id=${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        loadChangelog()
      } else {
        console.error('Failed to delete changelog entry')
      }
    } catch (error) {
      console.error('Error deleting changelog:', error)
    }
  }

  const resetForm = () => {
    setFormData({ title: '', description: '', version: '' })
    setEditingEntry(null)
    setIsFormOpen(false)
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BookOpen size={20} />
          Changelog Management
        </h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 h-[600px] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <BookOpen size={20} />
          Changelog Management ({changelog.length})
        </h3>
        <button
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus size={16} className="mr-1" />
          Add Entry
        </button>
      </div>

      {/* Add/Edit Form */}
      {isFormOpen && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="text-md font-medium text-gray-900 mb-3">
            {editingEntry ? 'Edit Changelog Entry' : 'Add New Changelog Entry'}
          </h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter changelog title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Version
                </label>
                <input
                  type="text"
                  value={formData.version}
                  onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., v1.2.0"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Describe the changes..."
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin mr-1" />
                    Saving...
                  </>
                ) : (
                  editingEntry ? 'Update' : 'Create'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Changelog List */}
      <div className="flex-1 overflow-hidden">
        {changelog.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <BookOpen size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No changelog entries found.</p>
          </div>
        ) : (
          <div className="h-full overflow-y-auto space-y-3 pr-2">
            {changelog.map((entry) => (
            <div
              key={entry.id}
              className={`p-4 rounded-lg border ${
                entry.isVisible ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900">{entry.title}</h4>
                    {entry.version && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {entry.version}
                      </span>
                    )}
                    {!entry.isVisible && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        Hidden
                      </span>
                    )}
                  </div>
                  {entry.description && (
                    <p className="text-sm text-gray-600 mb-2">{entry.description}</p>
                  )}
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar size={12} />
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-1 ml-4">
                  <button
                    onClick={() => handleToggleVisibility(entry)}
                    className={`p-2 rounded-md transition-colors ${
                      entry.isVisible
                        ? 'text-green-600 hover:bg-green-50'
                        : 'text-gray-400 hover:bg-gray-100'
                    }`}
                    title={entry.isVisible ? 'Hide from users' : 'Show to users'}
                  >
                    {entry.isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                  <button
                    onClick={() => handleEdit(entry)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    title="Edit entry"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Delete entry"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
