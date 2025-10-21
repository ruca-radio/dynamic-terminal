import { anthropic, DISPLAY_AGENT_MODEL, DISPLAY_AGENT_SYSTEM_PROMPT } from "@/lib/claude";
import { openai, OPENAI_DISPLAY_MODEL, OPENAI_DISPLAY_SYSTEM_PROMPT } from "@/lib/openai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DISPLAY_PROVIDER = process.env.DISPLAY_AGENT_PROVIDER || "anthropic";

export async function POST(request: Request) {
  try {
    const { conversationText } = await request.json();

    let command;

    if (DISPLAY_PROVIDER === "openai") {
      // Use OpenAI GPT-4o (with vision support)
      const response = await openai.chat.completions.create({
        model: OPENAI_DISPLAY_MODEL,
        messages: [
          {
            role: "system",
            content: OPENAI_DISPLAY_SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: `Analyze this conversation snippet and determine if any visualization is needed:\n\n${conversationText}\n\nOutput the JSON command or {"action": "none"}`,
          },
        ],
        temperature: 0.3,
        max_tokens: 1000,
      });

      const content = response.choices[0]?.message?.content || "";
      try {
        command = JSON.parse(content);
      } catch (e) {
        // Try to extract JSON from markdown code blocks
        const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
        if (jsonMatch) {
          command = JSON.parse(jsonMatch[1]);
        } else {
          command = { action: "none" };
        }
      }
    } else {
      // Use Anthropic Claude Haiku
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

      const content = response.content[0];
      if (content.type === "text") {
        try {
          command = JSON.parse(content.text);
        } catch (e) {
          command = { action: "none" };
        }
      } else {
        command = { action: "none" };
      }
    }

    return new Response(JSON.stringify(command), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Display API error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
