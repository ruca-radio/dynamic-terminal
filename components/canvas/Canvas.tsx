"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Component } from "@/types";
import ComponentRenderer from "./ComponentRenderer";

export default function Canvas() {
  const [components, setComponents] = useState<Component[]>([]);

  useEffect(() => {
    // Initialize WebSocket connection to display agent
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(`${protocol}//${window.location.host}/api/display`);

    ws.onopen = () => {
      console.log("Connected to display agent");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.action === "render") {
        // Create new component
        const newComponent: Component = {
          id: data.componentId,
          type: data.type,
          position: data.position || "auto",
          size: data.size || { width: 400, height: 300 },
          props: data.props || {},
        };
        setComponents((prev) => [...prev, newComponent]);
      } else if (data.action === "update") {
        // Update existing component
        setComponents((prev) =>
          prev.map((comp) =>
            comp.id === data.componentId
              ? { ...comp, props: { ...comp.props, ...data.props } }
              : comp
          )
        );
      } else if (data.action === "destroy") {
        // Remove component
        setComponents((prev) =>
          prev.filter((comp) => comp.id !== data.componentId)
        );
      }
    };

    ws.onerror = (error) => {
      console.error("Display agent WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("Disconnected from display agent");
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="h-full w-full relative bg-background/50">
      {components.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <div className="text-4xl mb-2">✨</div>
            <div className="text-sm">Dynamic canvas ready</div>
            <div className="text-xs mt-1 opacity-50">
              Components will appear here as AI analyzes your campaigns
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {components.map((component) => (
          <motion.div
            key={component.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="absolute"
            style={
              component.position !== "auto"
                ? {
                    left: component.position.x,
                    top: component.position.y,
                    width: component.size.width,
                    height: component.size.height,
                  }
                : {}
            }
          >
            <ComponentRenderer component={component} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
