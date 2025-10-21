import { anthropic, MAIN_AGENT_MODEL, MAIN_AGENT_SYSTEM_PROMPT } from "@/lib/claude";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Store conversation history per connection
const conversations = new Map<string, any[]>();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("sessionId") || crypto.randomUUID();

  // Initialize WebSocket upgrade
  const upgradeHeader = request.headers.get("upgrade");
  if (upgradeHeader !== "websocket") {
    return new Response("Expected websocket", { status: 426 });
  }

  // Note: In production Next.js, WebSocket support requires custom server
  // For now, this is a template structure
  // You'll need to implement WebSocket handling using ws library in a custom server

  return new Response(
    JSON.stringify({ error: "WebSocket not yet implemented - needs custom server" }),
    { status: 501 }
  );
}

// Alternative: HTTP streaming endpoint (works without WebSocket)
export async function POST(request: Request) {
  try {
    const { message, conversationHistory = [] } = await request.json();

    // Build messages array
    const messages = [
      ...conversationHistory,
      {
        role: "user",
        content: message,
      },
    ];

    // Call Claude API with streaming
    const stream = await anthropic.messages.stream({
      model: MAIN_AGENT_MODEL,
      max_tokens: 4096,
      system: MAIN_AGENT_SYSTEM_PROMPT,
      messages: messages,
    });

    // Create readable stream for response
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (chunk.type === "content_block_delta") {
              const text = chunk.delta.type === "text_delta" ? chunk.delta.text : "";
              controller.enqueue(
                encoder.encode(JSON.stringify({ type: "message", content: text }) + "\n")
              );
            }
          }

          const finalMessage = await stream.finalMessage();
          controller.enqueue(
            encoder.encode(JSON.stringify({ type: "done", message: finalMessage }) + "\n")
          );
          controller.close();
        } catch (error) {
          console.error("Streaming error:", error);
          controller.error(error);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
