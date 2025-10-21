"use client";

import { X } from "lucide-react";

interface SettingsPanelProps {
  onClose: () => void;
  canvasRatio: number;
  onCanvasRatioChange: (ratio: number) => void;
}

export default function SettingsPanel({
  onClose,
  canvasRatio,
  onCanvasRatioChange,
}: SettingsPanelProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="glass-strong rounded-lg w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Settings</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Canvas/Terminal Split
            </label>
            <input
              type="range"
              min="0.25"
              max="0.75"
              step="0.05"
              value={canvasRatio}
              onChange={(e) => onCanvasRatioChange(parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>25% Canvas</span>
              <span>{Math.round(canvasRatio * 100)}%</span>
              <span>75% Canvas</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Primary Model
            </label>
            <select className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm">
              <option value="claude-sonnet-4">Claude Sonnet 4</option>
              <option value="claude-opus-4">Claude Opus 4</option>
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">Enable Display Agent</span>
            </label>
            <p className="text-xs text-muted-foreground mt-1">
              Haiku agent will automatically create visualizations
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
