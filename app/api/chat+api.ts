import { openai } from "@ai-sdk/openai";
import { groq } from "@ai-sdk/groq";
import { streamText } from "ai";
import {
  generateText,
  wrapLanguageModel,
  extractReasoningMiddleware,
} from "ai";

export async function POST(req: Request) {
  const { messages } = await req.json();

  // middleware to extract reasoning tokens
  const enhancedModel = wrapLanguageModel({
    model: groq("deepseek-r1-distill-qwen-32b"),
    middleware: extractReasoningMiddleware({ tagName: "think" }),
  });

  const result = streamText({
    model: openai('gpt-4o'), //enhancedModel, 
    messages,
  });

  return result.toDataStreamResponse();
  // return result.toDataStreamResponse({
  //   headers: {
  //     "Content-Type": "application/octet-stream",
  //   },
  //   sendReasoning: true,
  // });
}
