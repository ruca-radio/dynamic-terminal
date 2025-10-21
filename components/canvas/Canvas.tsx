"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCanvas } from "@/lib/canvas-context";
import { Loader2 } from "lucide-react";
import ComponentRenderer from "./ComponentRenderer";

export default function Canvas() {
  const { components, isRendering } = useCanvas();

  return (
    <div className="h-full w-full relative bg-background/50">
      {components.length === 0 && !isRendering && (
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

      {isRendering && components.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <div className="text-sm text-muted-foreground">Rendering visualization...</div>
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
