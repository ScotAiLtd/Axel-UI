'use client';

import { useState, useEffect } from 'react';
import { DocumentSource } from '@/types/chat';

interface EmbeddedTextResponse {
  namespace: string;
  totalDocuments: number;
  documents: Array<{
    id: number;
    content: string;
    contentLength: number;
    metadata?: Record<string, any>;
    score?: number;
    preview: string;
  }>;
  statistics: {
    averageContentLength: number;
    totalCharacters: number;
    documentsWithMetadata: number;
  };
  timestamp: string;
}

export default function EmbeddedTextPage() {
  const [data, setData] = useState<EmbeddedTextResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [namespace, setNamespace] = useState('');
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const fetchEmbeddedText = async (ns?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const url = ns 
        ? `/api/embedded-text?namespace=${encodeURIComponent(ns)}`
        : '/api/embedded-text';
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch embedded text');
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmbeddedText();
  }, []);

  const handleNamespaceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (namespace.trim()) {
      fetchEmbeddedText(namespace.trim());
    }
  };

  const toggleExpanded = (id: number) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const filteredDocuments = data?.documents.filter(doc =>
    doc.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    JSON.stringify(doc.metadata).toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading embedded text...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
          <div className="text-red-500 text-center mb-4">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-semibold">Error</h2>
          </div>
          <p className="text-gray-700 text-center mb-4">{error}</p>
          <button
            onClick={() => fetchEmbeddedText()}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="relative w-full h-full">
      <div className="absolute inset-0 overflow-y-auto">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">📚 Embedded Text Viewer</h1>
            
            {/* Namespace Search */}
            <form onSubmit={handleNamespaceSubmit} className="mb-6">
              <div className="flex gap-4">
                <input
                  type="text"
                  value={namespace}
                  onChange={(e) => setNamespace(e.target.value)}
                  placeholder="Enter namespace (leave empty for default)"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Load Namespace
                </button>
              </div>
            </form>

            {/* Statistics */}
            {data && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-600">Namespace</h3>
                  <p className="text-lg font-semibold text-blue-600 truncate">{data.namespace}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-600">Total Documents</h3>
                  <p className="text-2xl font-bold text-green-600">{data.totalDocuments}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-600">Avg Length</h3>
                  <p className="text-lg font-semibold text-purple-600">{data.statistics.averageContentLength} chars</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-600">Total Characters</h3>
                  <p className="text-lg font-semibold text-orange-600">{data.statistics.totalCharacters.toLocaleString()}</p>
                </div>
              </div>
            )}

            {/* Search */}
            <div className="mb-4">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="🔍 Search in documents..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Documents List */}
          {data && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Documents ({searchTerm ? filteredDocuments.length : data.totalDocuments})
              </h2>
              
              {filteredDocuments.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <p className="text-gray-500">
                    {searchTerm ? 'No documents match your search.' : 'No documents found in this namespace.'}
                  </p>
                </div>
              ) : (
                filteredDocuments.map((doc) => (
                  <div key={doc.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Document #{doc.id}
                        </h3>
                        <div className="flex gap-2 text-sm text-gray-500">
                          <span className="bg-gray-100 px-2 py-1 rounded">
                            {doc.contentLength} chars
                          </span>
                          {doc.score && (
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              Score: {doc.score.toFixed(3)}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-gray-700 leading-relaxed">
                          {expandedIds.has(doc.id) ? doc.content : doc.preview}
                        </p>
                        
                        {doc.content.length > 150 && (
                          <button
                            onClick={() => toggleExpanded(doc.id)}
                            className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            {expandedIds.has(doc.id) ? '🔼 Show Less' : '🔽 Show More'}
                          </button>
                        )}
                      </div>
                      
                      {doc.metadata && Object.keys(doc.metadata).length > 0 && (
                        <details className="mt-4">
                          <summary className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-800">
                            📋 Metadata ({Object.keys(doc.metadata).length} fields)
                          </summary>
                          <div className="mt-2 bg-gray-50 p-3 rounded-lg">
                            <pre className="text-xs text-gray-700 overflow-auto">
                              {JSON.stringify(doc.metadata, null, 2)}
                            </pre>
                          </div>
                        </details>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
          
          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-500">
            {data && (
              <p>Last updated: {new Date(data.timestamp).toLocaleString()}</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
} 