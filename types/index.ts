export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

export interface Component {
  id: string;
  type: string;
  position: { x: number; y: number } | "auto";
  size: { width: number; height: number };
  props: Record<string, any>;
  zIndex?: number;
}

export interface UICommand {
  action: "render" | "update" | "destroy";
  componentId: string;
  type?: string;
  position?: { x: number; y: number } | "auto";
  size?: { width: number; height: number };
  props?: Record<string, any>;
}

export interface Settings {
  primaryModel: "claude-sonnet-4" | "claude-opus-4";
  displayAgentEnabled: boolean;
  canvasRatio: number;
  mcpEndpoints: {
    googleAds: string;
    memory: string;
  };
}
