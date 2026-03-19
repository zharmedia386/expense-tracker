"use client"

import ReactMarkdown from "react-markdown"
import type { Components } from "react-markdown"

const chatMarkdownComponents: Components = {
  p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
  strong: ({ children }) => (
    <strong className="font-semibold text-[#c084fc]">{children}</strong>
  ),
  em: ({ children }) => <em className="italic text-white/90">{children}</em>,
  ul: ({ children }) => (
    <ul className="list-disc list-inside mb-3 space-y-1 text-white/90">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside mb-3 space-y-1.5 text-white/90">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="[&>p]:inline [&>p]:my-0 [&_strong]:text-[#c084fc]">{children}</li>
  ),
  h1: ({ children }) => (
    <h1 className="text-lg font-bold text-white mb-2 mt-4 first:mt-0">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-base font-bold text-white mb-1.5 mt-3 first:mt-0">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-sm font-semibold text-white mb-1 mt-2 first:mt-0">{children}</h3>
  ),
  code: ({ children }) => (
    <code className="px-1.5 py-0.5 rounded bg-white/10 text-[#c084fc] text-xs font-mono">
      {children}
    </code>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-[#7b39fc]/50 pl-4 my-3 text-white/80 italic">
      {children}
    </blockquote>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#9055ff] hover:text-[#c084fc] underline transition-colors"
    >
      {children}
    </a>
  ),
}

interface ChatMarkdownProps {
  content: string
  className?: string
}

export function ChatMarkdown({ content, className = "" }: ChatMarkdownProps) {
  return (
    <div className={`text-white/90 [&_*]:text-inherit ${className}`}>
      <ReactMarkdown components={chatMarkdownComponents}>{content}</ReactMarkdown>
    </div>
  )
}
