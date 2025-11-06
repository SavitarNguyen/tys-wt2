export type InstructionName = "ielts";

export interface InstructionGroup {
  groupName: string;
  emoji: string;
  instructions: Instruction[];
}

export interface Instruction {
  name: InstructionName;
  title: string;
  prompt: string;
  emoji: string;
}

export const instructionGroups: InstructionGroup[] = [
  {
    groupName: "AI Corrector",
    emoji: "🤖",
    instructions: [
      {
        name: "ielts",
        title: "IELTS Feedback",
        prompt: "Provide comprehensive IELTS Writing Task 2 feedback with band scores, detailed feedback, corrections, and sample model answer.",
        emoji: "📝",
      },
    ],
  },
];

export const instructions: Instruction[] = instructionGroups.flatMap(
  (group) => group.instructions
);

export function getInstructions(
  instructionNames: InstructionName[]
): Instruction[] {
  return instructions.filter((instruction) =>
    instructionNames.includes(instruction.name)
  );
}
