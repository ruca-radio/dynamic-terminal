"use client";

import { useState } from "react";
import Terminal from "@/components/terminal/Terminal";
import Canvas from "@/components/canvas/Canvas";
import SettingsPanel from "@/components/ui/SettingsPanel";

export default function Home() {
  const [canvasRatio, setCanvasRatio] = useState(0.75);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <main className="h-screen w-screen overflow-hidden bg-background flex flex-col">
      {/* Header */}
      <header className="h-12 border-b border-border flex items-center justify-between px-4 glass">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse-slow" />
          <h1 className="text-sm font-medium">Google Ads AI Optimization</h1>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="text-xs px-3 py-1 rounded-md hover:bg-white/5 transition-colors"
        >
          Settings
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Canvas Zone (Dynamic UI) */}
        <div
          className="relative overflow-hidden"
          style={{ width: `${canvasRatio * 100}%` }}
        >
          <Canvas />
        </div>

        {/* Terminal Zone (Chat/Input) */}
        <div
          className="border-l border-border overflow-hidden"
          style={{ width: `${(1 - canvasRatio) * 100}%` }}
        >
          <Terminal />
        </div>
      </div>

      {/* Settings Overlay */}
      {showSettings && (
        <SettingsPanel
          onClose={() => setShowSettings(false)}
          canvasRatio={canvasRatio}
          onCanvasRatioChange={setCanvasRatio}
        />
      )}
    </main>
  );
}
