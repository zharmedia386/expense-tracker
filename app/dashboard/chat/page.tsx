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
  FileText
} from "lucide-react"
import { ModernButton } from "@/components/modern-button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const SUGGESTED_PROMPTS = [
  { text: "Summarize my spending for the last 30 days", icon: PieChartIcon },
  { text: "How can I save more money next month?", icon: TrendingUp },
  { text: "Show my top 5 expense categories", icon: FileText },
  { text: "Add a new expense for Office Supplies ($45)", icon: Plus },
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
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your AI Financial Assistant. How can I help you manage your expenses today? You can ask me for summaries, savings tips, or even to record new expenses.",
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
      // API call to custom proxy endpoint
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

      if (!response.ok) {
        throw new Error("Failed to get response from AI proxy")
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

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-12rem)] max-w-5xl mx-auto border border-white/10 rounded-[40px] bg-white/[0.02] overflow-hidden backdrop-blur-sm relative">
        
        {/* Chat Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#0c0a14]/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#7b39fc]/20 flex items-center justify-center border border-[#7b39fc]/30 relative">
              <Bot className="w-6 h-6 text-[#9055ff]" />
              <div className="absolute top-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0c0a14] animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Financial Assistant</h1>
              <p className="text-xs text-emerald-400 font-medium">Online • Powered by AI</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setMessages([messages[0]])}
              className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all"
              title="Clear Chat"
            >
              <Trash2 className="w-5 h-5" />
            </button>
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
                    ? "bg-[#7b39fc]/10 border-[#7b39fc]/30" 
                    : "bg-white/5 border-white/10"
                }`}>
                  {message.role === "assistant" ? <Bot className="w-5 h-5 text-[#9055ff]" /> : <User className="w-5 h-5 text-white/70" />}
                </div>
                
                <div className={`flex flex-col gap-2 max-w-[80%] ${message.role === "user" ? "items-end" : ""}`}>
                  <div className={`p-5 rounded-[24px] text-sm leading-relaxed border ${
                    message.role === "assistant" 
                      ? "bg-white/5 border-white/10 text-white rounded-tl-none" 
                      : "bg-[#7b39fc] border-white/20 text-white rounded-tr-none shadow-[0_10px_30px_rgba(123,57,252,0.3)]"
                  }`}>
                    {message.content}
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
                <div className="bg-white/5 border border-white/10 p-5 rounded-[24px] rounded-tl-none">
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

        {/* Chat Input & Suggestions Area */}
        <div className="p-6 md:p-10 border-t border-white/5 bg-[#0c0a14]/50 backdrop-blur-md">
          {/* Suggested Prompts */}
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

          {/* Input Box */}
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
    </DashboardLayout>
  )
}
