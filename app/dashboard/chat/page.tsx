"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { motion, AnimatePresence } from "framer-motion"
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
import { toast } from "sonner"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface ChatSession {
  id: string
  title: string
  lastMessage?: string
  timestamp: Date
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

export default function ChatBotPage() {
  const [sessions, setSessions] = React.useState<ChatSession[]>([
    {
      id: "1",
      title: "Monthly Spending Analysis",
      lastMessage: "Your spending in March is up by 12%...",
      timestamp: new Date(),
    },
    {
      id: "2",
      title: "Saving for New Laptop",
      lastMessage: "If you save Rp 500.000 every month...",
      timestamp: new Date(Date.now() - 86400000),
    },
  ])
  const [currentSessionId, setCurrentSessionId] = React.useState<string | null>("1")
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true)
  const [editingSessionId, setEditingSessionId] = React.useState<string | null>(null)
  const [editTitle, setEditTitle] = React.useState("")

  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your AI Financial Assistant. How can I help you manage your expenses today?\n\nYou can ask me for:\n- **Spending summaries**\n- **Top expense categories**\n- **Savings tips**\n- Or to guide you on adding new expenses",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = React.useState("")
  const [isTyping, setIsTyping] = React.useState(false)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  React.useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            { role: "system", content: "You are a helpful AI financial assistant for ExpenseAI. You assist users with expense tracking, summaries, and financial advice based on their data." },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: "user", content: text }
          ],
        }),
      })

      if (response.status === 401) {
        toast.error("Please sign in to use the AI assistant.")
        return
      }
      if (response.status === 503) {
        toast.error("AI service is temporarily unavailable.")
        return
      }
      if (!response.ok) {
        throw new Error("Failed to get response from AI")
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      const assistantContent = data.choices[0].message.content

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: assistantContent,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Chat Error:", error)
      toast.error("I'm having trouble connecting to my brain right now. Please try again later.")
    } finally {
      setIsTyping(false)
    }
  }

  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: "New Conversation",
      timestamp: new Date(),
    }
    setSessions([newSession, ...sessions])
    setCurrentSessionId(newSession.id)
    setMessages([
      {
        id: "1",
        role: "assistant",
        content: "Hello! I'm your AI Financial Assistant. How can I help you manage your expenses today?\n\nYou can ask me for:\n- **Spending summaries**\n- **Top expense categories**\n- **Savings tips**\n- Or to guide you on adding new expenses",
        timestamp: new Date(),
      },
    ])
  }

  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const newSessions = sessions.filter(s => s.id !== id)
    setSessions(newSessions)
    if (currentSessionId === id) {
      setCurrentSessionId(newSessions.length > 0 ? newSessions[0].id : null)
    }
    toast.success("Conversation deleted")
  }

  const startEditing = (session: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingSessionId(session.id)
    setEditTitle(session.title)
  }

  const saveTitle = (id: string) => {
    setSessions(sessions.map(s => s.id === id ? { ...s, title: editTitle } : s))
    setEditingSessionId(null)
  }

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-12rem)] max-w-6xl mx-auto border border-white/10 rounded-[40px] bg-white/[0.02] overflow-hidden backdrop-blur-sm relative">
        
        {/* Chat History Sidebar */}
        <AnimatePresence initial={false}>
          {isSidebarOpen && (
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: 320 }}
              exit={{ width: 0 }}
              className="border-r border-white/5 bg-[#0c0a14]/40 flex flex-col overflow-hidden relative shrink-0"
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
                <div className="px-3 mb-2 text-[10px] uppercase tracking-[0.2em] font-bold text-white/20">
                  Recent History
                </div>
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => setCurrentSessionId(session.id)}
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
                          {session.timestamp.toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-[#1c1927]/90 p-1 rounded-lg backdrop-blur-sm">
                      <button 
                        onClick={(e) => startEditing(session, e)}
                        className="p-1 hover:text-[#9055ff]"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={(e) => handleDeleteSession(session.id, e)}
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
        <div className="flex-1 flex flex-col min-w-0">
          {/* Chat Header */}
          <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#0c0a14]/50">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all mr-2"
              >
                <div className="w-5 h-5 flex flex-col justify-center gap-1">
                  <span className={`h-0.5 bg-current transition-all ${isSidebarOpen ? 'w-5' : 'w-3'}`} />
                  <span className="h-0.5 bg-current w-5" />
                  <span className={`h-0.5 bg-current transition-all ${isSidebarOpen ? 'w-5' : 'w-4'}`} />
                </div>
              </button>
              <div className="w-12 h-12 rounded-2xl bg-[#7b39fc]/20 flex items-center justify-center border border-[#7b39fc]/30 relative">
                <Bot className="w-6 h-6 text-[#9055ff]" />
                <div className="absolute top-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0c0a14] animate-pulse" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl font-bold text-white tracking-tight truncate">
                  {sessions.find(s => s.id === currentSessionId)?.title || "Financial Assistant"}
                </h1>
                <p className="text-xs text-emerald-400 font-medium">Online • Powered by AI</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Sparkles className="w-5 h-5 text-[#9055ff] animate-pulse" />
            </div>
          </div>

          {/* Message Area */}
          <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className={`flex gap-4 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                    message.role === "assistant" 
                      ? "bg-[#7b39fc]/10 border-[#7b39fc]/30 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),inset_0_-2px_4px_0_rgba(0,0,0,0.25)]" 
                      : "bg-white/5 border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
                  }`}>
                    {message.role === "assistant" ? <Bot className="w-5 h-5 text-[#9055ff]" /> : <User className="w-5 h-5 text-white/70" />}
                  </div>
                  
                  <div className={`flex flex-col gap-2 max-w-[80%] ${message.role === "user" ? "items-end" : ""}`}>
                    <div className={`p-5 rounded-[24px] text-sm leading-relaxed border transition-all ${
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
                  className="flex gap-4"
                >
                  <div className="w-10 h-10 rounded-full bg-[#7b39fc]/10 border border-[#7b39fc]/30 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-[#9055ff]" />
                  </div>
                  <div className="bg-white/5 border border-white/10 p-5 rounded-[24px] rounded-tl-none shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]">
                    <div className="flex gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#9055ff] animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#9055ff] animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#9055ff] animate-bounce"></span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Area */}
          <div className="p-6 md:p-10 border-t border-white/5 bg-[#0c0a14]/50 backdrop-blur-md">
            {messages.length < 3 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {SUGGESTED_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(prompt.text)}
                    className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white/50 hover:bg-[#7b39fc]/10 hover:border-[#7b39fc]/20 hover:text-[#9055ff] transition-all flex items-center gap-2 group"
                  >
                    <prompt.icon className="w-3.5 h-3.5" />
                    {prompt.text}
                    <ChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
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
                className="relative flex items-center gap-4 bg-[#0c0a14] border border-white/10 rounded-2xl p-2 pl-6 focus-within:border-[#7b39fc]/50 transition-all shadow-2xl"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything about your expenses..."
                  className="bg-transparent border-none focus-visible:ring-0 text-white placeholder:text-white/20 h-10 p-0"
                />
                <ModernButton 
                  variant="primary" 
                  size="sm" 
                  className="h-10 w-10 p-0 min-w-0 rounded-xl"
                  disabled={!input.trim() || isTyping}
                >
                  <Send className="w-4.5 h-4.5" />
                </ModernButton>
              </form>
            </div>
            
            <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-white/20 uppercase tracking-[0.2em] font-bold">
              <Sparkles className="w-3 h-3 text-[#7b39fc]" />
              AI may provide inaccurate financial advice
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
