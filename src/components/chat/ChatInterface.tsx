"use client"

import { useState, useRef, useEffect } from "react"
import { Expand, Trash, Send, Loader2, AlertCircle, Copy, Check, Mic, MicOff } from "lucide-react"
import { Message, ChatRequest, ChatResponse, ApiErrorResponse } from "@/types/chat"
import ReactMarkdown from 'react-markdown'

// Add this interface near the top with other interfaces
interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "pl", name: "Polish", flag: "🇵🇱" }
];

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
  const [isMicActive, setIsMicActive] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(languages[0])
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const lastResultIndexRef = useRef<number>(0)
  const baseTextRef = useRef<string>("")
  const finalTranscriptRef = useRef<string>("")

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
        {messages.map((message, index) => {
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
                  <div className="message-time text-[0.7rem] text-black text-right">
                    {message.timestamp}
                  </div>
                </div>
              )}
            </div>
          )
        })}
        
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

      {/* Language Selector - Sticky positioned above input */}
      <div className="sticky bottom-20 z-10 flex justify-end px-4 sm:px-6 lg:px-8 mb-2">
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

      <div className="chat-input-area flex p-3 sm:p-4 bg-white border-t border-border">
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

      <div className="mx-2 mb-0 rounded-lg text-center text-[10px] sm:text-xs text-muted-foreground py-0.5">
        Brought to you by <span className="font-semibold text-primary">ScotAi</span>, powered by <span className="font-semibold text-accent">mAint</span>
      </div>
    </div>
  )
}
