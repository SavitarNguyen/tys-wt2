import { InstructionName } from "@/lib/refiner/instructions";
import { atomWithStorage } from "jotai/utils";
import { DEMO_INSTRUCTION_NAMES, DEMO_TEXT } from "./constants";
import { atom } from "jotai";
import { IELTSFeedback } from "@/lib/types/ielts";

export const textAtom = atomWithStorage("text", DEMO_TEXT);
export const instructionNamesAtom = atomWithStorage<InstructionName[]>(
  "instructionNames",
  DEMO_INSTRUCTION_NAMES
);
export const loadingAtom = atom(false);
export const showDiffAtom = atomWithStorage("showDiff", true);

export const resultAtom = atom<JSX.Element[]>([]);
export const refinedAtom = atom("");
export const isIELTSModeAtom = atom(false);
export const ieltsFeedbackAtom = atom<IELTSFeedback | null>(null);

// Streaming progress state
export const streamingProgressAtom = atom<number>(0); // 0-100 percentage
export const streamingStatusAtom = atom<string>(""); // Status message
export const streamingCharsReceivedAtom = atom<number>(0); // Character count
