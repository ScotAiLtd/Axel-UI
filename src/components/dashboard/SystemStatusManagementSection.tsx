"use client";

import React, { useState, useEffect } from 'react';
import { Activity, AlertCircle, CheckCircle, Settings, Loader2, Clock } from 'lucide-react';

interface SystemStatus {
  id: string;
  status: string;
  message: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const statusOptions = [
  { value: 'live', label: 'Live', icon: CheckCircle, color: 'green' },
  { value: 'maintenance', label: 'Maintenance', icon: Settings, color: 'yellow' },
  { value: 'issue', label: 'Issue', icon: AlertCircle, color: 'red' }
];

export function SystemStatusManagementSection() {
  const [currentStatus, setCurrentStatus] = useState<SystemStatus | null>(null);
  const [allStatuses, setAllStatuses] = useState<SystemStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    status: 'live',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    loadCurrentStatus();
  }, []);

  const loadCurrentStatus = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/system-status');
      
      if (response.ok) {
        const data = await response.json();
        setCurrentStatus(data.status);
      } else {
        console.error('Failed to load system status');
      }
    } catch (error) {
      console.error('Error loading system status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAllStatuses = async () => {
    try {
      const response = await fetch('/api/system-status/all');
      
      if (response.ok) {
        const data = await response.json();
        setAllStatuses(data.statuses);
      } else {
        console.error('Failed to load status history');
      }
    } catch (error) {
      console.error('Error loading status history:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.message.trim()) {
      return;
    }

    try {
      setIsSubmitting(true);
      
      const response = await fetch('/api/system-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await loadCurrentStatus();
        setFormData({ status: 'live', message: '' });
        setIsFormOpen(false);
      } else {
        const error = await response.json();
        console.error('Failed to update status:', error.error);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusConfig = (status: string) => {
    return statusOptions.find(opt => opt.value === status) || statusOptions[0];
  };

  const toggleHistory = () => {
    if (!showHistory) {
      loadAllStatuses();
    }
    setShowHistory(!showHistory);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Activity size={20} />
          System Status Management
        </h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  const statusConfig = currentStatus ? getStatusConfig(currentStatus.status) : getStatusConfig('live');
  const StatusIcon = statusConfig.icon;

  return (
    <div className="bg-white rounded-lg shadow p-6 h-[600px] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Activity size={20} />
          System Status Management
        </h3>
        <div className="flex gap-2">
          <button
            onClick={toggleHistory}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Clock size={16} className="mr-1" />
            {showHistory ? 'Hide' : 'Show'}
          </button>
          <button
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Settings size={16} className="mr-1" />
            Update Status
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto pr-2">
          {/* Current Status Display */}
          {currentStatus && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="text-md font-medium text-gray-900 mb-3">Current Status</h4>
              <div className="flex items-center gap-3 mb-2">
                <StatusIcon 
                  size={24} 
                  className={
                    currentStatus.status === 'live' ? 'text-green-600' :
                    currentStatus.status === 'maintenance' ? 'text-yellow-600' :
                    currentStatus.status === 'issue' ? 'text-red-600' : 'text-gray-600'
                  }
                />
                <div>
                  <span className={`text-lg font-semibold uppercase ${
                    currentStatus.status === 'live' ? 'text-green-600' :
                    currentStatus.status === 'maintenance' ? 'text-yellow-600' :
                    currentStatus.status === 'issue' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {statusConfig.label}
                  </span>
                  <p className="text-sm text-gray-600 mt-1">{currentStatus.message}</p>
                </div>
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <Clock size={12} />
                Updated: {new Date(currentStatus.updatedAt).toLocaleString()}
              </div>
            </div>
          )}

          {/* Update Form */}
          {isFormOpen && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="text-md font-medium text-gray-900 mb-3">Update System Status</h4>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message *
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Describe the current system status..."
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
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
                        Updating...
                      </>
                    ) : (
                      'Update Status'
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Status History */}
          {showHistory && (
            <div className="space-y-3">
              <h4 className="text-md font-medium text-gray-900">Status History</h4>
              {allStatuses.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  <Activity size={32} className="mx-auto mb-2 text-gray-300" />
                  <p>No status history found.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {allStatuses.map((status) => {
                    const config = getStatusConfig(status.status);
                    const Icon = config.icon;
                    return (
                      <div
                        key={status.id}
                        className={`p-3 rounded-lg border ${
                          status.isActive ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <Icon 
                              size={16} 
                              className={
                                status.status === 'live' ? 'text-green-600' :
                                status.status === 'maintenance' ? 'text-yellow-600' :
                                status.status === 'issue' ? 'text-red-600' : 'text-gray-600'
                              }
                            />
                            <div>
                              <span className={`text-sm font-medium uppercase ${
                                status.status === 'live' ? 'text-green-600' :
                                status.status === 'maintenance' ? 'text-yellow-600' :
                                status.status === 'issue' ? 'text-red-600' : 'text-gray-600'
                              }`}>
                                {config.label}
                              </span>
                              {status.isActive && (
                                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                                  Current
                                </span>
                              )}
                              <p className="text-sm text-gray-600 mt-1">{status.message}</p>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 text-right">
                            {new Date(status.createdAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
