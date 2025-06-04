"use client"

import { useEffect, useState } from "react"
import ChatInterface from "@/components/chat/ChatInterface"
import DocumentViewer from "@/components/chat/DocumentViewer"

export default function ChatPage() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden" id="chat-container">
      <div className="w-full md:w-[60%] h-1/2 md:h-full md:border-r border-border order-1 md:order-1">
        <DocumentViewer />
      </div>
      
      <div className="w-full md:w-[40%] h-1/2 md:h-full flex-shrink-0 order-2 md:order-2 border-t md:border-t-0 border-border">
        <ChatInterface />
      </div>
    </div>
  )
}
