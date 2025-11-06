import { refineText } from "@/lib/refiner/public";
import { InstructionName, getInstructions } from "@/lib/refiner/instructions";
import { NextResponse } from "next/server";
import { geminiRefineTextStream } from "@/lib/refiner/geminiRefiner";

interface RequestJSON {
  text?: string;
  instructionNames: InstructionName[];
  stream?: boolean;
  apiKey?: string; // Optional: user-provided Gemini API key
}

export async function POST(request: Request) {
  const body: RequestJSON = await request.json();
  const { text, instructionNames, stream = true, apiKey: userApiKey } = body;

  if (!text) {
    return NextResponse.json({ error: "No text provided" });
  }

  const instructions = getInstructions(instructionNames);

  // If streaming is enabled (default), use streaming API
  if (stream) {
    const encoder = new TextEncoder();

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of geminiRefineTextStream(text, instructions)) {
            // Send chunk as Server-Sent Events format
            const data = JSON.stringify({ chunk });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }

          // Send done signal
          controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
          controller.close();
        } catch (error) {
          console.error("Streaming error:", error);
          const errorMessage = error instanceof Error ? error.message : "Streaming failed";
          const errorData = JSON.stringify({ error: errorMessage });
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  }

  // Fallback to non-streaming mode
  const refined = await refineText(text, instructions);
  return NextResponse.json({ text, refined: refined });
}
