"use client"

import { useState, useRef, useEffect } from "react"
import { Expand, Trash, Send, Loader2, AlertCircle, Copy, Check, Mic } from "lucide-react"
import { Message, ChatRequest, ChatResponse, ApiErrorResponse } from "@/types/chat"
import ReactMarkdown from 'react-markdown'

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm Axle. How can I help you today?",
      timestamp: "Just now"
    }
  ])
  const [inputValue, setInputValue] = useState("")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copiedMessageId, setCopiedMessageId] = useState<number | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleCopyToClipboard = (text: string, messageIndex: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedMessageId(messageIndex)
      setTimeout(() => setCopiedMessageId(null), 2000) // Reset after 2 seconds
    }).catch(err => {
      console.error('Failed to copy text: ', err)
    })
  }
  
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
    document.body.classList.toggle('chat-fullscreen')
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [inputValue])

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "Hello! I'm Axle. How can I help you today?",
        timestamp: "Just now"
      }
    ])
    setError(null)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value)
    setError(null) // Clear error when user starts typing
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTimestamp = (): string => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const sendMessage = async () => {
    if (inputValue.trim() === "" || isLoading) return

    const userMessage: Message = {
      role: "user",
      content: inputValue,
      timestamp: formatTimestamp()
    }

    // Add user message immediately
    setMessages(prev => [...prev, userMessage])
    const currentInput = inputValue
    setInputValue("")
    setIsLoading(true)
    setError(null)

    try {
      // Call the chat API
      const requestBody: ChatRequest = {
        message: currentInput,
        // namespace is optional and will use the default from env
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      const responseData: ChatResponse | ApiErrorResponse = await response.json()

      if (!response.ok) {
        const errorResponse = responseData as ApiErrorResponse
        throw new Error(errorResponse.error || 'Failed to get response')
      }

      const chatResponse = responseData as ChatResponse
      
      // Add assistant response
      const assistantMessage: Message = {
        role: "assistant",
        content: chatResponse.message,
        timestamp: formatTimestamp()
      }

      setMessages(prev => [...prev, assistantMessage])

    } catch (error) {
      console.error('Error sending message:', error)
      
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
      setError(errorMessage)
      
      // Add error message to chat
      const errorAssistantMessage: Message = {
        role: "assistant", 
        content: `I apologize, but I encountered an error: ${errorMessage}. Please try again.`,
        timestamp: formatTimestamp()
      }
      
      setMessages(prev => [...prev, errorAssistantMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`chat-panel flex flex-col h-full w-full ${isFullscreen ? "fixed inset-0 z-50" : ""}`}>
      <div className="panel-header flex justify-between items-center p-2 sm:p-4 bg-white border-b border-border z-10">
        <h2 className="text-base sm:text-lg font-semibold text-primary">Knowledge Assistant</h2>
        <div className="header-controls flex gap-2">
          <button 
            onClick={clearChat}
            className="bg-transparent border-none text-muted-foreground hover:bg-secondary hover:text-primary p-2 rounded transition-all"
            title="Clear conversation"
            disabled={isLoading}
          >
            <Trash size={18} />
          </button>
          <button 
            onClick={toggleFullscreen}
            className="bg-transparent border-none text-muted-foreground hover:bg-secondary hover:text-primary p-2 rounded transition-all"
            title="Toggle fullscreen"
          >
            <Expand size={18} />
          </button>
        </div>
      </div>

      {error && (
        <div className="error-banner bg-red-50 border-l-4 border-red-400 p-3 mx-4 mt-2 rounded">
          <div className="flex items-center">
            <AlertCircle className="text-red-400 mr-2" size={16} />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        </div>
      )}

      <div className="chat-messages flex-1 p-2 sm:p-4 overflow-y-auto bg-white flex flex-col gap-3 sm:gap-4">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`message max-w-[90%] sm:max-w-[85%] p-2 sm:p-3 rounded shadow-sm ${
              message.role === "user" 
                ? "user bg-blue-50 self-end rounded-br-sm animate-slide-in-right" 
                : "assistant bg-gray-50 self-start rounded-bl-sm animate-slide-in-left"
            }`}
          >
            <div className="message-content text-[0.9rem] sm:text-[0.95rem]">
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown
                  components={{
                    // Customize rendering for different elements
                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                    strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
                    em: ({ children }) => <em className="italic">{children}</em>,
                    code: ({ children }) => (
                      <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-gray-800">
                        {children}
                      </code>
                    ),
                    pre: ({ children }) => (
                      <pre className="bg-gray-100 p-3 rounded text-sm font-mono overflow-x-auto">
                        {children}
                      </pre>
                    ),
                    ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                    li: ({ children }) => <li className="text-[0.95rem]">{children}</li>,
                    h1: ({ children }) => <h1 className="text-lg font-semibold mb-2">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-base font-semibold mb-2">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-sm font-semibold mb-1">{children}</h3>,
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-gray-300 pl-3 italic text-gray-700">
                        {children}
                      </blockquote>
                    ),
                    a: ({ href, children }) => (
                      <a 
                        href={href} 
                        className="text-blue-600 hover:text-blue-800 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {children}
                      </a>
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            </div>
            <div className="flex justify-between items-center mt-1">
              <div className="flex-1">
                {message.role === 'assistant' && (
                  <button 
                    onClick={() => handleCopyToClipboard(message.content, index)}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1 -ml-1 rounded"
                    title={copiedMessageId === index ? 'Copied!' : 'Copy text'}
                  >
                    {copiedMessageId === index ? (
                      <Check size={14} className="text-green-500" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                )}
              </div>
              <div className="message-time text-[0.7rem] text-black text-right">
                {message.timestamp}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="assistant bg-gray-50 self-start rounded-bl-sm max-w-[90%] sm:max-w-[85%] p-2 sm:p-3 rounded shadow-sm animate-slide-in-left">
            <div className="flex items-center gap-2 text-[0.95rem] text-muted-foreground">
              <Loader2 size={16} className="animate-spin" />
              <span>Axle is thinking...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area flex p-3 sm:p-4 bg-white border-t border-border">
        <div className="relative w-full">
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Enter your question..."
            className="w-full border border-gray-200 rounded-3xl py-1.5 sm:py-1.5 pl-4 sm:pl-5 pr-24 sm:pr-28 resize-none outline-none text-sm sm:text-base min-h-[24px] sm:min-h-[26px] max-h-[100px] sm:max-h-[120px] overflow-y-auto shadow-sm focus:border-accent focus:shadow-accent disabled:opacity-50 transition-all leading-normal"
            disabled={isLoading}
            style={{ scrollbarWidth: 'thin' }}
          />
          
          {/* Icons container */}
          <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 sm:gap-3">
            {/* Mic Icon */}
            <button
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all hover:opacity-80"
              style={{ backgroundColor: '#1F3A8A' }}
              title="Voice input (coming soon)"
              disabled={isLoading}
            >
              <Mic size={14} className="sm:w-[16px] sm:h-[16px] text-white" />
            </button>
            
            {/* Send Button */}
            <button
              onClick={sendMessage}
              disabled={isLoading || inputValue.trim() === ""}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all hover:opacity-80"
              style={{ 
                backgroundColor: isLoading || inputValue.trim() === "" ? '#8A92AA' : '#1F3A8A',
                cursor: isLoading || inputValue.trim() === "" ? 'not-allowed' : 'pointer'
              }}
              title="Send message"
            >
              <Send size={14} className="sm:w-[16px] sm:h-[16px] text-white" />
            </button>
          </div>
        </div>
      </div>

      <div className="mx-2 mb-0 rounded-lg text-center text-[10px] sm:text-xs text-muted-foreground py-0.5">
        Brought to you by <span className="font-semibold text-primary">ScotAi</span>, powered by <span className="font-semibold text-accent">mAint</span>
      </div>
    </div>
  )
}
