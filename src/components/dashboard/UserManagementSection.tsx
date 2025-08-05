"use client"

import React, { useState, useEffect } from 'react'
import { Users, User, ShieldCheck, MessageSquare, Loader2 } from 'lucide-react'
import { UserRole, roleDisplayNames } from '@/types/user'

interface UserItem {
  id: string
  email: string | null
  role: string
  messageCount: number
}

interface ChatMessage {
  id: string
  content: string
  role: string
  createdAt: string
  userId: string
  user: {
    email: string | null
  }
}

export function UserManagementSection() {
  const [users, setUsers] = useState<UserItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
  const [isChatLoading, setIsChatLoading] = useState(false)
  const [expandedUserIds, setExpandedUserIds] = useState<Set<string>>(new Set())
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/dashboard/users')
      
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
      } else {
        console.error('Failed to load users')
      }
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      setUpdatingUserId(userId)
      const response = await fetch('/api/dashboard/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, role: newRole }),
      })

      if (response.ok) {
        // Update local state
        setUsers(prev => prev.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        ))
      } else {
        const error = await response.json()
        console.error('Failed to update user role:', error.error)
      }
    } catch (error) {
      console.error('Error updating user role:', error)
    } finally {
      setUpdatingUserId(null)
    }
  }

  const loadChatHistory = async (userId: string) => {
    try {
      // If already expanded, collapse it
      if (expandedUserIds.has(userId)) {
        const newExpandedIds = new Set(expandedUserIds)
        newExpandedIds.delete(userId)
        setExpandedUserIds(newExpandedIds)
        return
      }
      
      setIsChatLoading(true)
      setSelectedUserId(userId)
      
      const response = await fetch(`/api/dashboard/chat-history?userId=${userId}`)
      
      if (response.ok) {
        const data = await response.json()
        setChatHistory(data.chatHistory)
        
        // Add this userId to expanded IDs
        const newExpandedIds = new Set(expandedUserIds)
        newExpandedIds.add(userId)
        setExpandedUserIds(newExpandedIds)
      } else {
        console.error('Failed to load chat history')
      }
    } catch (error) {
      console.error('Error loading chat history:', error)
    } finally {
      setIsChatLoading(false)
    }
  }

  const getRoleIcon = (role: string) => {
    if (role === 'ADMIN') return <ShieldCheck size={16} className="text-green-600" />
    return <User size={16} className="text-blue-600" />
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Users size={20} />
          User Management
        </h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Users size={20} />
        User Management ({users.length})
      </h3>
      
      {users.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Users size={48} className="mx-auto mb-4 text-gray-300" />
          <p>No users found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chat Messages
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <React.Fragment key={user.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.email ? (user.email.startsWith('>') ? user.email.slice(1) : user.email) : 'No Email'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        {getRoleIcon(user.role)}
                        <span>{roleDisplayNames[user.role as UserRole]}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.messageCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        {user.messageCount > 0 && (
                          <button
                            onClick={() => loadChatHistory(user.id)}
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <MessageSquare size={14} className="mr-1" />
                            {expandedUserIds.has(user.id) ? 'Hide Chat' : 'Chat History'}
                          </button>
                        )}
                        
                        {updatingUserId === user.id ? (
                          <span className="inline-flex items-center">
                            <Loader2 size={16} className="animate-spin mr-1" /> 
                            Updating...
                          </span>
                        ) : (
                          <select
                            value={user.role}
                            onChange={(e) => updateUserRole(user.id, e.target.value)}
                            className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={updatingUserId === user.id}
                          >
                            <option value="USER">User</option>
                            <option value="ADMIN">Admin</option>
                          </select>
                        )}
                      </div>
                    </td>
                  </tr>
                  {expandedUserIds.has(user.id) && (
                    <tr>
                      <td colSpan={4} className="px-6 py-4">
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-1">
                            <MessageSquare size={16} />
                            Chat History for {user.email ? (user.email.startsWith('>') ? user.email.slice(1) : user.email) : 'Unknown User'}
                          </h4>
                          
                          {isChatLoading && selectedUserId === user.id ? (
                            <div className="flex items-center justify-center py-8">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                          ) : chatHistory.length === 0 && selectedUserId === user.id ? (
                            <div className="text-center py-4 text-gray-500">
                              <MessageSquare size={32} className="mx-auto mb-2 text-gray-300" />
                              <p>No chat messages found.</p>
                            </div>
                          ) : selectedUserId === user.id && (
                            <div className="space-y-3 max-h-[400px] overflow-y-auto">
                              {[...chatHistory]
                                .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                                .map((message) => (
                                  <div 
                                    key={message.id} 
                                    className={`p-3 rounded-lg ${message.role === 'user' 
                                      ? 'bg-blue-50' 
                                      : 'bg-gray-50'}`}
                                  >
                                    <div className="flex justify-between items-start mb-1">
                                      <span className="font-medium">
                                        {message.role === 'user' ? 'User' : 'AI Assistant'}
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        {new Date(message.createdAt).toLocaleString()}
                                      </span>
                                    </div>
                                    <p className="text-gray-800 whitespace-pre-wrap text-sm">{message.content}</p>
                                  </div>
                                ))
                              }
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}