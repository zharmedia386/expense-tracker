"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { motion, AnimatePresence } from "framer-motion"
import { useSearchParams } from "next/navigation"
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  RefreshCcw, 
  Plus,
  Trash2,
  ChevronRight,
  MessageSquare,
  TrendingUp,
  FileText,
  Search,
  MoreVertical,
  Edit2
} from "lucide-react"
import { ModernButton } from "@/components/modern-button"
import { Input } from "@/components/ui/input"
import { ChatMarkdown } from "@/components/chat-markdown"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface ChatSession {
  id: string
  title: string
  created_at: string
}

const SUGGESTED_PROMPTS = [
  { text: "Summarize my spending for the last 30 days", icon: PieChartIcon },
  { text: "How can I save more money next month?", icon: TrendingUp },
  { text: "Show my top 5 expense categories", icon: FileText },
  { text: "Add a new expense for Office Supplies (Rp 45.000)", icon: Plus },
]

function PieChartIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
      <path d="M22 12A10 10 0 0 0 12 2v10z" />
    </svg>
  )
}

function ChatBotContent() {
  const supabase = createClient() // For auth check only
  const [sessions, setSessions] = React.useState<ChatSession[]>([])
  const [currentSessionId, setCurrentSessionId] = React.useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true)
  const [editingSessionId, setEditingSessionId] = React.useState<string | null>(null)
  const [editTitle, setEditTitle] = React.useState("")
  const [initialLoading, setInitialLoading] = React.useState(true)
  const [sessionToDelete, setSessionToDelete] = React.useState<string | null>(null)
  const [isSeeding, setIsSeeding] = React.useState(false)

  const [messages, setMessages] = React.useState<Message[]>([])
  const [input, setInput] = React.useState("")
  const [isTyping, setIsTyping] = React.useState(false)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  React.useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  // Fetch initial sessions via API
  React.useEffect(() => {
    async function loadSessions() {
      const res = await fetch("/api/chat/sessions")
      if (!res.ok) {
        setInitialLoading(false)
        return
      }
      const data = await res.json()
      if (data && data.length > 0) {
        setSessions(data)
        setCurrentSessionId(data[0].id)
      } else {
        setSessions([])
      }
      setInitialLoading(false)
    }
    loadSessions()
  }, [])

  // Fetch messages when currentSessionId changes
  React.useEffect(() => {
    async function loadMessages() {
      if (!currentSessionId) {
        setMessages([
          {
            id: "welcome",
            role: "assistant",
            content: "Hello! I'm your AI Financial Assistant. How can I help you manage your expenses today?\n\nYou can ask me for:\n- **Spending summaries**\n- **Top expense categories**\n- **Savings tips**\n- Or to guide you on adding new expenses",
            timestamp: new Date(),
          },
        ])
        return
      }

      const res = await fetch(`/api/chat/sessions/${currentSessionId}/messages`)
      if (!res.ok) return
      const data = await res.json()
      if (data) {
        setMessages(data.map((m: { id: string; role: string; content: string; created_at: string }) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          timestamp: new Date(m.created_at),
        })))
      }
    }
    loadMessages()
  }, [currentSessionId])

  const messagesRef = React.useRef(messages)
  React.useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  const handleSendMessage = async (text: string, forceNewSession: boolean = false) => {
    if (!text.trim()) return

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast.error("Please sign in to chat")
      return
    }

    let sessionId = forceNewSession ? null : currentSessionId

    // Create new session via API if none exists
    if (!sessionId) {
      const title = text.length > 30 ? text.substring(0, 30) + "..." : text
      const sRes = await fetch("/api/chat/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      })
      if (!sRes.ok) {
        const err = await sRes.json().catch(() => ({}))
        toast.error(err.error || "Failed to start conversation")
        setIsTyping(false)
        return
      }
      const newSession = await sRes.json()
      sessionId = newSession.id
      setSessions((prev) => [{ ...newSession, id: newSession.id, title: newSession.title, created_at: newSession.created_at }, ...prev])
      setCurrentSessionId(sessionId)
    }

    // Optimistic UI for user message
    const tempUserMsgId = Date.now().toString()
    const userMsg: Message = {
      id: tempUserMsgId,
      role: "user",
      content: text,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev.filter(m => m.id !== "welcome"), userMsg])
    setInput("")
    setIsTyping(true)

    // Save user message via API
    await fetch(`/api/chat/sessions/${sessionId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: "user", content: text }),
    })

    try {
      // Use messagesRef to avoid stale state if handleSendMessage is called via timeout
      const msgsToSend = forceNewSession 
        ? [{ role: "user", content: text }]
        : messagesRef.current.filter(m => m.id !== "welcome").map(m => ({ role: m.role, content: m.content })).concat([{ role: "user", content: text }]);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: msgsToSend
        }),
      })

      if (!response.ok) throw new Error("AI service error")

      const data = await response.json()
      if (data.error) throw new Error(data.error)

      const assistantContent = data.choices?.[0]?.message?.content ?? ""

      // Save assistant message via API (API accepts empty content for assistant)
      const mRes = await fetch(`/api/chat/sessions/${sessionId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "assistant", content: assistantContent || "(No response)" }),
      })
      const savedAssistantMsg = mRes.ok ? await mRes.json() : null

      if (savedAssistantMsg) {
        setMessages((prev) => [
          ...prev,
          {
            id: savedAssistantMsg.id,
            role: "assistant",
            content: assistantContent,
            timestamp: new Date(savedAssistantMsg.created_at),
          },
        ])
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `temp-${Date.now()}`,
            role: "assistant",
            content: assistantContent,
            timestamp: new Date(),
          },
        ])
      }
    } catch (error) {
      console.error("Chat Error:", error)
      toast.error("Something went wrong. Please check your connection.")
    } finally {
      setIsTyping(false)
    }
  }

  const handleNewChat = () => {
    setCurrentSessionId(null)
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "Hello! I'm your AI Financial Assistant. How can I help you manage your expenses today?\n\nYou can ask me for:\n- **Spending summaries**\n- **Top expense categories**\n- **Savings tips**\n- Or to guide you on adding new expenses",
        timestamp: new Date(),
      },
    ])
    if (window.innerWidth < 768) setIsSidebarOpen(false)
  }

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingSessionId(null)
    setSessionToDelete(id)
  }

  const confirmDeleteSession = async () => {
    const id = sessionToDelete
    if (!id) return
    setSessionToDelete(null)

    const res = await fetch(`/api/chat/sessions/${id}`, { method: "DELETE" })
    if (!res.ok) {
      toast.error("Failed to delete conversation")
      return
    }

    const newSessions = sessions.filter((s) => s.id !== id)
    setSessions(newSessions)
    if (currentSessionId === id) {
      setCurrentSessionId(newSessions.length > 0 ? newSessions[0].id : null)
    }
    toast.success("Conversation deleted")
  }

  const handleSeedSamples = async () => {
    setIsSeeding(true)
    try {
      const res = await fetch("/api/chat/seed", { method: "POST" })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        toast.error(err.error || "Failed to load sample chats")
        return
      }
      const data = await res.json()
      if (data.sessions?.length > 0) {
        setSessions((prev) => [...data.sessions, ...prev])
        setCurrentSessionId(data.sessions[0].id)
        toast.success("Sample chats loaded")
      }
    } catch {
      toast.error("Failed to load sample chats")
    } finally {
      setIsSeeding(false)
    }
  }

  const startEditing = (session: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingSessionId(session.id)
    setEditTitle(session.title)
  }

  const searchParams = useSearchParams()
  const initialPromptProcessed = React.useRef(false)

  React.useEffect(() => {
    const initialPrompt = searchParams.get("prompt")
    if (initialPrompt && !initialPromptProcessed.current && !initialLoading) {
      initialPromptProcessed.current = true
      
      // Clear current state to ensure a completely new chat
      setCurrentSessionId(null)
      setMessages([])
      
      // Use setTimeout to ensure the clean state is flushed before sending the message
      setTimeout(() => {
        handleSendMessage(initialPrompt, true)
      }, 0)
    }
  }, [searchParams, initialLoading])

  const saveTitle = async (id: string) => {
    const trimmed = editTitle.trim()
    if (!trimmed) {
      setEditingSessionId(null)
      return
    }
    const existing = sessions.find((s) => s.id === id)?.title
    if (existing === trimmed) {
      setEditingSessionId(null)
      return
    }

    const res = await fetch(`/api/chat/sessions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: trimmed }),
    })

    if (!res.ok) {
      toast.error("Failed to rename conversation")
      return
    }

    setSessions((prev) => prev.map((s) => (s.id === id ? { ...s, title: trimmed } : s)))
    setEditingSessionId(null)
  }

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-12rem)] max-w-6xl mx-auto border border-white/10 rounded-[40px] bg-white/[0.02] overflow-hidden backdrop-blur-sm relative">
        
        {/* Mobile Backdrop */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
            />
          )}
        </AnimatePresence>

        {/* Chat History Sidebar */}
        <AnimatePresence initial={false}>
          {isSidebarOpen && (
            <motion.div 
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute md:relative z-40 md:z-auto h-full w-[280px] md:w-[320px] border-r border-white/5 bg-[#0c0a14] md:bg-[#0c0a14]/40 flex flex-col overflow-hidden shrink-0"
            >
              <div className="p-6 border-b border-white/5">
                <ModernButton 
                  variant="primary" 
                  className="w-full justify-start gap-3 h-12 shadow-none"
                  onClick={handleNewChat}
                >
                  <Plus className="w-5 h-5 text-white/70" />
                  New Chat
                </ModernButton>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                <div className="px-3 mb-2 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/20">
                    Recent History
                  </span>
                  {sessions.length > 0 && (
                    <button
                      type="button"
                      onClick={handleSeedSamples}
                      disabled={isSeeding}
                      className="text-[10px] text-[#7b39fc] hover:text-[#9055ff] transition-colors disabled:opacity-50"
                    >
                      {isSeeding ? "Loading..." : "+ Samples"}
                    </button>
                  )}
                </div>
                {initialLoading ? (
                  <div className="p-4 text-center text-white/20 text-xs">Loading sessions...</div>
                ) : sessions.length === 0 ? (
                  <div className="p-4 space-y-3">
                    <p className="text-center text-white/20 text-xs italic">No history yet</p>
                    <ModernButton
                      variant="outline"
                      size="sm"
                      className="w-full text-xs"
                      onClick={handleSeedSamples}
                      disabled={isSeeding}
                    >
                      {isSeeding ? "Loading..." : "Load sample chats"}
                    </ModernButton>
                  </div>
                ) : sessions.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => {
                      setCurrentSessionId(session.id)
                      if (window.innerWidth < 768) setIsSidebarOpen(false)
                    }}
                    className={`group relative p-4 rounded-2xl cursor-pointer transition-all border ${
                      currentSessionId === session.id 
                        ? "bg-[#7b39fc]/10 border-[#7b39fc]/30 text-white" 
                        : "bg-transparent border-transparent text-white/40 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <MessageSquare className={`w-4 h-4 shrink-0 ${currentSessionId === session.id ? "text-[#9055ff]" : "text-white/20"}`} />
                      <div className="flex-1 min-w-0">
                        {editingSessionId === session.id ? (
                          <input
                            autoFocus
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onBlur={() => saveTitle(session.id)}
                            onKeyDown={(e) => e.key === 'Enter' && saveTitle(session.id)}
                            className="bg-white/5 border border-white/10 rounded px-1.5 py-0.5 w-full text-sm focus:outline-none focus:border-[#7b39fc]"
                          />
                        ) : (
                          <p className="text-sm font-medium truncate">{session.title}</p>
                        )}
                        <p className="text-[10px] opacity-40 mt-0.5">
                          {new Date(session.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity bg-[#1c1927]/90 p-1 rounded-lg backdrop-blur-sm">
                      <button 
                        onClick={(e) => startEditing(session, e)}
                        className="p-1 hover:text-[#9055ff]"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={(e) => handleDeleteClick(session.id, e)}
                        className="p-1 hover:text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#0c0a14]/20 md:bg-transparent">
          {/* Chat Header */}
          <div className="p-4 md:p-6 border-b border-white/5 flex items-center justify-between bg-[#0c0a14]/50">
            <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all shrink-0"
              >
                <div className="w-5 h-5 flex flex-col justify-center gap-1">
                  <span className={`h-0.5 bg-current transition-all ${isSidebarOpen ? 'w-5' : 'w-3'}`} />
                  <span className="h-0.5 bg-current w-5" />
                  <span className={`h-0.5 bg-current transition-all ${isSidebarOpen ? 'w-5' : 'w-4'}`} />
                </div>
              </button>
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-[#7b39fc]/20 flex items-center justify-center border border-[#7b39fc]/30 relative shrink-0">
                <Bot className="w-5 h-5 md:w-6 md:h-6 text-[#9055ff]" />
                <div className="absolute top-0 right-0 w-2.5 h-2.5 md:w-3 md:h-3 bg-emerald-500 rounded-full border-2 border-[#0c0a14] animate-pulse" />
              </div>
              <div className="min-w-0">
                <h1 className="text-base md:text-xl font-bold text-white tracking-tight truncate">
                  {sessions.find(s => s.id === currentSessionId)?.title || "Financial Assistant"}
                </h1>
                <p className="text-[10px] md:text-xs text-emerald-400 font-medium">Online • Powered by AI</p>
              </div>
            </div>
            <div className="hidden sm:flex gap-2">
              <Sparkles className="w-5 h-5 text-[#9055ff] animate-pulse" />
            </div>
          </div>

          {/* Message Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-10 space-y-6 md:y-8 custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className={`flex gap-3 md:gap-4 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                    message.role === "assistant" 
                      ? "bg-[#7b39fc]/10 border-[#7b39fc]/30 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),inset_0_-2px_4px_0_rgba(0,0,0,0.25)]" 
                      : "bg-white/5 border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
                  }`}>
                    {message.role === "assistant" ? <Bot className="w-4 h-4 md:w-5 md:h-5 text-[#9055ff]" /> : <User className="w-4 h-4 md:w-5 md:h-5 text-white/70" />}
                  </div>
                  
                  <div className={`flex flex-col gap-1.5 md:gap-2 max-w-[85%] md:max-w-[80%] ${message.role === "user" ? "items-end" : ""}`}>
                    <div className={`p-4 md:p-5 rounded-[20px] md:rounded-[24px] text-sm leading-relaxed border transition-all ${
                      message.role === "assistant" 
                        ? "bg-white/5 border-white/10 text-white rounded-tl-none shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),inset_0_-2px_4px_0_rgba(0,0,0,0.25)]" 
                        : "bg-[#7b39fc] border-white/20 text-white rounded-tr-none shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),inset_0_-2px_4px_0_rgba(0,0,0,0.3),0_10px_30px_rgba(123,57,252,0.3)]"
                    }`}>
                      {message.role === "assistant" ? (
                        <ChatMarkdown content={message.content} />
                      ) : (
                        message.content
                      )}
                    </div>
                    <span className="text-[10px] text-white/20 px-2">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 md:gap-4"
                >
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#7b39fc]/10 border border-[#7b39fc]/30 flex items-center justify-center">
                    <Bot className="w-4 h-4 md:w-5 md:h-5 text-[#9055ff]" />
                  </div>
                  <div className="bg-white/5 border border-white/10 p-4 md:p-5 rounded-[20px] md:rounded-[24px] rounded-tl-none shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]">
                    <div className="flex gap-1.5">
                      <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-[#9055ff] animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-[#9055ff] animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-[#9055ff] animate-bounce"></span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Area */}
          <div className="p-4 md:p-10 border-t border-white/5 bg-[#0c0a14]/50 backdrop-blur-md">
            {!currentSessionId && messages.length < 2 && (
              <div className="flex flex-wrap gap-2 mb-4 md:mb-6 overflow-x-auto no-scrollbar pb-2">
                {SUGGESTED_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(prompt.text)}
                    className="flex-none px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] md:text-xs text-white/50 hover:bg-[#7b39fc]/10 hover:border-[#7b39fc]/20 hover:text-[#9055ff] transition-all flex items-center gap-2 group whitespace-nowrap"
                  >
                    <prompt.icon className="w-3 md:w-3.5 h-3 md:h-3.5" />
                    {prompt.text}
                    <ChevronRight className="w-3 md:w-3.5 h-3 md:h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </button>
                ))}
              </div>
            )}

            <div className="relative group">
              <div className="absolute inset-0 bg-[#7b39fc]/20 blur-[20px] opacity-0 group-focus-within:opacity-100 transition-opacity" />
              <form 
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSendMessage(input)
                }}
                className="relative flex items-center gap-2 md:gap-4 bg-[#0c0a14] border border-white/10 rounded-2xl p-1.5 md:p-2 pl-4 md:pl-6 focus-within:border-[#7b39fc]/50 transition-all shadow-2xl"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything..."
                  className="bg-transparent border-none focus-visible:ring-0 text-white placeholder:text-white/20 h-9 md:h-10 p-0 text-sm md:text-base"
                />
                <ModernButton 
                  variant="primary" 
                  size="sm" 
                  className="h-9 w-9 md:h-10 md:w-10 p-0 min-w-0 rounded-xl"
                  disabled={!input.trim() || isTyping}
                >
                  <Send className="w-4 md:w-4.5 h-4 md:h-4.5" />
                </ModernButton>
              </form>
            </div>
            
            <div className="mt-3 md:mt-4 flex items-center justify-center gap-2 text-[9px] md:text-[10px] text-white/20 uppercase tracking-[0.2em] font-bold">
              <Sparkles className="w-3 h-3 text-[#7b39fc]" />
              AI Advice - Verify Data
            </div>
          </div>
        </div>
      </div>

      <AlertDialog open={!!sessionToDelete} onOpenChange={(open) => !open && setSessionToDelete(null)}>
        <AlertDialogContent className="bg-[#0c0a14] border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete conversation?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/60">
              This will permanently delete this conversation. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/10 text-white/80">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteSession}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  )
}

export default function ChatBotPage() {
  return (
    <React.Suspense
      fallback={
        <DashboardLayout>
          <div className="flex h-[calc(100vh-12rem)] max-w-6xl mx-auto border border-white/10 rounded-[40px] bg-white/[0.02] overflow-hidden backdrop-blur-sm items-center justify-center">
            <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
          </div>
        </DashboardLayout>
      }
    >
      <ChatBotContent />
    </React.Suspense>
  )
}
