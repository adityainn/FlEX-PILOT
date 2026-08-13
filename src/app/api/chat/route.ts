import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({
      model: "gemini-3.5-flash",
      systemInstruction: "You are an AI assistant for Flex Pilot, an accessibility testing platform. Help users fix accessibility issues and understand WCAG rules. Keep responses concise and use Markdown.",
    });

    let formattedMessages = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    // Gemini API requires the conversation to start with a 'user' role
    if (formattedMessages.length > 0 && formattedMessages[0].role === "model") {
      formattedMessages.shift();
    }

    const responseStream = await model.generateContentStream({
      contents: formattedMessages
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of responseStream.stream) {
            const chunkText = chunk.text();
            if (chunkText) {
              controller.enqueue(encoder.encode(chunkText));
            }
          }
          controller.close();
        } catch (error) {
          console.error("Gemini stream error:", error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error: any) {
    console.error("Chat API error:", error);

    // Handle rate limits gracefully by streaming a helpful message back to the user
    if (error.status === 429) {
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode("⚠️ **API Rate Limit Exceeded**\n\nThe free-tier Gemini API key has run out of quota (too many requests). Please wait a while before trying again, or configure a paid API key in your environment variables."));
          controller.close();
        }
      });
      return new Response(stream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      });
    }

    return new Response(JSON.stringify({ error: "Failed to process chat" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
