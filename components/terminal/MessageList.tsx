"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { Message } from "@/types";
import { Loader2 } from "lucide-react";

interface MessageListProps {
  messages: Message[];
  isProcessing: boolean;
}

export default function MessageList({ messages, isProcessing }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
    >
      {messages.map((message) => (
        <motion.div
          key={message.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-[80%] rounded-lg px-4 py-2 ${
              message.role === "user"
                ? "bg-primary text-primary-foreground"
                : message.role === "system"
                ? "bg-accent/20 text-accent-foreground border border-accent/30"
                : "glass"
            }`}
          >
            <div className="text-sm whitespace-pre-wrap">{message.content}</div>
            <div className="text-xs opacity-50 mt-1">
              {message.timestamp.toLocaleTimeString()}
            </div>
          </div>
        </motion.div>
      ))}

      {isProcessing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 text-muted-foreground"
        >
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Thinking...</span>
        </motion.div>
      )}
    </div>
  );
}
