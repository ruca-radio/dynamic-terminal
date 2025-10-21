"use client";

import { useState, useRef } from "react";
import { generateId } from "@/lib/utils";
import { parseUICommands } from "@/lib/ui-parser";
import type { Message, Component } from "@/types";
import { useCanvas } from "@/lib/canvas-context";
import MessageList from "./MessageList";
import InputArea from "./InputArea";

export default function Terminal() {
  const { addComponent, updateComponent, removeComponent } = useCanvas();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: generateId(),
      role: "system",
      content: "Google Ads AI Optimization Interface initialized. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const conversationHistory = useRef<any[]>([]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isProcessing) return;

    // Add user message
    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsProcessing(true);

    // Add to conversation history
    conversationHistory.current.push({ role: "user", content });

    try {
      // Call chat API with streaming
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          conversationHistory: conversationHistory.current,
        }),
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";
      const assistantId = generateId();

      // Add initial assistant message
      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          role: "assistant",
          content: "",
          timestamp: new Date(),
        },
      ]);

      // Stream the response
      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter((line) => line.trim());

        for (const line of lines) {
          try {
            const data = JSON.parse(line);

            if (data.type === "message") {
              assistantContent += data.content;

              // Parse UI commands from content
              const parsed = parseUICommands(assistantContent);

              // Update assistant message with text only (UI commands removed)
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantId
                    ? { ...msg, content: parsed.text }
                    : msg
                )
              );

              // Add any new components to canvas
              parsed.components.forEach((component) => {
                // Check if component already added
                addComponent(component);
              });
            } else if (data.type === "done") {
              conversationHistory.current.push({
                role: "assistant",
                content: assistantContent,
              });
              setIsProcessing(false);
            }
          } catch (e) {
            console.error("Error parsing stream:", e);
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          role: "system",
          content: "Error connecting to AI. Please try again.",
          timestamp: new Date(),
        },
      ]);
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <MessageList messages={messages} isProcessing={isProcessing} />
      <InputArea onSend={handleSendMessage} disabled={isProcessing} />
    </div>
  );
}
