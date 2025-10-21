import { anthropic, DISPLAY_AGENT_MODEL, DISPLAY_AGENT_SYSTEM_PROMPT } from "@/lib/claude";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Store conversation context for display agent
const displayContexts = new Map<string, any[]>();

export async function POST(request: Request) {
  try {
    const { conversationText } = await request.json();

    // Call Haiku to analyze the conversation and generate UI commands
    const response = await anthropic.messages.create({
      model: DISPLAY_AGENT_MODEL,
      max_tokens: 2048,
      system: DISPLAY_AGENT_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Analyze this conversation snippet and determine if any visualization is needed:\n\n${conversationText}\n\nIf visualization is needed, output the JSON command. If not, output: {"action": "none"}`,
        },
      ],
    });

    // Parse the response
    const content = response.content[0];
    if (content.type === "text") {
      try {
        const command = JSON.parse(content.text);
        return new Response(JSON.stringify(command), {
          headers: { "Content-Type": "application/json" },
        });
      } catch (e) {
        // If not valid JSON, no action needed
        return new Response(JSON.stringify({ action: "none" }), {
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    return new Response(JSON.stringify({ action: "none" }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Display API error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
