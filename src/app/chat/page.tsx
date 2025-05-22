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
    <div className="flex h-screen w-full overflow-hidden" id="chat-container">
      <DocumentViewer />
      
      <ChatInterface />
    </div>
  )
}
