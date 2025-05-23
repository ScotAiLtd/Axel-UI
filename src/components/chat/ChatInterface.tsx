"use client"

import { useState, useRef, useEffect } from "react"
import { Expand, Trash, Send } from "lucide-react"
import { Message } from "@/types/chat"

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
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  
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
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const sendMessage = () => {
    if (inputValue.trim() === "") return

    const userMessage: Message = {
      role: "user",
      content: inputValue,
      timestamp: "Just now"
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue("")

    setTimeout(() => {
      const assistantMessage: Message = {
        role: "assistant",
        content: "I'm an AI assistant for the People Management Toolkit. I can help answer questions about HR policies, employee management, and other related topics.",
        timestamp: "Just now"
      }
      setMessages(prev => [...prev, assistantMessage])
    }, 1000)
  }

  return (
    <div className={`chat-panel flex flex-col ${isFullscreen ? "w-full" : ""}`}>
      <div className="panel-header flex justify-between items-center p-4 bg-white border-b border-border z-10">
        <h2 className="text-lg font-semibold text-primary">Axle - Your People Management Toolkit Assistant</h2>
        <div className="header-controls flex gap-2">
          <button 
            onClick={clearChat}
            className="bg-transparent border-none text-muted-foreground hover:bg-secondary hover:text-primary p-2 rounded transition-all"
            title="Clear conversation"
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

      <div className="chat-messages flex-1 p-4 overflow-y-auto bg-white flex flex-col gap-4">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`message max-w-[85%] p-3 rounded shadow-sm ${
              message.role === "user" 
                ? "user bg-blue-50 self-end rounded-br-sm animate-slide-in-right" 
                : "assistant bg-gray-50 self-start rounded-bl-sm animate-slide-in-left"
            }`}
          >
            <div className="message-content text-[0.95rem]">
              <p>{message.content}</p>
            </div>
            <div className="message-time text-[0.7rem] text-muted mt-1 text-right">
              {message.timestamp}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area flex p-3 md:p-4 bg-white border-t border-border">
        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything..."
          className="flex-1 border border-border rounded-3xl py-2 md:py-3 px-3 md:px-4 resize-none outline-none text-sm md:text-[0.95rem] max-h-[120px] shadow-sm focus:border-accent focus:shadow-accent"
          rows={1}
        />
        <button
          onClick={sendMessage}
          className="bg-accent text-white border-none w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center ml-2 md:ml-3 cursor-pointer shadow-sm transition-all hover:bg-accent/90"
        >
          <Send size={16} className="md:w-[18px] md:h-[18px]" />
        </button>
      </div>

      <div className="mx-2 mb-2 mt-1 rounded-lg text-center text-xs text-muted-foreground py-2 border border-border">
        Brought to you by <span className="font-semibold text-primary">ScotAi</span>, powered by <span className="font-semibold text-accent">mAint</span>
      </div>
    </div>
  )
}
