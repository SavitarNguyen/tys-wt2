import { mockRefineText } from "./mockRefiner";
import { openAIRefineText } from "./openaiRefiner";
import { geminiRefineText } from "./geminiRefiner";
import { Instruction } from "./instructions";

const defaultRefiner = "gemini";

export async function refineText(
  text: string,
  instructions: Instruction[]
): Promise<string> {
  const refiner = process.env.REFINER ?? defaultRefiner;
  if (refiner === "openai") {
    return openAIRefineText(text, instructions);
  } else if (refiner === "gemini") {
    return geminiRefineText(text, instructions);
  } else {
    return mockRefineText(text, instructions);
  }
}
