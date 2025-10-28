"use client"

import { useState, useRef, useEffect } from "react"
import { Trash, Send, Loader2, AlertCircle, Copy, Check, Mic, MicOff, LogOut, History, X, Menu, Settings, Activity, MessageSquare, ExternalLink } from "lucide-react"
import { Message, ChatRequest, ChatResponse, ApiErrorResponse } from "@/types/chat"
import { UserRole } from "@/types/user"
import ReactMarkdown from 'react-markdown'


interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "pl", name: "Polish", flag: "🇵🇱" }
];

// Changelog data - will be loaded from API
interface ChangelogEntry {
  id: string
  title: string
  description?: string
  version?: string
  createdAt: string
}

interface SystemStatus {
  id: string
  status: string
  message: string
  isActive: boolean
  createdAt: string
}

const feedbackCategories = [
  { value: "general", label: "General" },
  { value: "bug", label: "Bug Report" },
  { value: "feature", label: "Feature Request" },
  { value: "improvement", label: "Improvement" }
];

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("general")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim() || !content.trim()) {
      return
    }

    try {
      setIsSubmitting(true)
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          category
        }),
      })

      if (response.ok) {
        setSubmitSuccess(true)
        setTitle("")
        setContent("")
        setCategory("general")
        setTimeout(() => {
          setSubmitSuccess(false)
          onClose()
        }, 2000)
      } else {
        throw new Error('Failed to submit feedback')
      }
    } catch (error) {
      console.error('Error submitting feedback:', error)
      alert('Failed to submit feedback. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[85vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Send Feedback</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        {submitSuccess ? (
          <div className="p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <Check size={32} className="text-green-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Thank you!</h4>
            <p className="text-gray-600">Your feedback has been submitted successfully.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div>
              <label htmlFor="feedback-category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="feedback-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {feedbackCategories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="feedback-title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                id="feedback-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Brief description of your feedback"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                maxLength={100}
              />
            </div>
            
            <div>
              <label htmlFor="feedback-content" className="block text-sm font-medium text-gray-700 mb-1">
                Details
              </label>
              <textarea
                id="feedback-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Please provide detailed feedback..."
                rows={6}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                required
                maxLength={1000}
              />
              <div className="text-right text-xs text-gray-500 mt-1">
                {content.length}/1000 characters
              </div>
            </div>
            
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !title.trim() || !content.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Feedback'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copiedMessageId, setCopiedMessageId] = useState<number | null>(null)
  const [isMicActive, setIsMicActive] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(languages[0])
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false)
  const [isChangelogOpen, setIsChangelogOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isStatusOpen, setIsStatusOpen] = useState(false)
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [isLoadingUser, setIsLoadingUser] = useState(true)
  const [userAzureAdGroup, setUserAzureAdGroup] = useState<string | null>(null)
  const [changelogEntries, setChangelogEntries] = useState<ChangelogEntry[]>([])
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const lastResultIndexRef = useRef<number>(0)
  const baseTextRef = useRef<string>("")
  const finalTranscriptRef = useRef<string>("")

  // Load chat history, user profile, changelog, and status on component mount
  useEffect(() => {
    loadChatHistory()
    loadUserProfile()
    loadChangelog()
    loadSystemStatus()
  }, [])

  const loadChatHistory = async () => {
    try {
      setIsLoadingHistory(true)
      const response = await fetch('/api/chat/history')
      
      if (response.ok) {
        const data = await response.json()
        if (data.messages && data.messages.length > 0) {
          setMessages(data.messages)
        } else {
          // Set default welcome message if no history
          setMessages([{
            role: "assistant",
            content: "Hello! I'm Axle. How can I help you today?",
            timestamp: "Just now"
          }])
        }
      } else {
        // If loading fails, set default welcome message
        setMessages([{
          role: "assistant",
          content: "Hello! I'm Axle. How can I help you today?",
          timestamp: "Just now"
        }])
      }
    } catch (error) {
      console.error('Error loading chat history:', error)
      // Set default welcome message on error
      setMessages([{
        role: "assistant",
        content: "Hello! I'm Axle. How can I help you today?",
        timestamp: "Just now"
      }])
    } finally {
      setIsLoadingHistory(false)
    }
  }

  const loadUserProfile = async () => {
    try {
      setIsLoadingUser(true)
      const response = await fetch('/api/user/profile')

      if (response.ok) {
        const data = await response.json()
        setUserRole(data.user.role as UserRole)
        setUserAzureAdGroup(data.user.azureAdGroup)
      }
    } catch (error) {
      console.error('Error loading user profile:', error)
      // Don't break the UI if loading fails
    } finally {
      setIsLoadingUser(false)
    }
  }

  const loadChangelog = async () => {
    try {
      const response = await fetch('/api/changelog')
      if (response.ok) {
        const data = await response.json()
        setChangelogEntries(data.changelog)
      }
    } catch (error) {
      console.error('Error loading changelog:', error)
    }
  }

  const loadSystemStatus = async () => {
    try {
      const response = await fetch('/api/system-status')
      if (response.ok) {
        const data = await response.json()
        setSystemStatus(data.status)
      }
    } catch (error) {
      console.error('Error loading system status:', error)
    }
  }

  const saveChatMessage = async (content: string, role: "user" | "assistant") => {
    try {
      await fetch('/api/chat/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, role }),
      })
    } catch (error) {
      console.error('Error saving chat message:', error)
      // Don't break the UI if saving fails
    }
  }

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMenuOpen) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener('click', handleClickOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isMenuOpen])

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        recognition.continuous = true
        recognition.interimResults = true
        recognition.lang = selectedLanguage.code
        
        recognition.onstart = () => {
          setIsMicActive(true)
          // Store the current text as base text when starting recognition
          baseTextRef.current = inputValue
          finalTranscriptRef.current = ""
          lastResultIndexRef.current = 0
        }
        
        recognition.onresult = (event) => {
          let interimTranscript = ''
          let newFinalTranscript = ''
          
          // Process only new results from the last processed index
          for (let i = lastResultIndexRef.current; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript
            
            if (event.results[i].isFinal) {
              newFinalTranscript += transcript + ' '
            } else {
              interimTranscript += transcript
            }
          }
          
          // Update final transcript accumulator
          if (newFinalTranscript) {
            finalTranscriptRef.current += newFinalTranscript
            lastResultIndexRef.current = event.results.length
          }
          
          // Combine base text + final transcript + interim transcript
          const fullText = baseTextRef.current + finalTranscriptRef.current + interimTranscript
          setInputValue(fullText)
        }
        
        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error)
          setIsMicActive(false)
          
          let errorMessage = 'Speech recognition error'
          switch (event.error) {
            case 'no-speech':
              errorMessage = 'No speech detected. Please try again.'
              break
            case 'audio-capture':
              errorMessage = 'Microphone not accessible. Please check permissions.'
              break
            case 'not-allowed':
              errorMessage = 'Microphone access denied. Please enable microphone permissions.'
              break
            case 'network':
              errorMessage = 'Network error occurred during speech recognition.'
              break
            default:
              errorMessage = `Speech recognition error: ${event.error}`
          }
          
          setError(errorMessage)
          setTimeout(() => setError(null), 5000)
        }
        
        recognition.onend = () => {
          setIsMicActive(false)
          // When recognition ends, keep the final result
          const finalText = baseTextRef.current + finalTranscriptRef.current
          setInputValue(finalText.trim())
          
          // Reset refs
          baseTextRef.current = ""
          finalTranscriptRef.current = ""
          lastResultIndexRef.current = 0
        }
        
        recognitionRef.current = recognition
      } else {
        console.warn('Speech recognition not supported in this browser')
      }
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [selectedLanguage.code])

  const toggleMicrophone = () => {
    if (!recognitionRef.current) {
      setError('Speech recognition is not supported in this browser')
      setTimeout(() => setError(null), 3000)
      return
    }

    if (isMicActive) {
      recognitionRef.current.stop()
      setIsMicActive(false)
    } else {
      try {
        // Reset refs before starting
        lastResultIndexRef.current = 0
        finalTranscriptRef.current = ""
        baseTextRef.current = inputValue
        
        recognitionRef.current.start()
      } catch (error) {
        console.error('Error starting speech recognition:', error)
        setError('Failed to start speech recognition. Please try again.')
        setTimeout(() => setError(null), 3000)
      }
    }
  }

  const handleCopyToClipboard = (text: string, messageIndex: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedMessageId(messageIndex)
      setTimeout(() => setCopiedMessageId(null), 2000)
    }).catch(err => {
      console.error('Failed to copy text: ', err)
    })
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

  const clearChat = async () => {
    try {
      // Delete chat history from database
      await fetch('/api/chat/history', {
        method: 'DELETE'
      })
    } catch (error) {
      console.error('Error deleting chat history:', error)
    }
    
    // Clear local state regardless of API result
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
    setError(null)
    
    // If user manually changes input while mic is active, update base text
    if (isMicActive) {
      baseTextRef.current = e.target.value
      finalTranscriptRef.current = ""
    }
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

    // Stop microphone if active
    if (isMicActive && recognitionRef.current) {
      recognitionRef.current.stop()
    }

    const userMessage: Message = {
      role: "user",
      content: inputValue.trim(),
      timestamp: formatTimestamp()
    }

    // Add user message immediately
    setMessages(prev => [...prev, userMessage])
    const currentInput = inputValue.trim()
    setInputValue("")
    setIsLoading(true)
    setError(null)

    // Save user message to database
    saveChatMessage(currentInput, "user")

    // Reset speech recognition refs
    baseTextRef.current = ""
    finalTranscriptRef.current = ""
    lastResultIndexRef.current = 0

    // Add a placeholder assistant message that will be updated with streaming content
    const placeholderMessage: Message = {
      role: "assistant",
      content: "",
      timestamp: formatTimestamp()
    }
    
    setMessages(prev => [...prev, placeholderMessage])

    try {
      // Call the chat API with selected language
      const requestBody: ChatRequest = {
        message: currentInput,
        language: selectedLanguage.code,
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to get response')
      }

      // Handle streaming response - Simple text parsing
      if (response.body) {
        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let accumulatedResponse = ""

        while (true) {
          const { done, value } = await reader.read()
          
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          
          // Simple approach: Extract text from the data stream format
          const lines = chunk.split('\n')
          for (const line of lines) {
            if (line.trim()) {
              // Check if it's a data line and extract the text
              if (line.startsWith('0:"') && line.endsWith('"')) {
                // Extract text between quotes and handle escaped quotes
                let text = line.slice(3, -1) // Remove '0:"' and trailing '"'
                text = text.replace(/\\"/g, '"') // Unescape quotes
                text = text.replace(/\\n/g, '\n') // Unescape newlines
                accumulatedResponse += text
              } else if (line.startsWith('0:') && !line.includes('"')) {
                // Plain text without quotes
                const text = line.slice(2)
                accumulatedResponse += text
              }
            }
          }

          // Update the assistant message in real-time
          setMessages(prev => 
            prev.map((msg, index) => 
              index === prev.length - 1 && msg.role === "assistant"
                ? { ...msg, content: accumulatedResponse }
                : msg
            )
          )
        }

        // Save assistant message to database after streaming completes
        if (accumulatedResponse.trim()) {
          saveChatMessage(accumulatedResponse, "assistant")
        }
      } else {
        throw new Error('No response body received')
      }

    } catch (error) {
      console.error('Error sending message:', error)
      
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
      setError(errorMessage)
      
      // Update the last assistant message with error
      setMessages(prev => 
        prev.map((msg, index) => 
          index === prev.length - 1 && msg.role === "assistant"
            ? { ...msg, content: `I apologize, but I encountered an error: ${errorMessage}. Please try again.` }
            : msg
        )
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    // Simple logout - redirect to our logout endpoint
    window.location.href = '/api/auth/logout'
  }

  const openDocumentInNewTab = () => {
    // Determine document URL based on Azure AD group
    let documentUrl = ''

    if (userAzureAdGroup === 'ScotAIUsers') {
      // Policy Guide for ScotAIUsers
      documentUrl = 'https://easternholdings.pagetiger.com/policy-guide/december-2023'
    } else {
      // People Management Toolkit for ScotAIManagers or null
      documentUrl = 'https://easternholdings.pagetiger.com/your-people-management-toolkit/1/?ptit=57928447FFC730AC383CF'
    }

    window.open(documentUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="chat-panel flex flex-col h-full w-full overflow-hidden">
      <div className="panel-header flex-shrink-0 flex justify-between items-center p-1 sm:p-2 bg-white border-b border-border z-20">
      
        <div className="w-16 h-12 relative overflow-hidden flex items-center">
          <img 
            src="/Ask_Axle_256x256.png" 
            alt="Axle Logo" 
            className="w-full h-auto object-contain"
          />
        </div>

        <div className="header-controls flex gap-2">
          {/* Document link button - only visible on mobile (below md breakpoint) */}
          <button
            onClick={openDocumentInNewTab}
            className="md:hidden bg-transparent border-none text-muted-foreground hover:bg-blue-50 hover:text-blue-600 p-2 rounded transition-all"
            title={userAzureAdGroup === 'ScotAIUsers' ? 'Open Policy Guide' : 'Open People Management Toolkit'}
          >
            <ExternalLink size={18} />
          </button>
          <button
            onClick={handleLogout}
            className="bg-transparent border-none text-muted-foreground hover:bg-red-50 hover:text-red-600 p-2 rounded transition-all"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
          <button
            onClick={clearChat}
            className="bg-transparent border-none text-muted-foreground hover:bg-secondary hover:text-primary p-2 rounded transition-all"
            title="Clear conversation"
            disabled={isLoading}
          >
            <Trash size={18} />
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
        {isLoadingHistory ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 size={20} className="animate-spin" />
              <span>Loading chat history...</span>
            </div>
          </div>
        ) : (
          messages.map((message, index) => {
          // Check if this is the currently streaming message
          const isCurrentlyStreaming = isLoading && 
                                     message.role === "assistant" && 
                                     index === messages.length - 1
          
          return (
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
                      ul: ({ children }) => (
                        <ul className="mb-2 space-y-1" style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="mb-2 space-y-1" style={{ listStyleType: 'decimal', paddingLeft: '1.5rem' }}>
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => (
                        <li className="text-[0.95rem]" style={{ display: 'list-item', whiteSpace: 'normal' }}>
                          {children}
                        </li>
                      ),
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
              
              {/* Only show the bottom section (copy button + timestamp) when NOT streaming */}
              {!isCurrentlyStreaming && (
                <div className="flex justify-between items-center mt-1">
                  <div className="flex-1">
                    {/* Only show copy button for assistant messages that have content */}
                    {message.role === 'assistant' && message.content.trim() !== "" && (
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
                  <div className={`message-time text-[0.7rem] text-right ${
                    message.role === "user" ? "text-white" : "text-black"
                  }`}>
                    {message.timestamp}
                  </div>
                </div>
              )}
            </div>
          )
        }))}
        
        {/* Only show "thinking" loader when loading AND the last message has no content yet */}
        {isLoading && messages.length > 0 && messages[messages.length - 1].role === "assistant" && messages[messages.length - 1].content === "" && (
          <div className="assistant bg-gray-50 self-start rounded-bl-sm max-w-[90%] sm:max-w-[85%] p-2 sm:p-3 rounded shadow-sm animate-slide-in-left">
            <div className="flex items-center gap-2 text-[0.95rem] text-muted-foreground">
              <Loader2 size={16} className="animate-spin" />
              <span>Axle is thinking...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="flex-shrink-0 bg-white">
      <div className="flex justify-end px-4 sm:px-6 lg:px-8 pt-2 pb-2">
        <div className="relative">
          <button
            onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
            className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm hover:bg-gray-50 transition-colors duration-200"
          >
            <span className="text-lg">{selectedLanguage.flag}</span>
            <span className="hidden sm:inline text-sm font-medium text-gray-700">
              {selectedLanguage.name}
            </span>
            <svg
              className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                isLanguageDropdownOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isLanguageDropdownOpen && (
            <div className="absolute bottom-full mb-2 right-0 bg-white border border-gray-300 rounded-lg shadow-lg min-w-[140px] overflow-hidden">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => {
                    setSelectedLanguage(language);
                    setIsLanguageDropdownOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-50 transition-colors duration-200 ${
                    selectedLanguage.code === language.code ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                  }`}
                >
                  <span className="text-lg">{language.flag}</span>
                  <span className="text-sm font-medium">{language.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="chat-input-area flex-shrink-0 flex p-3 sm:p-4 bg-white border-t border-border">
        <div className="relative w-full">
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={isMicActive ? "🎤 Listening... Speak now" : "Enter your question..."}
            className="w-full border border-gray-200 rounded-3xl py-1.5 sm:py-1.5 pl-4 sm:pl-5 pr-24 sm:pr-28 resize-none outline-none text-sm sm:text-base min-h-[24px] sm:min-h-[26px] max-h-[100px] sm:max-h-[120px] overflow-y-auto shadow-sm focus:border-accent focus:shadow-accent disabled:opacity-50 transition-all leading-normal"
            disabled={isLoading}
            style={{ scrollbarWidth: 'thin' }}
          />
          
          {/* Icons container */}
          <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 sm:gap-3">
            {/* Mic Icon */}
            <button
              onClick={toggleMicrophone}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all hover:opacity-80 ${
                isMicActive ? 'animate-pulse' : ''
              }`}
              style={{ 
                backgroundColor: isMicActive ? '#DC2626' : '#1F3A8A',
                cursor: 'pointer'
              }}
              title={isMicActive ? "Stop recording" : "Start voice input"}
              disabled={isLoading}
            >
              {isMicActive ? (
                <MicOff size={14} className="sm:w-[16px] sm:h-[16px] text-white" />
              ) : (
                <Mic size={14} className="sm:w-[16px] sm:h-[16px] text-white" />
              )}
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

      <div className="relative flex-shrink-0 flex items-center justify-between px-4 py-1 border-t border-border">
        <div className="flex-1 text-center text-[8px] sm:text-[9px] text-muted-foreground">
          <div className="text-gray-500 mb-0.5">
            Axle can make mistakes. Please double-check the responses.
          </div>
          <div>
            Brought to you by <span className="font-semibold text-primary">ScotAi</span>, powered by <span className="font-semibold text-accent">mAint</span>
          </div>
        </div>
        
        {/* Menu Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen(!isMenuOpen);
          }}
          className="flex items-center justify-center w-6 h-6 bg-transparent border border-gray-300 rounded hover:bg-gray-100 transition-colors duration-200 text-gray-600 ml-2 flex-shrink-0"
        >
          <Menu size={12} />
        </button>

        {/* Dropdown Menu */}
        {isMenuOpen && (
          <div 
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-full mb-2 right-4 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[180px] overflow-hidden z-50"
          >
           <button
             onClick={() => {
               setIsChangelogOpen(true);
               setIsMenuOpen(false);
             }}
             className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 text-gray-700 border-b border-gray-100"
           >
             <History size={16} />
             <span className="text-sm font-medium">Changelog</span>
           </button>
           <button
             onClick={() => {
               setIsFeedbackOpen(true);
               setIsMenuOpen(false);
             }}
             className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 text-gray-700 border-b border-gray-100"
           >
             <MessageSquare size={16} />
             <span className="text-sm font-medium">Feedback</span>
           </button>
           {/* Only show Admin button for admin users */}
           {userRole === UserRole.ADMIN && (
             <button
               onClick={() => {
                 window.location.href = '/dashboard';
                 setIsMenuOpen(false);
               }}
               className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 text-gray-700 border-b border-gray-100"
             >
               <Settings size={16} />
               <span className="text-sm font-medium">Admin</span>
             </button>
           )}
           <button
             onClick={() => {
               setIsStatusOpen(true);
               setIsMenuOpen(false);
             }}
             className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 text-gray-700"
           >
             <Activity size={16} />
             <span className="text-sm font-medium">Axle Status</span>
           </button>
         </div>
       )}
      </div>
      </div>

       {isChangelogOpen && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
           <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-hidden">
             <div className="flex items-center justify-between p-4 border-b border-gray-200">
               <h3 className="text-lg font-semibold text-gray-900">Axle Software Changelog</h3>
               <button
                 onClick={() => setIsChangelogOpen(false)}
                 className="text-gray-400 hover:text-gray-600 transition-colors"
               >
                 <X size={20} />
               </button>
             </div>
             <div className="p-4 overflow-y-auto max-h-[60vh]">
               <div className="space-y-3">
                 {changelogEntries.length === 0 ? (
                   <div className="text-center py-6 text-gray-500">
                     <p>No changelog entries available.</p>
                   </div>
                 ) : (
                   changelogEntries.map((entry) => (
                     <div
                       key={entry.id}
                       className="p-3 bg-gray-50 rounded-lg border border-gray-100"
                     >
                       <div className="flex items-start justify-between mb-2">
                         <div className="flex items-center gap-2">
                           <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                           <span className="text-sm font-medium text-gray-900">{entry.title}</span>
                         </div>
                         {entry.version && (
                           <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                             {entry.version}
                           </span>
                         )}
                       </div>
                       {entry.description && (
                         <p className="text-sm text-gray-600 ml-4 mb-2">{entry.description}</p>
                       )}
                       <div className="text-xs text-gray-500 ml-4">
                         {new Date(entry.createdAt).toLocaleDateString()}
                       </div>
                     </div>
                   ))
                 )}
               </div>
             </div>
             <div className="p-4 border-t border-gray-200">
               <button
                 onClick={() => setIsChangelogOpen(false)}
                 className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
               >
                 Close
               </button>
             </div>
           </div>
         </div>
       )}

       {isStatusOpen && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
           <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-hidden">
             <div className="flex items-center justify-between p-4 border-b border-gray-200">
               <h3 className="text-lg font-semibold text-gray-900">Axle Status</h3>
               <button
                 onClick={() => setIsStatusOpen(false)}
                 className="text-gray-400 hover:text-gray-600 transition-colors"
               >
                 <X size={20} />
               </button>
             </div>
             <div className="p-6">
               <div className="text-center">
                 {systemStatus ? (
                   <>
                     <div className="flex items-center justify-center gap-3 mb-4">
                       {systemStatus.status === 'live' && (
                         <>
                           <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                           <span className="text-2xl font-semibold text-green-600">LIVE</span>
                         </>
                       )}
                       {systemStatus.status === 'maintenance' && (
                         <>
                           <div className="w-4 h-4 bg-yellow-500 rounded-full animate-pulse"></div>
                           <span className="text-2xl font-semibold text-yellow-600">MAINTENANCE</span>
                         </>
                       )}
                       {systemStatus.status === 'issue' && (
                         <>
                           <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                           <span className="text-2xl font-semibold text-red-600">ISSUE</span>
                         </>
                       )}
                     </div>
                     <p className="text-gray-600 text-sm mb-6">
                       {systemStatus.message}
                     </p>
                     <div className="text-xs text-gray-500">
                       Last updated: {new Date(systemStatus.createdAt).toLocaleString()}
                     </div>
                   </>
                 ) : (
                   <div className="text-center py-6 text-gray-500">
                     <p>Loading status...</p>
                   </div>
                 )}
               </div>
             </div>
             <div className="p-4 border-t border-gray-200">
               <button
                 onClick={() => setIsStatusOpen(false)}
                 className={`w-full text-white py-2 px-4 rounded-lg transition-colors duration-200 font-medium ${
                   systemStatus?.status === 'live' ? 'bg-green-600 hover:bg-green-700' :
                   systemStatus?.status === 'maintenance' ? 'bg-yellow-600 hover:bg-yellow-700' :
                   systemStatus?.status === 'issue' ? 'bg-red-600 hover:bg-red-700' :
                   'bg-gray-600 hover:bg-gray-700'
                 }`}
               >
                 Close
               </button>
             </div>
           </div>
         </div>
       )}

       <FeedbackModal 
         isOpen={isFeedbackOpen}
         onClose={() => setIsFeedbackOpen(false)}
       />

    </div>
  )
}
