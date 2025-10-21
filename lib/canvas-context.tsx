"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { Component } from "@/types";

interface CanvasContextType {
  components: Component[];
  addComponent: (component: Component) => void;
  updateComponent: (id: string, props: Record<string, any>) => void;
  removeComponent: (id: string) => void;
}

const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

export function CanvasProvider({ children }: { children: ReactNode }) {
  const [components, setComponents] = useState<Component[]>([]);

  const addComponent = (component: Component) => {
    setComponents((prev) => [...prev, component]);
  };

  const updateComponent = (id: string, props: Record<string, any>) => {
    setComponents((prev) =>
      prev.map((comp) =>
        comp.id === id ? { ...comp, props: { ...comp.props, ...props } } : comp
      )
    );
  };

  const removeComponent = (id: string) => {
    setComponents((prev) => prev.filter((comp) => comp.id !== id));
  };

  return (
    <CanvasContext.Provider
      value={{ components, addComponent, updateComponent, removeComponent }}
    >
      {children}
    </CanvasContext.Provider>
  );
}

export function useCanvas() {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error("useCanvas must be used within CanvasProvider");
  }
  return context;
}
