"use client";

import { useState, useRef, useEffect } from "react";
import { generateId } from "@/lib/utils";
import type { Message } from "@/types";
import MessageList from "./MessageList";
import InputArea from "./InputArea";

export default function Terminal() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: generateId(),
      role: "system",
      content: "Google Ads AI Optimization Interface initialized. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Initialize WebSocket connection to main chat agent
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(`${protocol}//${window.location.host}/api/chat`);

    ws.onopen = () => {
      console.log("Connected to main agent");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "message") {
        setMessages((prev) => [
          ...prev,
          {
            id: generateId(),
            role: "assistant",
            content: data.content,
            timestamp: new Date(),
          },
        ]);
      } else if (data.type === "done") {
        setIsProcessing(false);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          role: "system",
          content: "Connection error. Please refresh the page.",
          timestamp: new Date(),
        },
      ]);
    };

    ws.onclose = () => {
      console.log("Disconnected from main agent");
    };

    wsRef.current = ws;

    return () => {
      ws.close();
    };
  }, []);

  const handleSendMessage = (content: string) => {
    if (!content.trim() || !wsRef.current) return;

    // Add user message
    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsProcessing(true);

    // Send to WebSocket
    wsRef.current.send(JSON.stringify({ content }));
  };

  return (
    <div className="h-full flex flex-col">
      <MessageList messages={messages} isProcessing={isProcessing} />
      <InputArea onSend={handleSendMessage} disabled={isProcessing} />
    </div>
  );
}
